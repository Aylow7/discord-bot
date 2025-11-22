import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'kick',
    description: 'Expulser un membre',

    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous n\'avez pas la permission d\'expulser des membres.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Veuillez mentionner un utilisateur.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const reason = args.slice(1).join(' ') || 'Aucune raison fournie';
            const member = await message.guild.members.fetch(user.id);

            if (!member.kickable) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Je ne peux pas expulser ce membre.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle('`👢`〃Member Kicked')
                .setDescription(`> *${user.tag} a été expulsé !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur kick:', error);
        }
    }
};
