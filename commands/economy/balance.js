import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { getBalance } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Voir votre solde ou celui d\'un autre utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const balance = getBalance(interaction.guildId, user.id);

            const embed = new EmbedBuilder()
                .setTitle('`💰`〃Balance')
                .setDescription(
                    `> *Portefeuille de ${user}*\n\n` +
                    `> **Portefeuille :** \`${balance.wallet}$\`\n` +
                    `> **Banque :** \`${balance.bank}$\`\n` +
                    `> **Total :** \`${balance.wallet + balance.bank}$\``)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur balance:', error);
        }
    }
};
