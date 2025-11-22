import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Afficher l\'avatar d\'un utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur (vous par défaut)')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;

            const embed = new EmbedBuilder()
                .setTitle('`🖼️`〃User Avatar')
                .setDescription(`> *Avatar de ${user}*`)
                .setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur avatar:', error);
        }
    }
};
