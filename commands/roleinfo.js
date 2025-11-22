import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Informations sur un rôle')
        .addRoleOption(opt => opt.setName('role').setDescription('Le rôle').setRequired(true)),

    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');

            const embed = new EmbedBuilder()
                .setTitle('`🎭`〃Role Information')
                .setDescription(
                    `> **Rôle :** ${role}\n` +
                    `> **ID :** \`${role.id}\`\n` +
                    `> **Nom :** \`${role.name}\`\n` +
                    `> **Couleur :** \`${role.hexColor}\`\n` +
                    `> **Position :** \`${role.position}\`\n` +
                    `> **Membres :** \`${role.members.size}\`\n` +
                    `> **Mentionnable :** \`${role.mentionable ? 'Oui' : 'Non'}\`\n` +
                    `> **Affiché séparément :** \`${role.hoist ? 'Oui' : 'Non'}\`\n` +
                    `> **Créé le :** <t:${Math.floor(role.createdTimestamp / 1000)}:F>`
                )
                .setColor(role.hexColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur roleinfo:', error);
        }
    }
};
