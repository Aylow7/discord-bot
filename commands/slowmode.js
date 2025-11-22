import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Activer le mode lent sur un salon')
        .addIntegerOption(opt => opt.setName('seconds').setDescription('Délai en secondes (0 pour désactiver)').setRequired(true).setMinValue(0).setMaxValue(21600))
        .addChannelOption(opt => opt.setName('channel').setDescription('Le salon (actuel par défaut)').addChannelTypes(ChannelType.GuildText))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            const seconds = interaction.options.getInteger('seconds');
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            await channel.setRateLimitPerUser(seconds);

            const embed = new EmbedBuilder()
                .setTitle('`⏱️`〃Slowmode Updated')
                .setDescription(seconds === 0 
                    ? `> *Mode lent désactivé sur ${channel} !*`
                    : `> *Mode lent activé sur ${channel} !*\n> **Délai :** \`${seconds}s\``)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur slowmode:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
