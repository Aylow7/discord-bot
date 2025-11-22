import { EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    name: '8ball',
    description: 'Poser une question à la boule magique',

    async execute(message, args) {
        try {
            if (!args.length) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Veuillez poser une question.*')
                    .setColor('Red')
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [embed] });
            }

            const question = args.join(' ');
            const responses = [
                'Oui', 'Non', 'Peut-être', 'C\'est certain', 'Sans aucun doute',
                'Très probable', 'Probable', 'Improbable', 'Absolument pas',
                'Ne compte pas là-dessus', 'Demande plus tard', 'Mieux vaut ne pas te le dire',
                'Je ne peux pas prédire maintenant', 'Concentre-toi et redemande'
            ];

            const answer = responses[Math.floor(Math.random() * responses.length)];

            const embed = new EmbedBuilder()
                .setTitle('`🎱`〃Magic 8Ball')
                .setDescription(
                    `> *Question : ${question}*\n\n` +
                    `> **Réponse :** ${answer}`
                )
                .setColor(blueColor)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur 8ball:', error);
        }
    }
};
