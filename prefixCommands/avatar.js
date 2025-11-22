import { EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'avatar',
    description: 'Afficher l\'avatar d\'un utilisateur',

    async execute(message, args) {
        try {
            const user = message.mentions.users.first() || message.author;

            const embed = new EmbedBuilder()
                .setTitle('`🖼️`〃User Avatar')
                .setDescription(`> *Avatar de ${user}*`)
                .setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
                .setColor(blueColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur avatar:', error);
        }
    }
};
