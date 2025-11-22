import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount, getBotStartTime } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Affiche le temps de fonctionnement du bot'),

    async execute(interaction) {
        try {
            const startTime = getBotStartTime();
            const uptime = Date.now() - startTime;

            const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

            const uptimeString = `\`${days}j ${hours}h ${minutes}m ${seconds}s\``;

            const embed = new EmbedBuilder()
                .setTitle('`⏰`〃Bot Uptime')
                .setDescription(`> *Le bot est en ligne depuis :*\n> ${uptimeString}`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande uptime:', error);
        }
    }
};
