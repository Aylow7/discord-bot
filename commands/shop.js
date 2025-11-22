import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Voir la boutique du serveur'),

    async execute(interaction) {
        try {
            const shopItems = [
                { name: '🎁 Boîte Mystère', price: 1000, description: 'Une boîte mystérieuse' },
                { name: '🎨 Rôle Coloré', price: 5000, description: 'Un rôle avec une couleur personnalisée' },
                { name: '👑 Rôle VIP', price: 10000, description: 'Un rôle VIP exclusif' },
                { name: '🎪 Event Privé', price: 25000, description: 'Organiser un event privé' }
            ];

            let description = '> *Voici les articles disponibles :*\n\n';
            shopItems.forEach((item, index) => {
                description += `**${index + 1}. ${item.name}** - \`${item.price}$\`\n> *${item.description}*\n\n`;
            });

            const embed = new EmbedBuilder()
                .setTitle('`🛒`〃Server Shop')
                .setDescription(description)
                .setColor(blueColor)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur shop:', error);
        }
    }
};
