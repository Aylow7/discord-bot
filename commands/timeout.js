import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { redColor, greenColor, blueColor } from '../config.js';
import { parseDuration } from '../utils/parseDuration.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Gestion des timeouts du serveur')
        .addSubcommand(sb =>
            sb.setName('add').setDescription('Mettre un membre en timeout')
            .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
            .addStringOption(opt => opt.setName('duration').setDescription('Durée (ex: 10m, 2h, 1d)').setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('Raison'))
        )
        .addSubcommand(sb =>
            sb.setName('remove').setDescription('Retirer le timeout d\'un membre')
            .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        )
        .addSubcommand(sb =>
            sb.setName('list').setDescription('Liste des membres en timeout')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();

            if (sub === 'add') {
                const user = interaction.options.getUser('user');
                const duration = interaction.options.getString('duration');
                const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
                const member = await interaction.guild.members.fetch(user.id).catch(() => null);

                if (!member) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription(`> *Le membre n'a pas été trouvé.*`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const ms = parseDuration(duration);
                if (!ms || ms > 28 * 24 * 60 * 60 * 1000) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Invalid Duration')
                        .setDescription('> *Durée invalide (max 28 jours). Formats: 10m, 2h, 1d, 7w*')
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (!member.moderatable) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription(`> *Je ne peux pas timeout ce membre.*`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription(`> *Vous ne pouvez pas timeout ce membre.*`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                await member.timeout(ms, reason);
                const embed = new EmbedBuilder()
                    .setTitle('`⏱️`〃Timeout Added')
                    .setDescription(`> *${user} a été mis en timeout pour \`${duration}\` !*\n> **Raison :** ${reason}`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'remove') {
                const user = interaction.options.getUser('user');
                const member = await interaction.guild.members.fetch(user.id).catch(() => null);

                if (!member) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription(`> *Le membre n'a pas été trouvé.*`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                await member.timeout(null);
                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Timeout Removed')
                    .setDescription(`> *Le timeout de ${user} a été retiré.*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'list') {
                await interaction.guild.members.fetch();
                const timedOut = interaction.guild.members.cache.filter(m => m.communicationDisabledUntil && m.communicationDisabledUntil > Date.now());
                
                if (timedOut.size === 0) {
                    const embed = new EmbedBuilder()
                        .setTitle('`📋`〃Timeouts List')
                        .setDescription('> *Aucun membre en timeout.*')
                        .setColor(blueColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed] });
                }

                const description = timedOut.map(m => `> ${m.user} (\`${m.user.id}\`) - fin: <t:${Math.floor(m.communicationDisabledUntil / 1000)}:R>`).slice(0, 25).join('\n');
                const embed = new EmbedBuilder()
                    .setTitle('`📋`〃Timeouts List')
                    .setDescription(description)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
                await interaction.reply({ embeds: [embed] });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur timeout:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
