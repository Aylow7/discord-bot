import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Traduire un texte (requiert une API)')
        .addStringOption(opt => opt.setName('text').setDescription('Le texte à traduire').setRequired(true))
        .addStringOption(opt => opt.setName('to').setDescription('Langue cible (en, fr, es...)').setRequired(true)),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`🌐`〃Translate')
                .setDescription('> *Cette commande nécessite une API de traduction externe.*\n> *Fonctionnalité à implémenter.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur translate:', error);
        }
    }
};
