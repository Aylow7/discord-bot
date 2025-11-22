import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { getBalance, addMoney } from '../utils/economy.js';
import { incrementCommandCount } from '../utils/database.js';
import { readDatabase, writeDatabase } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Récupérer votre récompense quotidienne'),

    async execute(interaction) {
        try {
            const userData = getBalance(interaction.guildId, interaction.user.id);
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
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const amount = 500;
            addMoney(interaction.guildId, interaction.user.id, amount);

            const db = readDatabase();
            db.guilds[interaction.guildId].economy[interaction.user.id].lastDaily = now;
            writeDatabase(db);

            const embed = new EmbedBuilder()
                .setTitle('`💰`〃Daily Reward')
                .setDescription(`> *Vous avez récupéré votre récompense quotidienne !*\n> **+${amount}$**`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur daily:', error);
        }
    }
};
