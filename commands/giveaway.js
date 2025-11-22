import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Créer un giveaway')
        .addStringOption(opt => opt.setName('prize').setDescription('Le prix').setRequired(true))
        .addIntegerOption(opt => opt.setName('duration').setDescription('Durée en minutes').setRequired(true).setMinValue(1))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Nombre de gagnants').setRequired(true).setMinValue(1))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        try {
            const prize = interaction.options.getString('prize');
            const duration = interaction.options.getInteger('duration');
            const winners = interaction.options.getInteger('winners');

            const endTime = Date.now() + (duration * 60 * 1000);

            const embed = new EmbedBuilder()
                .setTitle('`🎉`〃Giveaway')
                .setDescription(
                    `> **Prix :** ${prize}\n` +
                    `> **Organisé par :** ${interaction.user}\n` +
                    `> **Gagnants :** ${winners}\n` +
                    `> **Se termine :** <t:${Math.floor(endTime / 1000)}:R>\n\n` +
                    `> *Réagissez avec 🎉 pour participer !*`
                )
                .setColor(blueColor)
                .setFooter({ text: `Se termine le`, iconURL: interaction.guild.iconURL() })
                .setTimestamp(endTime);

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            await message.react('🎉');

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur giveaway:', error);
        }
    }
};
