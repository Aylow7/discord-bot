import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Convertir du texte en ASCII art')
        .addStringOption(opt => opt.setName('text').setDescription('Le texte').setRequired(true)),

    async execute(interaction) {
        try {
            const text = interaction.options.getString('text');

            const asciiMap = {
                'A': '    A    \n   A A   \n  AAAAA  \n A     A \nA       A',
                'B': 'BBBBBB  \nB     B \nBBBBBB  \nB     B \nBBBBBB  ',
                'C': ' CCCCC  \nC     C \nC       \nC     C \n CCCCC  '
            };

            const lines = ['', '', '', '', ''];
            for (const char of text.toUpperCase()) {
                if (char === ' ') {
                    for (let i = 0; i < 5; i++) lines[i] += '  ';
                } else if (asciiMap[char]) {
                    const charLines = asciiMap[char].split('\n');
                    for (let i = 0; i < 5; i++) lines[i] += charLines[i] + ' ';
                }
            }

            const asciiArt = lines.join('\n');

            const embed = new EmbedBuilder()
                .setTitle('`🔤`〃ASCII Art')
                .setDescription(`\`\`\`\n${asciiArt || 'Caractères non supportés'}\n\`\`\``)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur ascii:', error);
        }
    }
};
