import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('base64')
        .setDescription('Encoder/Décoder en Base64')
        .addStringOption(opt => 
            opt.setName('action')
                .setDescription('Action')
                .setRequired(true)
                .addChoices(
                    { name: 'Encoder', value: 'encode' },
                    { name: 'Décoder', value: 'decode' }
                )
        )
        .addStringOption(opt => opt.setName('text').setDescription('Le texte').setRequired(true)),

    async execute(interaction) {
        try {
            const action = interaction.options.getString('action');
            const text = interaction.options.getString('text');

            let result;
            if (action === 'encode') {
                result = Buffer.from(text).toString('base64');
            } else {
                try {
                    result = Buffer.from(text, 'base64').toString('utf-8');
                } catch (e) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription('> *Texte Base64 invalide !*')
                        .setColor('Red')
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('`🔐`〃Base64 Converter')
                .setDescription(
                    `> **Action :** ${action === 'encode' ? 'Encodage' : 'Décodage'}\n\n` +
                    `> **Entrée :**\n\`\`\`\n${text.substring(0, 1000)}\n\`\`\`\n` +
                    `> **Sortie :**\n\`\`\`\n${result.substring(0, 1000)}\n\`\`\``
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur base64:', error);
        }
    }
};
