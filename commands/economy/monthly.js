import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { getBalance, addMoney } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';
import { readDatabase, writeDatabase } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('monthly')
        .setDescription('Récupérer votre récompense mensuelle'),

    async execute(interaction) {
        try {
            const userData = getBalance(interaction.guildId, interaction.user.id);
            const now = Date.now();
            const cooldown = 30 * 24 * 60 * 60 * 1000;

            if (userData.lastMonthly && now - userData.lastMonthly < cooldown) {
                const timeLeft = cooldown - (now - userData.lastMonthly);
                const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));

                const embed = new EmbedBuilder()
                    .setTitle('`⏰`〃Cooldown')
                    .setDescription(`> *Vous avez déjà récupéré votre récompense mensuelle !*\n> *Revenez dans \`${days}j\`*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const amount = 15000;
            addMoney(interaction.guildId, interaction.user.id, amount);

            const db = readDatabase();
            db.guilds[interaction.guildId].economy[interaction.user.id].lastMonthly = now;
            writeDatabase(db);

            const embed = new EmbedBuilder()
                .setTitle('`💰`〃Monthly Reward')
                .setDescription(`> *Vous avez récupéré votre récompense mensuelle !*\n> **+${amount}$**`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur monthly:', error);
        }
    }
};
