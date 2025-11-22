import { config } from '../config.js';
import { addMessageXP, getLvlUpChannelId } from '../utils/xp.js';
import { EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';

export default {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        // Ajouter XP pour chaque message (avec bonus des rôles)
        const member = await message.guild.members.fetch(message.author.id).catch(() => null);
        const xpResult = addMessageXP(message.guildId, message.author.id, member);
        
        if (xpResult && xpResult.levelUp) {
            const lvlUpChannelId = getLvlUpChannelId(message.guildId);
            if (lvlUpChannelId) {
                try {
                    const channel = await client.channels.fetch(lvlUpChannelId);
                    const embed = new EmbedBuilder()
                        .setTitle('`🎉`〃Level Up!')
                        .setDescription(`> *${message.author} a atteint le niveau \`${xpResult.newLevel}\` ! Félicitations ! 🎊*`)
                        .setColor(greenColor)
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp();
                    
                    await channel.send({ embeds: [embed] });
                } catch (error) {
                    console.error('Erreur lors de l\'envoi du message level up:', error);
                }
            }
        }

        // Commandes prefix
        if (!message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.prefixCommands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${commandName}:`, error);
            await message.channel.send('> *Une erreur est survenue lors de l\'exécution de cette commande.*');
        }
    }
};
