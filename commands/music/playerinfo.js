import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { redColor, greenColor } from '../../config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('playerinfo')
        .setDescription('Obtenir les infos du lecteur musical'),

    async execute(interaction) {
        try {
            const player = Player.singleton();

            if (!player) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Erreur')
                    .setDescription('> *Le lecteur n\'est pas initialisé*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const queue = player.queues.get(interaction.guild.id);
            const extractors = player.extractors.collection;

            const embed = new EmbedBuilder()
                .setTitle('`📊`〃Infos Lecteur')
                .addFields(
                    { name: 'Queue Active', value: queue ? '✅ Oui' : '❌ Non', inline: true },
                    { name: 'Musique en cours', value: queue?.isPlaying() ? '▶️ Oui' : '⏹️ Non', inline: true },
                    { name: 'Nombre d\'extracteurs', value: `${extractors.size}`, inline: true }
                )
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            if (queue) {
                embed.addFields(
                    { name: 'Titre actuel', value: `> ${queue.currentTrack?.title || 'Aucun'}`, inline: false },
                    { name: 'File d\'attente', value: `> ${queue.tracks.length} musique(s)`, inline: true },
                    { name: 'Volume', value: `> ${queue.node.volume}%`, inline: true }
                );
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Erreur playerinfo:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Erreur')
                .setDescription(`> *${error.message}*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
