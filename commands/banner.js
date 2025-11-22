import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Afficher la bannière d\'un utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur (vous par défaut)')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const fetchedUser = await user.fetch(true);

            if (!fetchedUser.bannerURL()) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃No Banner')
                    .setDescription(`> *${user} n'a pas de bannière.*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('`🎨`〃User Banner')
                .setDescription(`> *Bannière de ${user}*`)
                .setImage(fetchedUser.bannerURL({ size: 4096 }))
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur banner:', error);
        }
    }
};
