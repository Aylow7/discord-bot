import { EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'membercount',
    description: 'Nombre de membres du serveur',

    async execute(message, args) {
        try {
            await message.guild.members.fetch();
            
            const total = message.guild.memberCount;
            const humans = message.guild.members.cache.filter(m => !m.user.bot).size;
            const bots = message.guild.members.cache.filter(m => m.user.bot).size;

            const embed = new EmbedBuilder()
                .setTitle('`👥`〃Member Count')
                .setDescription(
                    `> *Total : \`${total}\`*\n` +
                    `> *Humains : \`${humans}\`*\n` +
                    `> *Bots : \`${bots}\`*`
                )
                .setColor(blueColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur membercount:', error);
        }
    }
};
