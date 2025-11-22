import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('Parler avec une IA')
        .addStringOption(opt => opt.setName('prompt').setDescription('Votre message').setRequired(true)),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`🤖`〃AI Chat')
                .setDescription(
                    '> *Cette commande nécessite une intégration IA.*\n' +
                    '> *APIs suggérées : OpenAI API, Anthropic API, Groq API*\n' +
                    '> *Fonctionnalité à implémenter avec clé API.*'
                )
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur ai:', error);
        }
    }
};
