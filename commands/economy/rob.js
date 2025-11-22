import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { getBalance, addMoney, removeMoney } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Voler de l\'argent à quelqu\'un')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');

            if (user.id === interaction.user.id) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous ne pouvez pas vous voler vous-même !*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const targetBalance = getBalance(interaction.guildId, user.id);
            if (targetBalance.wallet < 100) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Target Too Poor')
                    .setDescription('> *Cette personne n\'a pas assez d\'argent à voler !*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const success = Math.random() > 0.5;

            if (success) {
                const stolenAmount = Math.floor(Math.random() * Math.min(targetBalance.wallet, 500)) + 50;
                removeMoney(interaction.guildId, user.id, stolenAmount);
                addMoney(interaction.guildId, interaction.user.id, stolenAmount);

                const embed = new EmbedBuilder()
                    .setTitle('`💰`〃Rob Success')
                    .setDescription(`> *Vous avez volé \`${stolenAmount}$\` à ${user} !*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            } else {
                const fine = Math.floor(Math.random() * 200) + 100;
                removeMoney(interaction.guildId, interaction.user.id, fine);

                const embed = new EmbedBuilder()
                    .setTitle('`🚔`〃Rob Failed')
                    .setDescription(`> *Vous avez été attrapé ! Amende de \`${fine}$\` !*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur rob:', error);
        }
    }
};
