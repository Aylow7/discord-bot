import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Embrasser quelqu\'un')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const embed = new EmbedBuilder()
                .setTitle('`😘`〃Kiss')
                .setDescription(`> *${interaction.user} embrasse ${user} !*`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur kiss:', error);
        }
    }
};
