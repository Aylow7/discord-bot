import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { getLeaderboard } from '../utils/xp.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Voir le classement du serveur'),

    async execute(interaction) {
        try {
            const leaderboard = getLeaderboard(interaction.guildId, 10);

            if (leaderboard.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('`🏆`〃Leaderboard')
                    .setDescription('> *Aucune données disponibles.*')
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed] });
            }

            let description = '';
            for (let i = 0; i < leaderboard.length; i++) {
                const user = await interaction.client.users.fetch(leaderboard[i].userId).catch(() => null);
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                description += `> ${medal} **${user ? user.tag : 'Inconnu'}** - Niveau \`${leaderboard[i].level}\` (${leaderboard[i].xp} XP)\n`;
            }

            const embed = new EmbedBuilder()
                .setTitle('`🏆`〃Leaderboard')
                .setDescription(description)
                .setColor(blueColor)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur leaderboard:', error);
        }
    }
};
