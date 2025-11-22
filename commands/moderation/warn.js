import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { add, view, reason, remove } from "../../utils/warns.js";
import { redColor, greenColor } from "../../config.js";
import { sendModeratorDM } from "../../utils/moderatorDM.js";

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
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();
            const target = interaction.options.getUser('target', true);

            const member = await interaction.guild?.members.fetch(interaction.user.id);
            const targetMember = await interaction.guild?.members.fetch(target.id);

            if (!member || !targetMember) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Erreur')
                    .setDescription(`> *Impossible de trouver le membre ${target.tag}.*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (member.roles.highest.position <= targetMember.roles.highest.position) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Erreur')
                    .setDescription('> *Vous ne pouvez pas warn/voir/remove/changer le warn d\'un membre ayant un rôle supérieur ou égal au vôtre.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            switch (sub) {
                case 'add': {
                    const reason = interaction.options.getString('reason', true);
                    const modId = interaction.user.id;
                    
                    // Envoyer un MP avant l'action
                    await sendModeratorDM(target, 'WARN', reason, { serverName: interaction.guild.name });

                    const caseNum = await add(interaction.guildId, target.id, reason, modId);

                    const embed = new EmbedBuilder()
                        .setTitle('`✅`〃Warn ajouté')
                        .setDescription(`> *Warn ajouté à ${target} (\`${target.id}\` | \`${target.tag}\`) !*\n\`\`\`ansi\n[1;31m[Reason] :[0m ${reason}\n\`\`\``)
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
                        .setTitle('`✅`〃Warn retiré')
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
                        .setTitle('`✅`〃Raison modifiée')
                        .setDescription(`> *La raison du warn \`n°${caseNumber}\` de ${target} (\`${target.id}\` | \`${target.tag}\`) a été modifiée.*\n\`\`\`ansi\n[1;32m[New Reason] :[0m ${newReason}\n\`\`\``)
                        .setColor(greenColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                    await interaction.reply({ embeds: [embed] });
                    break;
                }
            }
        } catch (error) {
            console.error('Erreur dans la commande warn:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Erreur')
                .setDescription(`> *Une erreur est survenue :*\n\`\`\`ansi\n[1;31m${error}[0m\n\`\`\``)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};