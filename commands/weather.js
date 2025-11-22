import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Voir la météo')
        .addStringOption(opt => opt.setName('city').setDescription('La ville').setRequired(true)),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`🌤️`〃Weather')
                .setDescription(
                    '> *Cette commande nécessite une API météo externe.*\n' +
                    '> *API suggérée : OpenWeatherMap API*\n' +
                    '> *Fonctionnalité à implémenter.*'
                )
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur weather:', error);
        }
    }
};
