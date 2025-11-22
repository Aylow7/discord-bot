import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { orangeColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes disponibles'),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`📚`〃Help Menu')
                .setDescription(
                    `> *Voici la liste des commandes disponibles :*\n\n` +
                    `**Commandes Slash :**\n` +
                    `> \`/ping\` - *Affiche la latence du bot*\n` +
                    `> \`/uptime\` - *Affiche le temps de fonctionnement*\n` +
                    `> \`/botinfo\` - *Affiche les informations du bot*\n` +
                    `> \`/serverinfo\` - *Affiche les informations du serveur*\n` +
                    `> \`/help\` - *Affiche ce message*\n\n` +
                    `**Commandes Prefix (\`+\`) :**\n` +
                    `> \`+ping\` - *Affiche la latence du bot*\n` +
                    `> \`+uptime\` - *Affiche le temps de fonctionnement*\n` +
                    `> \`+botinfo\` - *Affiche les informations du bot*\n` +
                    `> \`+serverinfo\` - *Affiche les informations du serveur*\n` +
                    `> \`+help\` - *Affiche ce message*`
                )
                .setColor(orangeColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande help:', error);
        }
    }
};
