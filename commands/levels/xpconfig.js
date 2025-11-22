import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from 'discord.js';
import { setLvlUpChannelId, getLvlUpChannelId } from '../../utils/xp.js';
import { greenColor, redColor } from '../../config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('xpconfig')
        .setDescription('Configurer le channel de level up')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Définir le channel de level up')
                .addChannelOption(opt =>
                    opt.setName('channel')
                        .setDescription('Le channel où envoyer les messages de level up')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('Voir le channel de level up configuré')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();

            if (sub === 'set') {
                const channel = interaction.options.getChannel('channel');
                
                setLvlUpChannelId(interaction.guildId, channel.id);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃XP Config Updated')
                    .setDescription(`> *Channel de level up défini sur ${channel} !*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            } else if (sub === 'view') {
                const channelId = getLvlUpChannelId(interaction.guildId);
                
                if (!channelId) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃No Config')
                        .setDescription('> *Aucun channel de level up configuré.*')
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('`📋`〃XP Config')
                    .setDescription(`> *Channel de level up: <#${channelId}>*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur dans xpconfig:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription('> *Une erreur est survenue.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
