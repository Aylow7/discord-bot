import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';
import { parseDuration } from '../../utils/parseDuration.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Créer un rappel')
        .addStringOption(opt => opt.setName('duration').setDescription('Durée (ex: 10m, 1h, 1d)').setRequired(true))
        .addStringOption(opt => opt.setName('message').setDescription('Message du rappel').setRequired(true)),

    async execute(interaction) {
        try {
            const duration = interaction.options.getString('duration');
            const message = interaction.options.getString('message');

            const ms = parseDuration(duration);
            if (!ms || ms > 30 * 24 * 60 * 60 * 1000) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Duration')
                    .setDescription('> *Durée invalide ! Maximum : 30 jours.*')
                    .setColor('Red')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('`⏰`〃Reminder Set')
                .setDescription(`> *Je vous rappellerai dans \`${duration}\` !*\n> **Message :** ${message}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                try {
                    const reminderEmbed = new EmbedBuilder()
                        .setTitle('`⏰`〃Reminder')
                        .setDescription(`> *Rappel :* ${message}`)
                        .setColor(greenColor)
                        .setFooter({ text: 'Rappel créé', iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp();

                    await interaction.user.send({ embeds: [reminderEmbed] });
                } catch (error) {
                    console.error('Impossible d\'envoyer le rappel:', error);
                }
            }, ms);

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur reminder:', error);
        }
    }
};
