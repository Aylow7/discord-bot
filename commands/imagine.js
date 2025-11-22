import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('imagine')
        .setDescription('Générer une image avec IA')
        .addStringOption(opt => opt.setName('prompt').setDescription('Description de l\'image').setRequired(true)),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`🎨`〃AI Image Generation')
                .setDescription(
                    '> *Cette commande nécessite une API de génération d\'images.*\n' +
                    '> *APIs suggérées : DALL-E, Midjourney, Stable Diffusion*\n' +
                    '> *Fonctionnalité à implémenter avec clé API.*'
                )
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur imagine:', error);
        }
    }
};
