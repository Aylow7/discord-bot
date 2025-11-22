import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';
import { parseDuration } from '../../utils/parseDuration.js';

export default {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Bannir temporairement un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addStringOption(opt => opt.setName('duration').setDescription('Durée (ex: 1d, 12h)').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const duration = interaction.options.getString('duration');
            const reason = interaction.options.getString('reason') || 'Aucune raison';
            
            const ms = parseDuration(duration);
            if (!ms) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Duration')
                    .setDescription('> *Durée invalide.*')
                    .setColor('Red')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await interaction.guild.members.ban(user, { reason });

            const embed = new EmbedBuilder()
                .setTitle('`⏰`〃Temporary Ban')
                .setDescription(`> *${user.tag} a été banni pour \`${duration}\` !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                try {
                    await interaction.guild.members.unban(user.id, 'Tempban expiré');
                } catch (e) {
                    console.error('Erreur unban auto:', e);
                }
            }, ms);

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur tempban:', error);
        }
    }
};
