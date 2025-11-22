import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';
import { parseDuration } from '../utils/parseDuration.js';

export default {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mettre un membre en mute')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addStringOption(opt => opt.setName('duration').setDescription('Durée (ex: 10m, 1h)').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const duration = interaction.options.getString('duration');
            const reason = interaction.options.getString('reason') || 'Aucune raison';
            const member = await interaction.guild.members.fetch(user.id);

            const ms = parseDuration(duration);
            if (!ms) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Duration')
                    .setDescription('> *Durée invalide.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.timeout(ms, reason);

            const embed = new EmbedBuilder()
                .setTitle('`🔇`〃Member Muted')
                .setDescription(`> *${user} a été mute pour \`${duration}\` !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur mute:', error);
        }
    }
};
