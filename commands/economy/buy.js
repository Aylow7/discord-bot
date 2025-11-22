import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { getBalance, removeMoney, addItem } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Acheter un article de la boutique')
        .addStringOption(opt => opt.setName('item').setDescription('L\'article à acheter').setRequired(true)),

    async execute(interaction) {
        try {
            const itemName = interaction.options.getString('item');
            
            const shopItems = {
                'boite': { name: '🎁 Boîte Mystère', price: 1000 },
                'role': { name: '🎨 Rôle Coloré', price: 5000 },
                'vip': { name: '👑 Rôle VIP', price: 10000 },
                'event': { name: '🎪 Event Privé', price: 25000 }
            };

            const item = shopItems[itemName.toLowerCase()];
            if (!item) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Item Not Found')
                    .setDescription('> *Article introuvable ! Utilisez \`/shop\` pour voir les articles disponibles.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const balance = getBalance(interaction.guildId, interaction.user.id);
            if (balance.wallet < item.price) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Insufficient Funds')
                    .setDescription(`> *Vous n'avez pas assez d'argent ! Prix : \`${item.price}$\`*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            removeMoney(interaction.guildId, interaction.user.id, item.price);
            addItem(interaction.guildId, interaction.user.id, { name: item.name, boughtAt: Date.now() });

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Purchase Complete')
                .setDescription(`> *Vous avez acheté ${item.name} pour \`${item.price}$\` !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur buy:', error);
        }
    }
};
