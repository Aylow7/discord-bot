import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('deleterole')
        .setDescription('Supprimer un rôle')
        .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');
            const roleName = role.name;

            await role.delete();

            const embed = new EmbedBuilder()
                .setTitle('`🗑️`〃Role Deleted')
                .setDescription(`> *Le rôle \`${roleName}\` a été supprimé !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur deleterole:', error);
        }
    }
};
