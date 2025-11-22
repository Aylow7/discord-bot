import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: 'clear',
    description: 'Supprimer des messages',

    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Vous n\'avez pas la permission de gérer les messages.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const amount = parseInt(args[0]);
            if (isNaN(amount) || amount < 1 || amount > 100) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Veuillez fournir un nombre entre 1 et 100.*')
                    .setColor(redColor)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const messages = await message.channel.messages.fetch({ limit: amount + 1 });
            const deleted = await message.channel.bulkDelete(messages, true);

            const embed = new EmbedBuilder()
                .setTitle('`🗑️`〃Messages Cleared')
                .setDescription(`> *${deleted.size - 1} message(s) supprimé(s) !*`)
                .setColor(greenColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            const reply = await message.channel.send({ embeds: [embed] });
            setTimeout(() => reply.delete().catch(() => {}), 5000);
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur clear:', error);
        }
    }
};
