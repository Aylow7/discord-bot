import { EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { getBalance } from '../utils/economy.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'balance',
    description: 'Voir votre solde',

    async execute(message, args) {
        try {
            const user = message.mentions.users.first() || message.author;
            const balance = getBalance(message.guildId, user.id);

            const embed = new EmbedBuilder()
                .setTitle('`💰`〃Balance')
                .setDescription(
                    `> *Portefeuille de ${user}*\n\n` +
                    `> **Portefeuille :** \`${balance.wallet}$\`\n` +
                    `> **Banque :** \`${balance.bank}$\`\n` +
                    `> **Total :** \`${balance.wallet + balance.bank}$\``
                )
                .setColor(blueColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur balance:', error);
        }
    }
};
