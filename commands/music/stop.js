import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from 'discord-player';
import { redColor, greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Arrêter la musique et quitter le salon vocal'),

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

            queue.destroy();

            const embed = new EmbedBuilder()
                .setTitle('`⏹️`〃Musique Arrêtée')
                .setDescription('> *La musique a été arrêtée et le bot a quitté le salon*')
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur stop:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Erreur')
                .setDescription('> *Une erreur est survenue*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
