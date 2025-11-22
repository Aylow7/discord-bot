import { EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { getXP } from '../utils/xp.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'rank',
    description: 'Voir votre niveau',

    async execute(message, args) {
        try {
            const user = message.mentions.users.first() || message.author;
            const xpData = getXP(message.guildId, user.id);

            const requiredXP = xpData.level * 100;
            const progress = Math.round((xpData.xp / requiredXP) * 100);

            const embed = new EmbedBuilder()
                .setTitle('`⭐`〃Rank')
                .setDescription(
                    `> *Niveau de ${user}*\n\n` +
                    `> **Niveau :** \`${xpData.level}\`\n` +
                    `> **XP :** \`${xpData.xp}/${requiredXP}\`\n` +
                    `> **Progression :** \`${progress}%\``
                )
                .setColor(blueColor)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur rank:', error);
        }
    }
};
