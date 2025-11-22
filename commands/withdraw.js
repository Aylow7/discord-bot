import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { getBalance, removeMoney, addMoney } from '../utils/economy.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Retirer de l\'argent de la banque')
        .addIntegerOption(opt => opt.setName('amount').setDescription('Le montant').setRequired(true).setMinValue(1)),

    async execute(interaction) {
        try {
            const amount = interaction.options.getInteger('amount');
            const balance = getBalance(interaction.guildId, interaction.user.id);

            if (balance.bank < amount) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Insufficient Funds')
                    .setDescription('> *Vous n\'avez pas assez d\'argent à la banque !*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            removeMoney(interaction.guildId, interaction.user.id, amount, 'bank');
            addMoney(interaction.guildId, interaction.user.id, amount, 'wallet');

            const embed = new EmbedBuilder()
                .setTitle('`💵`〃Withdraw')
                .setDescription(`> *Vous avez retiré \`${amount}$\` de la banque !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur withdraw:', error);
        }
    }
};
