import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Ajouter un rôle à un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
            const member = await interaction.guild.members.fetch(user.id);

            if (member.roles.cache.has(role.id)) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription(`> *${user} possède déjà ce rôle !*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.roles.add(role);

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Role Added')
                .setDescription(`> *Le rôle ${role} a été ajouté à ${user} !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur addrole:', error);
        }
    }
};
