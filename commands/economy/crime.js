import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { addMoney, removeMoney } from '../../utils/economy.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('crime')
        .setDescription('Commettre un crime pour gagner de l\'argent'),

    async execute(interaction) {
        try {
            const crimes = [
                'cambrioler une banque',
                'voler une voiture',
                'pirater un système',
                'contrefaire de la monnaie',
                'voler un magasin'
            ];

            const crime = crimes[Math.floor(Math.random() * crimes.length)];
            const success = Math.random() > 0.4;

            if (success) {
                const amount = Math.floor(Math.random() * 1000) + 500;
                addMoney(interaction.guildId, interaction.user.id, amount);

                const embed = new EmbedBuilder()
                    .setTitle('`💰`〃Crime Success')
                    .setDescription(`> *Vous avez réussi à ${crime} !*\n> **Gain :** \`+${amount}$\``)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            } else {
                const fine = Math.floor(Math.random() * 500) + 200;
                removeMoney(interaction.guildId, interaction.user.id, fine);

                const embed = new EmbedBuilder()
                    .setTitle('`🚔`〃Crime Failed')
                    .setDescription(`> *Vous avez échoué à ${crime} !*\n> **Amende :** \`-${fine}$\``)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur crime:', error);
        }
    }
};
