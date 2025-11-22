import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Obtenir un meme aléatoire'),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`😂`〃Random Meme')
                .setDescription('> *Cette commande nécessite une API externe (ex: Reddit API).*\n> *Fonctionnalité à implémenter avec API.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur meme:', error);
        }
    }
};
