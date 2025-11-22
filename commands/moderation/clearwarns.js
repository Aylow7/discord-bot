import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../../config.js';
import { clearWarns } from '../../utils/warns.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('clearwarns')
        .setDescription('Effacer les avertissements d\'un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            clearWarns(interaction.guildId, user.id);

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Warnings Cleared')
                .setDescription(`> *Tous les avertissements de ${user} ont été effacés !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur clearwarns:', error);
        }
    }
};
