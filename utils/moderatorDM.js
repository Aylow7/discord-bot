import { EmbedBuilder } from 'discord.js';

export const sendModeratorDM = async (user, action, reason = '', details = {}) => {
    try {
        const embed = new EmbedBuilder()
            .setTitle(`\`⚠️\`〃Action de Modération`)
            .setDescription(`> *Vous avez reçu une action de modération sur un serveur.*`)
            .addFields(
                { name: 'Action', value: `> \`${action}\``, inline: true },
                { name: 'Raison', value: `> \`${reason || 'Aucune raison'}\``, inline: true }
            )
            .setColor('#FF6B6B')
            .setTimestamp();

        if (details.serverName) {
            embed.addFields({ name: 'Serveur', value: `> \`${details.serverName}\``, inline: false });
        }

        if (details.duration) {
            embed.addFields({ name: 'Durée', value: `> \`${details.duration}\``, inline: true });
        }

        await user.send({ embeds: [embed] });
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du DM:', error);
        return false;
    }
};
