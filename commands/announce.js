import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Faire une annonce')
        .addStringOption(opt => opt.setName('message').setDescription('Message').setRequired(true))
        .addChannelOption(opt => opt.setName('channel').setDescription('Salon'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        try {
            const message = interaction.options.getString('message');
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            const embed = new EmbedBuilder()
                .setTitle('`📢`〃Announcement')
                .setDescription(message)
                .setColor(blueColor)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: '> *Annonce envoyée !*', ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur announce:', error);
        }
    }
};
