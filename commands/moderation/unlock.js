import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from 'discord.js';
import { redColor, greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Déverrouiller un salon')
        .addChannelOption(opt => opt.setName('channel').setDescription('Le salon (actuel par défaut)').addChannelTypes(ChannelType.GuildText))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            });

            const embed = new EmbedBuilder()
                .setTitle('`🔓`〃Channel Unlocked')
                .setDescription(`> *${channel} a été déverrouillé !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur unlock:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
