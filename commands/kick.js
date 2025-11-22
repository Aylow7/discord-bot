import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulser un membre du serveur')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre à expulser').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison de l\'expulsion'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Ce membre n\'est pas sur le serveur.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous ne pouvez pas expulser ce membre car son rôle est supérieur ou égal au vôtre.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!member.kickable) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Je ne peux pas expulser ce membre.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle('`👢`〃Member Kicked')
                .setDescription(`> *${user} (\`${user.id}\` | \`${user.tag}\`) a été expulsé !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande kick:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
