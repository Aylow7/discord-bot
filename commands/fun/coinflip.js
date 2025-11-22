import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Lancer une pièce'),

    async execute(interaction) {
        try {
            const result = Math.random() < 0.5 ? 'Pile' : 'Face';

            const embed = new EmbedBuilder()
                .setTitle('`🪙`〃Coin Flip')
                .setDescription(`> *Résultat :* **${result}**`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur coinflip:', error);
        }
    }
};
