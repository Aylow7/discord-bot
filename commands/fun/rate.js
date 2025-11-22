import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Noter quelque chose')
        .addStringOption(opt => opt.setName('thing').setDescription('Ce que vous voulez noter').setRequired(true)),

    async execute(interaction) {
        try {
            const thing = interaction.options.getString('thing');
            const rating = Math.floor(Math.random() * 11);
            const embed = new EmbedBuilder()
                .setTitle('`⭐`〃Rate')
                .setDescription(`> *Je donne à "${thing}" une note de* **${rating}/10** !`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur rate:', error);
        }
    }
};
