import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Calculer la compatibilité entre deux personnes')
        .addUserOption(opt => opt.setName('user1').setDescription('Première personne').setRequired(true))
        .addUserOption(opt => opt.setName('user2').setDescription('Deuxième personne').setRequired(true)),

    async execute(interaction) {
        try {
            const user1 = interaction.options.getUser('user1');
            const user2 = interaction.options.getUser('user2');
            const percentage = Math.floor(Math.random() * 101);
            
            let message = '';
            if (percentage < 20) message = 'Pas du tout compatible... 💔';
            else if (percentage < 40) message = 'Peu compatible 😕';
            else if (percentage < 60) message = 'Moyennement compatible 😐';
            else if (percentage < 80) message = 'Bien compatible ! 💗';
            else message = 'Parfaitement compatible ! 💞';

            const embed = new EmbedBuilder()
                .setTitle('`💕`〃Ship')
                .setDescription(
                    `> *Compatibilité entre ${user1} et ${user2}*\n\n` +
                    `> **${percentage}%**\n` +
                    `> ${message}`
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur ship:', error);
        }
    }
};
