import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Lancer un dé')
        .addIntegerOption(opt => opt.setName('faces').setDescription('Nombre de faces (par défaut 6)').setMinValue(2).setMaxValue(100)),

    async execute(interaction) {
        try {
            const faces = interaction.options.getInteger('faces') || 6;
            const result = Math.floor(Math.random() * faces) + 1;

            const embed = new EmbedBuilder()
                .setTitle('`🎲`〃Dice Roll')
                .setDescription(`> *Résultat d'un dé à \`${faces}\` faces :* **${result}**`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dice:', error);
        }
    }
};
