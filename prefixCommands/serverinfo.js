import { EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'serverinfo',
    description: 'Affiche les informations du serveur',

    async execute(message) {
        try {
            const guild = message.guild;
            
            if (!guild) {
                return message.channel.send('> *Cette commande ne peut être utilisée que sur un serveur.*');
            }
            
            const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`;
            const owner = await guild.fetchOwner();
            const totalChannels = guild.channels.cache.size;
            const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
            const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
            const totalRoles = guild.roles.cache.size;
            const totalEmojis = guild.emojis.cache.size;
            const boostLevel = guild.premiumTier;
            const boostCount = guild.premiumSubscriptionCount || 0;

            const embed = new EmbedBuilder()
                .setTitle('`🏰`〃Server Information')
                .setDescription(
                    `> *Nom : \`${guild.name}\`*\n` +
                    `> *ID : \`${guild.id}\`*\n` +
                    `> *Propriétaire : ${owner.user} (\`${owner.user.tag}\`)*\n` +
                    `> *Créé le : ${createdAt}*\n` +
                    `> *Membres : \`${guild.memberCount}\`*\n` +
                    `> *Salons totaux : \`${totalChannels}\`*\n` +
                    `> *Salons textuels : \`${textChannels}\`*\n` +
                    `> *Salons vocaux : \`${voiceChannels}\`*\n` +
                    `> *Rôles : \`${totalRoles}\`*\n` +
                    `> *Emojis : \`${totalEmojis}\`*\n` +
                    `> *Niveau de boost : \`${boostLevel}\`*\n` +
                    `> *Nombre de boosts : \`${boostCount}\`*`
                )
                .setColor(blueColor)
                .setThumbnail(guild.iconURL())
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande serverinfo:', error);
        }
    }
};
