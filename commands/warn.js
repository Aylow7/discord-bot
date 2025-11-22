import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { add, view, reason, remove } from "../utils/warns.js";
import { redColor, greenColor } from "../config.js";
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Gère les warns d\'un membre')
        .addSubcommand(sub => 
            sub.setName('add')
               .setDescription('Ajoute un warn à un membre')
               .addUserOption(opt => opt.setName('target').setDescription('Cible du warn').setRequired(true))
               .addStringOption(opt => opt.setName('reason').setDescription('Raison du warn').setRequired(true))
        )
        .addSubcommand(sub => 
            sub.setName('list')
               .setDescription('Affiche les warns d\'un membre')
               .addUserOption(opt => opt.setName('target').setDescription('Membre à consulter').setRequired(true))
        )
        .addSubcommand(sub => 
            sub.setName('remove')
               .setDescription('Retire un warn à un membre')
               .addUserOption(opt => opt.setName('target').setDescription('Membre concerné').setRequired(true))
               .addStringOption(opt => opt.setName('case').setDescription('Numéro du warn à retirer').setRequired(true))
        )
        .addSubcommand(sub => 
            sub.setName('reason')
               .setDescription('Change la raison d\'un warn')
               .addUserOption(opt => opt.setName('target').setDescription('Membre concerné').setRequired(true))
               .addStringOption(opt => opt.setName('case').setDescription('Numéro du warn à modifier').setRequired(true))
               .addStringOption(opt => opt.setName('newreason').setDescription('Nouvelle raison').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();
            const target = interaction.options.getUser('target', true);

            const member = await interaction.guild?.members.fetch(interaction.user.id);
            const targetMember = await interaction.guild?.members.fetch(target.id);

            if (!member || !targetMember) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription(`> *Impossible de trouver le membre ${target.tag}.*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (member.roles.highest.position <= targetMember.roles.highest.position) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous ne pouvez pas gérer les warns d\'un membre ayant un rôle supérieur ou égal au vôtre.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            switch (sub) {
                case 'add': {
                    const reasonText = interaction.options.getString('reason', true);
                    const modId = interaction.user.id;
                    const caseNum = await add(interaction.guildId, target.id, reasonText, modId);

                    const embed = new EmbedBuilder()
                        .setTitle('`✅`〃Warn Added')
                        .setDescription(`> *Warn ajouté à ${target} (\`${target.id}\` | \`${target.tag}\`) !*\n> **Raison :** ${reasonText}`)
                        .setColor(greenColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                    await interaction.reply({ embeds: [embed] });
                    break;
                }

                case 'list': {
                    const result = await view(interaction.guild, target);
                    await interaction.reply(result);
                    break;
                }

                case 'remove': {
                    const caseNumber = interaction.options.getString('case', true);
                    await remove(interaction.guildId, target.id, caseNumber);

                    const embed = new EmbedBuilder()
                        .setTitle('`✅`〃Warn Removed')
                        .setDescription(`> *Le warn \`n°${caseNumber}\` de ${target} (\`${target.id}\` | \`${target.tag}\`) a été retiré.*`)
                        .setColor(greenColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                    await interaction.reply({ embeds: [embed] });
                    break;
                }

                case 'reason': {
                    const caseNumber = interaction.options.getString('case', true);
                    const newReason = interaction.options.getString('newreason', true);
                    await reason(interaction.guildId, target.id, caseNumber, newReason);

                    const embed = new EmbedBuilder()
                        .setTitle('`✅`〃Reason Changed')
                        .setDescription(`> *La raison du warn \`n°${caseNumber}\` de ${target} (\`${target.id}\` | \`${target.tag}\`) a été modifiée.*\n> **Nouvelle raison :** ${newReason}`)
                        .setColor(greenColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                    await interaction.reply({ embeds: [embed] });
                    break;
                }
            }
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande warn:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue : ${error.message}*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
