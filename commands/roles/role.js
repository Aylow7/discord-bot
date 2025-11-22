import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor, blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Gérer les rôles d\'un membre')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Ajouter un rôle à un membre')
                .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
                .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Retirer un rôle à un membre')
                .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
                .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('info')
                .setDescription('Informations sur un rôle')
                .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('Liste tous les rôles du serveur')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();

            if (sub === 'add') {
                const user = interaction.options.getUser('user');
                const role = interaction.options.getRole('role');
                const member = await interaction.guild.members.fetch(user.id);

                if (role.position >= interaction.guild.members.me.roles.highest.position) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription(`> *Ce rôle est trop élevé pour moi.*`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                await member.roles.add(role);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Role Added')
                    .setDescription(`> *Rôle ${role} ajouté à ${user} !*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'remove') {
                const user = interaction.options.getUser('user');
                const role = interaction.options.getRole('role');
                const member = await interaction.guild.members.fetch(user.id);

                if (role.position >= interaction.guild.members.me.roles.highest.position) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription(`> *Ce rôle est trop élevé pour moi.*`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                await member.roles.remove(role);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Role Removed')
                    .setDescription(`> *Rôle ${role} retiré à ${user} !*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'info') {
                const role = interaction.options.getRole('role');

                const embed = new EmbedBuilder()
                    .setTitle('`ℹ️`〃Role Information')
                    .setDescription(
                        `> *Nom : ${role}*\n` +
                        `> *ID : \`${role.id}\`*\n` +
                        `> *Couleur : \`${role.hexColor}\`*\n` +
                        `> *Position : \`${role.position}\`*\n` +
                        `> *Membres : \`${role.members.size}\`*\n` +
                        `> *Mentionnable : \`${role.mentionable ? 'Oui' : 'Non'}\`*\n` +
                        `> *Affiché séparément : \`${role.hoist ? 'Oui' : 'Non'}\`*\n` +
                        `> *Créé le : <t:${Math.floor(role.createdTimestamp / 1000)}:F>*`
                    )
                    .setColor(role.hexColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'list') {
                const roles = interaction.guild.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map(r => `${r}`)
                    .slice(0, 50)
                    .join(', ');

                const embed = new EmbedBuilder()
                    .setTitle('`📋`〃Roles List')
                    .setDescription(`> *Total : \`${interaction.guild.roles.cache.size}\` rôles*\n\n${roles}`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

                await interaction.reply({ embeds: [embed] });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur role:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
