import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getGuildXPConfig, setGuildConfig } from '../../utils/xp.js';
import { greenColor, redColor, blueColor } from '../../config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rolebonus')
        .setDescription('Gérer les bonus XP des rôles')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Ajouter un bonus XP à un rôle')
                .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true))
                .addIntegerOption(opt => 
                    opt.setName('bonus')
                        .setDescription('Le bonus en % (0-100)')
                        .setMinValue(0)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Retirer le bonus XP d\'un rôle')
                .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('Voir tous les rôles bonus')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();
            const config = getGuildXPConfig(interaction.guildId);

            if (sub === 'add') {
                const role = interaction.options.getRole('role');
                const bonus = interaction.options.getInteger('bonus');

                if (!config.roleBonus) {
                    config.roleBonus = {};
                }

                config.roleBonus[role.id] = bonus;
                setGuildConfig(interaction.guildId, { roleBonus: config.roleBonus });

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Rôle Bonus Ajouté')
                    .setDescription(`> ${role} a un bonus de \`+${bonus}%\` XP`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'remove') {
                const role = interaction.options.getRole('role');

                if (!config.roleBonus || !config.roleBonus[role.id]) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Erreur')
                        .setDescription(`> ${role} n'a pas de bonus XP`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                delete config.roleBonus[role.id];
                setGuildConfig(interaction.guildId, { roleBonus: config.roleBonus });

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Rôle Bonus Retiré')
                    .setDescription(`> ${role} n'a plus de bonus XP`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'list') {
                if (!config.roleBonus || Object.keys(config.roleBonus).length === 0) {
                    const embed = new EmbedBuilder()
                        .setTitle('`📋`〃Rôles Bonus')
                        .setDescription('> *Aucun rôle bonus configuré*')
                        .setColor(blueColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed] });
                }

                const rolesList = Object.entries(config.roleBonus)
                    .map(([roleId, bonus]) => `> <@&${roleId}> : \`+${bonus}%\``)
                    .join('\n');

                const embed = new EmbedBuilder()
                    .setTitle('`📋`〃Rôles Bonus')
                    .setDescription(rolesList)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur dans rolebonus:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription('> *Une erreur est survenue.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
