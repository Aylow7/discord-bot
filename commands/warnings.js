import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { getWarns } from '../utils/warns.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Voir les avertissements d\'un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const warns = getWarns(interaction.guildId, user.id);

            if (!warns || warns.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('`📋`〃Warnings')
                    .setDescription(`> *${user} n'a aucun avertissement.*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed] });
            }

            let description = `> *Avertissements de ${user} :*\n\n`;
            warns.forEach((warn, index) => {
                description += `**${index + 1}.** ${warn.reason}\n> *Par <@${warn.moderator}> - <t:${Math.floor(warn.timestamp / 1000)}:R>*\n\n`;
            });

            const embed = new EmbedBuilder()
                .setTitle('`📋`〃Warnings')
                .setDescription(description)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur warnings:', error);
        }
    }
};
