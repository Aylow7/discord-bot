import { EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'ping',
    description: 'Affiche la latence du bot',

    async execute(message) {
        try {
            const sent = await message.channel.send('> *Calcul de la latence...*');
            const latency = sent.createdTimestamp - message.createdTimestamp;
            const apiLatency = Math.round(message.client.ws.ping);

            const embed = new EmbedBuilder()
                .setTitle('`🪄`〃Bot Latency')
                .setDescription(`> *Pong !*\n> *Latence du bot : \`${latency}ms\`*\n> *Latence de l'API : \`${apiLatency}ms\`*`)
                .setColor(greenColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await sent.edit({ content: '', embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande ping:', error);
        }
    }
};
