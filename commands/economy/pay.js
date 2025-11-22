import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { getBalance, addMoney, removeMoney } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Donner de l\'argent à quelqu\'un')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription('Le montant').setRequired(true).setMinValue(1)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');

            if (user.id === interaction.user.id) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous ne pouvez pas vous payer vous-même !*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const balance = getBalance(interaction.guildId, interaction.user.id);
            if (balance.wallet < amount) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Insufficient Funds')
                    .setDescription('> *Vous n\'avez pas assez d\'argent !*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            removeMoney(interaction.guildId, interaction.user.id, amount);
            addMoney(interaction.guildId, user.id, amount);

            const embed = new EmbedBuilder()
                .setTitle('`💸`〃Payment Sent')
                .setDescription(`> *Vous avez envoyé \`${amount}$\` à ${user} !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur pay:', error);
        }
    }
};
