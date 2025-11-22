import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reverse')
        .setDescription('Inverser un texte')
        .addStringOption(opt => opt.setName('text').setDescription('Le texte à inverser').setRequired(true)),

    async execute(interaction) {
        try {
            const text = interaction.options.getString('text');
            const reversed = text.split('').reverse().join('');

            const embed = new EmbedBuilder()
                .setTitle('`🔄`〃Reverse')
                .setDescription(`> **Texte original :** ${text}\n> **Texte inversé :** ${reversed}`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur reverse:', error);
        }
    }
};
