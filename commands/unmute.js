import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Retirer le mute d\'un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const member = await interaction.guild.members.fetch(user.id);

            await member.timeout(null);

            const embed = new EmbedBuilder()
                .setTitle('`🔊`〃Member Unmuted')
                .setDescription(`> *Le mute de ${user} a été retiré !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur unmute:', error);
        }
    }
};
