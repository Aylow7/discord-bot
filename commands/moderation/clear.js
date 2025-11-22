import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprimer des messages')
        .addIntegerOption(opt => opt.setName('amount').setDescription('Nombre de messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
        .addUserOption(opt => opt.setName('user').setDescription('Supprimer uniquement les messages de cet utilisateur'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        try {
            const amount = interaction.options.getInteger('amount');
            const user = interaction.options.getUser('user');

            await interaction.deferReply({ ephemeral: true });

            const messages = await interaction.channel.messages.fetch({ limit: Math.min(amount + 1, 100) });
            
            let toDelete = messages;
            if (user) {
                toDelete = messages.filter(m => m.author.id === user.id);
            }

            const deleted = await interaction.channel.bulkDelete(toDelete, true);

            const embed = new EmbedBuilder()
                .setTitle('`🗑️`〃Messages Cleared')
                .setDescription(`> *${deleted.size} message(s) supprimé(s) !*${user ? `\n> **Utilisateur :** ${user}` : ''}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur clear:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Impossible de supprimer les messages (messages trop anciens?).*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            
            if (interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
};
