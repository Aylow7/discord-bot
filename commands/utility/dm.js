import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Envoyer un message privé à un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addStringOption(opt => opt.setName('message').setDescription('Le message').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const message = interaction.options.getString('message');

            try {
                await user.send(message);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃DM Sent')
                    .setDescription(`> *Message envoyé à ${user} !*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (e) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription(`> *Impossible d'envoyer un message à ${user}.*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dm:', error);
        }
    }
};
