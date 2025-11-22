import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Informations détaillées sur un utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);

            const roles = member.roles.cache
                .filter(r => r.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(r => r.toString())
                .slice(0, 15)
                .join(', ') || 'Aucun';

            const badges = [];
            if (user.flags) {
                if (user.flags.has('Staff')) badges.push('Discord Staff');
                if (user.flags.has('Partner')) badges.push('Partner');
                if (user.flags.has('Hypesquad')) badges.push('HypeSquad');
                if (user.flags.has('BugHunterLevel1')) badges.push('Bug Hunter');
                if (user.flags.has('PremiumEarlySupporter')) badges.push('Early Supporter');
                if (user.flags.has('VerifiedDeveloper')) badges.push('Verified Developer');
            }

            const embed = new EmbedBuilder()
                .setTitle('`🔍`〃Whois')
                .setDescription(
                    `> **Utilisateur :** ${user}\n` +
                    `> **ID :** \`${user.id}\`\n` +
                    `> **Tag :** \`${user.tag}\`\n` +
                    `> **Surnom :** \`${member.nickname || 'Aucun'}\`\n` +
                    `> **Bot :** \`${user.bot ? 'Oui' : 'Non'}\`\n` +
                    `> **Compte créé :** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n` +
                    `> **Rejoint le :** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>\n` +
                    `> **Rôle le plus haut :** ${member.roles.highest}\n` +
                    `> **Rôles [${member.roles.cache.size - 1}] :** ${roles}` +
                    (badges.length > 0 ? `\n> **Badges :** ${badges.join(', ')}` : '')
                )
                .setThumbnail(user.displayAvatarURL({ size: 1024 }))
                .setColor(member.displayHexColor || blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur whois:', error);
        }
    }
};
