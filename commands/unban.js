import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Débannir un utilisateur')
        .addStringOption(opt => opt.setName('userid').setDescription('L\'ID de l\'utilisateur à débannir').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison du débannissement'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        try {
            const userId = interaction.options.getString('userid');
            const reason = interaction.options.getString('reason') || 'Aucune raison fournie';

            const bans = await interaction.guild.bans.fetch();
            const bannedUser = bans.find(ban => ban.user.id === userId);

            if (!bannedUser) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Cet utilisateur n\'est pas banni.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await interaction.guild.members.unban(userId, reason);

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Member Unbanned')
                .setDescription(`> *${bannedUser.user.tag} (\`${userId}\`) a été débanni !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande unban:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
