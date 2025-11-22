import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Créer un embed personnalisé')
        .addStringOption(opt => opt.setName('title').setDescription('Titre').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Description').setRequired(true))
        .addStringOption(opt => opt.setName('color').setDescription('Couleur (hex)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        try {
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            let color = interaction.options.getString('color') || blueColor;

            if (!color.startsWith('#')) color = '#' + color;

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            await interaction.channel.send({ embeds: [embed] });
            await interaction.reply({ content: '> *Embed créé !*', ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur embed:', error);
        }
    }
};
