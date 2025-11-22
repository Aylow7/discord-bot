import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Afficher l\'icône du serveur'),

    async execute(interaction) {
        try {
            if (!interaction.guild.iconURL()) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃No Icon')
                    .setDescription('> *Ce serveur n\'a pas d\'icône.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('`🖼️`〃Server Icon')
                .setDescription(`> *Icône de ${interaction.guild.name}*`)
                .setImage(interaction.guild.iconURL({ size: 4096 }))
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur servericon:', error);
        }
    }
};
