import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { getXP } from '../../utils/xp.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Voir votre niveau ou celui d\'un autre utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const xpData = getXP(interaction.guildId, user.id);

            const requiredXP = xpData.level * 100;
            const progress = Math.round((xpData.xp / requiredXP) * 100);

            const embed = new EmbedBuilder()
                .setTitle('`⭐`〃Rank')
                .setDescription(
                    `> *Niveau de ${user}*\n\n` +
                    `> **Niveau :** \`${xpData.level}\`\n` +
                    `> **XP :** \`${xpData.xp}/${requiredXP}\`\n` +
                    `> **Progression :** \`${progress}%\``
                )
                .setColor(blueColor)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur rank:', error);
        }
    }
};
