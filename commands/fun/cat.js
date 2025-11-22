import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Obtenir une image de chat aléatoire'),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`🐱`〃Random Cat')
                .setDescription('> *Cette commande nécessite une API externe (ex: The Cat API).*\n> *Fonctionnalité à implémenter avec API.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur cat:', error);
        }
    }
};
