import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Obtenir une image de chien aléatoire'),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`🐶`〃Random Dog')
                .setDescription('> *Cette commande nécessite une API externe (ex: Dog API).*\n> *Fonctionnalité à implémenter avec API.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dog:', error);
        }
    }
};
