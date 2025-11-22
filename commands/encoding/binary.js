import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('binary')
        .setDescription('Convertir du texte en binaire')
        .addStringOption(opt => opt.setName('text').setDescription('Le texte').setRequired(true)),

    async execute(interaction) {
        try {
            const text = interaction.options.getString('text');
            const binary = text.split('').map(char => 
                char.charCodeAt(0).toString(2).padStart(8, '0')
            ).join(' ');

            const embed = new EmbedBuilder()
                .setTitle('`💾`〃Binary Converter')
                .setDescription(
                    `> **Texte :** ${text}\n\n` +
                    `> **Binaire :**\n\`\`\`\n${binary}\n\`\`\``
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur binary:', error);
        }
    }
};
