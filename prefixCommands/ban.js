import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'ban',
    description: 'Bannir un membre',

    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous n\'avez pas la permission de bannir des membres.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Veuillez mentionner un utilisateur ou fournir son ID.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const reason = args.slice(1).join(' ') || 'Aucune raison fournie';
            
            const member = await message.guild.members.fetch(user.id).catch(() => null);
            if (member && member.roles.highest.position >= message.member.roles.highest.position) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous ne pouvez pas bannir ce membre.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            await message.guild.members.ban(user, { reason });

            const embed = new EmbedBuilder()
                .setTitle('`🔨`〃Member Banned')
                .setDescription(`> *${user.tag} a été banni !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur ban:', error);
        }
    }
};
