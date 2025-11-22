import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Faire dire quelque chose au bot')
        .addStringOption(opt => opt.setName('message').setDescription('Le message').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        try {
            const message = interaction.options.getString('message');
            await interaction.channel.send(message);
            await interaction.reply({ content: '> *Message envoyé !*', ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur say:', error);
        }
    }
};
