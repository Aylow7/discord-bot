import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('Softban un membre (ban puis unban pour supprimer les messages)')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'Aucune raison';
            
            await interaction.guild.members.ban(user, { reason, deleteMessageSeconds: 604800 });
            await interaction.guild.members.unban(user.id);

            const embed = new EmbedBuilder()
                .setTitle('`🔨`〃Member Softbanned')
                .setDescription(`> *${user.tag} a été softban !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur softban:', error);
        }
    }
};
