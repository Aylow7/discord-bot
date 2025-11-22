import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { getBalance, addMoney, removeMoney } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Jouer à la machine à sous')
        .addIntegerOption(opt => opt.setName('bet').setDescription('Votre mise').setRequired(true).setMinValue(10)),

    async execute(interaction) {
        try {
            const bet = interaction.options.getInteger('bet');
            const balance = getBalance(interaction.guildId, interaction.user.id);

            if (balance.wallet < bet) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Insufficient Funds')
                    .setDescription('> *Vous n\'avez pas assez d\'argent !*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
            const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

            let winAmount = 0;
            let result = '';

            if (slot1 === slot2 && slot2 === slot3) {
                if (slot1 === '💎') {
                    winAmount = bet * 10;
                    result = 'JACKPOT ! 💎💎💎';
                } else {
                    winAmount = bet * 3;
                    result = 'Vous avez gagné ! 🎉';
                }
                addMoney(interaction.guildId, interaction.user.id, winAmount);
            } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
                winAmount = bet;
                result = 'Presque ! Vous récupérez votre mise.';
                addMoney(interaction.guildId, interaction.user.id, winAmount);
            } else {
                removeMoney(interaction.guildId, interaction.user.id, bet);
                result = 'Vous avez perdu ! 😔';
                winAmount = -bet;
            }

            const embed = new EmbedBuilder()
                .setTitle('`🎰`〃Slot Machine')
                .setDescription(
                    `> ${slot1} ${slot2} ${slot3}\n\n` +
                    `> **Résultat :** ${result}\n` +
                    `> **Gain/Perte :** \`${winAmount >= 0 ? '+' : ''}${winAmount}$\``
                )
                .setColor(winAmount >= 0 ? greenColor : redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur slots:', error);
        }
    }
};
