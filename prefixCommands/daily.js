import { EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { getBalance, addMoney } from '../utils/economy.js';
import { incrementCommandCount } from '../utils/database.js';
import { readDatabase, writeDatabase } from '../utils/database.js';

export default {
    name: 'daily',
    description: 'Récompense quotidienne',

    async execute(message, args) {
        try {
            const userData = getBalance(message.guildId, message.author.id);
            const now = Date.now();
            const cooldown = 24 * 60 * 60 * 1000;

            if (userData.lastDaily && now - userData.lastDaily < cooldown) {
                const timeLeft = cooldown - (now - userData.lastDaily);
                const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

                const embed = new EmbedBuilder()
                    .setTitle('`⏰`〃Cooldown')
                    .setDescription(`> *Vous avez déjà récupéré votre récompense quotidienne !*\n> *Revenez dans \`${hours}h ${minutes}m\`*`)
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const amount = 500;
            addMoney(message.guildId, message.author.id, amount);

            const db = readDatabase();
            db.guilds[message.guildId].economy[message.author.id].lastDaily = now;
            writeDatabase(db);

            const embed = new EmbedBuilder()
                .setTitle('`💰`〃Daily Reward')
                .setDescription(`> *Vous avez récupéré votre récompense quotidienne !*\n> **+${amount}$**`)
                .setColor(greenColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur daily:', error);
        }
    }
};
