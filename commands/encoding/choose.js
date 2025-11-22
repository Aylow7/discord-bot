import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Choisir entre plusieurs options')
        .addStringOption(opt => opt.setName('options').setDescription('Options séparées par des virgules').setRequired(true)),

    async execute(interaction) {
        try {
            const options = interaction.options.getString('options').split(',').map(o => o.trim());

            if (options.length < 2) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Not Enough Options')
                    .setDescription('> *Veuillez fournir au moins 2 options séparées par des virgules.*')
                    .setColor('Red')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const choice = options[Math.floor(Math.random() * options.length)];

            const embed = new EmbedBuilder()
                .setTitle('`🤔`〃Choice')
                .setDescription(
                    `> **Options :** ${options.join(', ')}\n\n` +
                    `> **Mon choix :** ${choice}`
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur choose:', error);
        }
    }
};
