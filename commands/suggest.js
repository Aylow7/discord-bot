import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Faire une suggestion')
        .addStringOption(opt => opt.setName('suggestion').setDescription('Votre suggestion').setRequired(true)),

    async execute(interaction) {
        try {
            const suggestion = interaction.options.getString('suggestion');

            const embed = new EmbedBuilder()
                .setTitle('`💡`〃Suggestion')
                .setDescription(`> ${suggestion}`)
                .setColor(blueColor)
                .setFooter({ text: `Suggéré par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            await message.react('✅');
            await message.react('❌');

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur suggest:', error);
        }
    }
};
