import { EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'userinfo',
    description: 'Informations sur un utilisateur',

    async execute(message, args) {
        try {
            const user = message.mentions.users.first() || message.author;
            const member = await message.guild.members.fetch(user.id);

            const roles = member.roles.cache
                .filter(r => r.id !== message.guild.id)
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
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur userinfo:', error);
        }
    }
};
