import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { greenColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

let player;

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Jouer de la musique')
        .addStringOption(opt => opt.setName('musique').setDescription('Nom ou URL de la musique').setRequired(true)),

    async execute(interaction) {
        try {
            // Vérifier si l'utilisateur est dans un salon vocal
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('`❌`〃Erreur')
                    .setDescription('> *Vous devez être dans un salon vocal pour utiliser cette commande !*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                return;
            }

            await interaction.deferReply();

            // Initialiser le Player si pas encore fait
            if (!player) {
                player = new Player(interaction.client);
                await player.extractors.loadMulti(DefaultExtractors);
                
                // Écouter les événements de la queue
                player.events.on('playerStart', (queue, track) => {
                    console.log(`▶️ Lecture: ${track.title}`);
                });

                player.events.on('playerFinish', (queue) => {
                    console.log('✅ Musique terminée');
                    // Ne pas déconnecter automatiquement
                });

                player.events.on('playerStop', (queue) => {
                    console.log('⏹️ Lecture arrêtée');
                });

                player.events.on('error', (queue, error) => {
                    console.error('Erreur player:', error);
                });

                player.events.on('playerError', (queue, error) => {
                    console.error('Erreur playback:', error);
                    // Si erreur d'extraction, passer à la suivante
                    if (error.code === 'ERR_NO_RESULT' && queue.tracks.length > 0) {
                        console.log('⏭️ Impossible d\'extraire le stream, passage à la musique suivante');
                        queue.node.skip();
                    }
                });

                player.events.on('queueEnd', (queue) => {
                    console.log('📭 Queue vide - Le bot reste connecté');
                });
            }

            const musicName = interaction.options.getString('musique');

            // Chercher la musique
            const result = await player.search(musicName, {
                requestedBy: interaction.user
            }).catch(err => {
                console.error('Erreur recherche:', err);
                return null;
            });

            if (!result || !result.tracks.length) {
                const notFoundEmbed = new EmbedBuilder()
                    .setTitle('`❌`〃Musique non trouvée')
                    .setDescription(`> *Aucune musique trouvée pour "${musicName}"*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.editReply({ embeds: [notFoundEmbed] });
                return;
            }

            // Si plusieurs résultats, afficher un select menu
            if (result.tracks.length > 1) {
                const options = result.tracks.slice(0, 20).map((track, index) => ({
                    label: `${index + 1}. ${track.title.substring(0, 97)}`,
                    description: track.author ? track.author.substring(0, 100) : 'Auteur inconnu',
                    value: String(index)
                }));

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('music_select')
                    .setPlaceholder('Choisir une musique')
                    .addOptions(options);

                const row = new ActionRowBuilder().addComponents(selectMenu);

                const selectEmbed = new EmbedBuilder()
                    .setTitle('`🎵`〃Sélectionner une musique')
                    .setDescription(`> *${result.tracks.length} résultats trouvés pour "${musicName}"*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                const response = await interaction.editReply({ 
                    embeds: [selectEmbed],
                    components: [row]
                });

                // Collecteur pour le select menu
                const collector = response.createMessageComponentCollector({
                    filter: i => i.customId === 'music_select' && i.user.id === interaction.user.id,
                    time: 60000 // 1 minute
                });

                collector.on('collect', async (selectInteraction) => {
                    try {
                        const selectedIndex = parseInt(selectInteraction.values[0]);
                        const selectedTrack = result.tracks[selectedIndex];

                        await selectInteraction.deferUpdate();

                        // Créer ou récupérer la file d'attente
                        let queue = player.queues.get(interaction.guild.id);

                        if (!queue) {
                            queue = player.queues.create(interaction.guild, {
                                metadata: {
                                    channel: interaction.channel
                                },
                                volume: 80,
                                leaveOnEmpty: false,
                                leaveOnEmptyCooldown: 300000,
                                leaveOnFinish: false
                            });
                            
                            // Connecter et jouer
                            try {
                                await queue.connect(voiceChannel);
                            } catch (connectError) {
                                console.error('Erreur connexion:', connectError);
                                const errorEmbed = new EmbedBuilder()
                                    .setTitle('`❌`〃Erreur de connexion')
                                    .setDescription('> *Je ne peux pas me connecter au salon vocal*')
                                    .setColor(redColor)
                                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                                await interaction.editReply({ embeds: [errorEmbed], components: [] });
                                return;
                            }

                            queue.play(selectedTrack);
                        } else {
                            queue.addTrack(selectedTrack);
                        }

                        const playingEmbed = new EmbedBuilder()
                            .setTitle('`🎵`〃Lecture en cours')
                            .setDescription(`> *${selectedTrack.title}*`)
                            .addFields(
                                { name: 'Auteur', value: `> *${selectedTrack.author}*`, inline: true },
                                { name: 'Durée', value: `> *${formatDuration(selectedTrack.durationMS)}*`, inline: true }
                            )
                            .setColor(greenColor)
                            .setThumbnail(selectedTrack.thumbnail)
                            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                        await interaction.editReply({ 
                            embeds: [playingEmbed],
                            components: []
                        });

                        incrementCommandCount();
                    } catch (error) {
                        console.error('Erreur lors de la sélection:', error);
                    }
                });

                collector.on('end', async () => {
                    try {
                        await interaction.editReply({ components: [] }).catch(() => {});
                    } catch (error) {
                        console.error('Erreur lors de la suppression du select:', error);
                    }
                });

                return;
            }

            // Un seul résultat
            const track = result.tracks[0];

            // Créer ou récupérer la file d'attente
            let queue = player.queues.get(interaction.guild.id);

            if (!queue) {
                queue = player.queues.create(interaction.guild, {
                    metadata: {
                        channel: interaction.channel
                    },
                    volume: 80,
                    leaveOnEmpty: false,  // Ne pas quitter si le channel est vide
                    leaveOnEmptyCooldown: 300000,  // 5 minutes avant de quitter
                    leaveOnFinish: false  // Ne pas quitter à la fin
                });
                
                // Connecter et jouer
                try {
                    await queue.connect(voiceChannel);
                } catch (connectError) {
                    console.error('Erreur connexion:', connectError);
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('`❌`〃Erreur de connexion')
                        .setDescription('> *Je ne peux pas me connecter au salon vocal*')
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.editReply({ embeds: [errorEmbed] });
                    return;
                }

                queue.play(track);
            } else {
                // Queue existe déjà, ajouter simplement la track
                queue.addTrack(track);
            }

            const playingEmbed = new EmbedBuilder()
                .setTitle('`🎵`〃Lecture en cours')
                .setDescription(`> *${track.title}*`)
                .addFields(
                    { name: 'Auteur', value: `> *${track.author}*`, inline: true },
                    { name: 'Durée', value: `> *${formatDuration(track.durationMS)}*`, inline: true }
                )
                .setColor(greenColor)
                .setThumbnail(track.thumbnail)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [playingEmbed] });

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur play:', error);
            
            try {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('`❌`〃Une erreur est survenue')
                    .setDescription('> *Une erreur est survenue lors de la lecture de la musique*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('Erreur lors de la réponse:', replyError);
            }
        }
    }
};

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}
