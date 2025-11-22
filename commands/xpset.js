import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';
import { setXP } from '../utils/xp.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('xpset')
        .setDescription('Définir l\'XP d\'un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription('Quantité d\'XP').setRequired(true).setMinValue(0))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');
            
            setXP(interaction.guildId, user.id, amount);

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃XP Set')
                .setDescription(`> *XP de ${user} défini à \`${amount}\` !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur xpset:', error);
        }
    }
};
