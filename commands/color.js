import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Afficher une couleur')
        .addStringOption(opt => opt.setName('hex').setDescription('Code hexadécimal (ex: #FF0000)').setRequired(true)),

    async execute(interaction) {
        try {
            let hex = interaction.options.getString('hex').toUpperCase();
            if (!hex.startsWith('#')) hex = '#' + hex;

            if (!/^#[0-9A-F]{6}$/i.test(hex)) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Color')
                    .setDescription('> *Couleur invalide ! Format : #RRGGBB*')
                    .setColor('Red')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);

            const embed = new EmbedBuilder()
                .setTitle('`🎨`〃Color')
                .setDescription(
                    `> **HEX :** \`${hex}\`\n` +
                    `> **RGB :** \`rgb(${r}, ${g}, ${b})\`\n` +
                    `> **DEC :** \`${parseInt(hex.slice(1), 16)}\``
                )
                .setColor(hex)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur color:', error);
        }
    }
};
