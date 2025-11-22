import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Afficher les informations d\'un utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur (vous par défaut)')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);

            const roles = member.roles.cache
                .filter(r => r.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(r => r.toString())
                .slice(0, 20)
                .join(', ') || 'Aucun';

            const embed = new EmbedBuilder()
                .setTitle('`👤`〃User Information')
                .setDescription(
                    `> *Utilisateur : ${user}*\n` +
                    `> *ID : \`${user.id}\`*\n` +
                    `> *Tag : \`${user.tag}\`*\n` +
                    `> *Surnom : \`${member.nickname || 'Aucun'}\`*\n` +
                    `> *Compte créé : <t:${Math.floor(user.createdTimestamp / 1000)}:F>*\n` +
                    `> *Rejoint le : <t:${Math.floor(member.joinedTimestamp / 1000)}:F>*\n` +
                    `> *Rôle le plus haut : ${member.roles.highest}*\n` +
                    `> *Rôles [${member.roles.cache.size - 1}] : ${roles}*`
                )
                .setThumbnail(user.displayAvatarURL())
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur userinfo:', error);
        }
    }
};
