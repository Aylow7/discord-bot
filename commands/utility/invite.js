import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Obtenir le lien d\'invitation du bot'),

    async execute(interaction) {
        try {
            const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;

            const embed = new EmbedBuilder()
                .setTitle('`📨`〃Invite Bot')
                .setDescription(
                    `> *Merci de vouloir m'ajouter à votre serveur !*\n\n` +
                    `> [**Cliquez ici pour m'inviter**](${inviteLink})`
                )
                .setColor(blueColor)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur invite:', error);
        }
    }
};
