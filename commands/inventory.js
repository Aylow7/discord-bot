import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { getBalance } from '../utils/economy.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Voir votre inventaire')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const balance = getBalance(interaction.guildId, user.id);

            if (!balance.inventory || balance.inventory.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('`🎒`〃Inventory')
                    .setDescription(`> *L'inventaire de ${user} est vide.*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed] });
            }

            const items = balance.inventory.map(item => `> **${item.name}** x${item.quantity || 1}`).join('\n');

            const embed = new EmbedBuilder()
                .setTitle('`🎒`〃Inventory')
                .setDescription(`> *Inventaire de ${user} :*\n\n${items}`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur inventory:', error);
        }
    }
};
