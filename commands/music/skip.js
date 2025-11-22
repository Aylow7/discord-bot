import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from 'discord-player';
import { redColor, greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Passer à la musique suivante'),

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
            
            if (!queue || !queue.isPlaying()) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Erreur')
                    .setDescription('> *Aucune musique n\'est en cours de lecture*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (queue.tracks.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Erreur')
                    .setDescription('> *Pas de musique suivante dans la file*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const skipped = queue.node.skip();

            if (!skipped) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Erreur')
                    .setDescription('> *Impossible de passer la musique*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('`⏭️`〃Musique Passée')
                .setDescription('> *Passage à la musique suivante*')
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur skip:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Erreur')
                .setDescription('> *Une erreur est survenue*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
