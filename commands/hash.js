import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { createHash } from 'crypto';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hash')
        .setDescription('Hacher du texte')
        .addStringOption(opt => 
            opt.setName('algorithm')
                .setDescription('Algorithme')
                .setRequired(true)
                .addChoices(
                    { name: 'MD5', value: 'md5' },
                    { name: 'SHA-1', value: 'sha1' },
                    { name: 'SHA-256', value: 'sha256' },
                    { name: 'SHA-512', value: 'sha512' }
                )
        )
        .addStringOption(opt => opt.setName('text').setDescription('Le texte').setRequired(true)),

    async execute(interaction) {
        try {
            const algorithm = interaction.options.getString('algorithm');
            const text = interaction.options.getString('text');

            const hash = createHash(algorithm).update(text).digest('hex');

            const embed = new EmbedBuilder()
                .setTitle('`#️⃣`〃Hash Generator')
                .setDescription(
                    `> **Algorithme :** ${algorithm.toUpperCase()}\n` +
                    `> **Texte :** ${text}\n\n` +
                    `> **Hash :**\n\`\`\`\n${hash}\n\`\`\``
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur hash:', error);
        }
    }
};
