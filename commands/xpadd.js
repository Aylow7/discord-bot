import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';
import { addXP } from '../utils/xp.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('xpadd')
        .setDescription('Ajouter de l\'XP à un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription('Quantité d\'XP').setRequired(true).setMinValue(1))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');
            
            const result = addXP(interaction.guildId, user.id, amount);

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃XP Added')
                .setDescription(`> *${amount} XP ajouté à ${user} !*${result.levelUp ? `\n> **Level Up !** Niveau \`${result.newLevel}\`` : ''}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur xpadd:', error);
        }
    }
};
