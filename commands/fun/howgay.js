import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('howgay')
        .setDescription('Calculer le pourcentage de gay')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const percentage = Math.floor(Math.random() * 101);

            const embed = new EmbedBuilder()
                .setTitle('`🏳️‍🌈`〃How Gay')
                .setDescription(`> *${user} est gay à \`${percentage}%\` !*`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur howgay:', error);
        }
    }
};
