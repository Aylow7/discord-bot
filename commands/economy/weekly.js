import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { getBalance, addMoney } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';
import { readDatabase, writeDatabase } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('weekly')
        .setDescription('Récupérer votre récompense hebdomadaire'),

    async execute(interaction) {
        try {
            const userData = getBalance(interaction.guildId, interaction.user.id);
            const now = Date.now();
            const cooldown = 7 * 24 * 60 * 60 * 1000;

            if (userData.lastWeekly && now - userData.lastWeekly < cooldown) {
                const timeLeft = cooldown - (now - userData.lastWeekly);
                const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
                const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

                const embed = new EmbedBuilder()
                    .setTitle('`⏰`〃Cooldown')
                    .setDescription(`> *Vous avez déjà récupéré votre récompense hebdomadaire !*\n> *Revenez dans \`${days}j ${hours}h\`*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const amount = 3500;
            addMoney(interaction.guildId, interaction.user.id, amount);

            const db = readDatabase();
            db.guilds[interaction.guildId].economy[interaction.user.id].lastWeekly = now;
            writeDatabase(db);

            const embed = new EmbedBuilder()
                .setTitle('`💰`〃Weekly Reward')
                .setDescription(`> *Vous avez récupéré votre récompense hebdomadaire !*\n> **+${amount}$**`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur weekly:', error);
        }
    }
};
