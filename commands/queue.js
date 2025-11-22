import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Voir la file d\'attente de musique'),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`📜`〃Music Queue')
                .setDescription('> *Système de musique non implémenté. Nécessite @discordjs/voice ou discord-player.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur queue:', error);
        }
    }
};
