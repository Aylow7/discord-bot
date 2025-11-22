import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('randomnumber')
        .setDescription('Générer un nombre aléatoire')
        .addIntegerOption(opt => opt.setName('min').setDescription('Minimum').setRequired(true))
        .addIntegerOption(opt => opt.setName('max').setDescription('Maximum').setRequired(true)),

    async execute(interaction) {
        try {
            const min = interaction.options.getInteger('min');
            const max = interaction.options.getInteger('max');

            if (min >= max) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Range')
                    .setDescription('> *Le minimum doit être inférieur au maximum !*')
                    .setColor('Red')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const random = Math.floor(Math.random() * (max - min + 1)) + min;

            const embed = new EmbedBuilder()
                .setTitle('`🎲`〃Random Number')
                .setDescription(`> **Nombre aléatoire entre \`${min}\` et \`${max}\` :**\n> # ${random}`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur randomnumber:', error);
        }
    }
};
