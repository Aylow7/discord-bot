import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hex')
        .setDescription('Convertir du texte en hexadécimal')
        .addStringOption(opt => opt.setName('text').setDescription('Le texte').setRequired(true)),

    async execute(interaction) {
        try {
            const text = interaction.options.getString('text');
            const hex = text.split('').map(char => 
                char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')
            ).join(' ');

            const embed = new EmbedBuilder()
                .setTitle('`#️⃣`〃Hex Converter')
                .setDescription(
                    `> **Texte :** ${text}\n\n` +
                    `> **Hexadécimal :**\n\`\`\`\n${hex}\n\`\`\``
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur hex:', error);
        }
    }
};
