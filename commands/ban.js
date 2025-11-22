import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un membre du serveur')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre à bannir').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison du bannissement'))
        .addIntegerOption(opt => opt.setName('days').setDescription('Jours de messages à supprimer (0-7)').setMinValue(0).setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
            const days = interaction.options.getInteger('days') || 0;

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            
            if (member) {
                if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription('> *Vous ne pouvez pas bannir ce membre car son rôle est supérieur ou égal au vôtre.*')
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (!member.bannable) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription('> *Je ne peux pas bannir ce membre.*')
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

            await interaction.guild.members.ban(user, { deleteMessageDays: days, reason });

            const embed = new EmbedBuilder()
                .setTitle('`🔨`〃Member Banned')
                .setDescription(`> *${user} (\`${user.id}\` | \`${user.tag}\`) a été banni !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande ban:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
