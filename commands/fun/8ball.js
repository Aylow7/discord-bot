import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Poser une question à la boule magique')
        .addStringOption(opt => opt.setName('question').setDescription('Votre question').setRequired(true)),

    async execute(interaction) {
        try {
            const question = interaction.options.getString('question');

            const responses = [
                'Oui', 'Non', 'Peut-être', 'C\'est certain', 'Sans aucun doute',
                'Très probable', 'Probable', 'Improbable', 'Absolument pas',
                'Ne compte pas là-dessus', 'Demande plus tard', 'Mieux vaut ne pas te le dire',
                'Je ne peux pas prédire maintenant', 'Concentre-toi et redemande',
                'Les signes pointent vers oui', 'C\'est décidément ainsi'
            ];

            const answer = responses[Math.floor(Math.random() * responses.length)];

            const embed = new EmbedBuilder()
                .setTitle('`🎱`〃Magic 8Ball')
                .setDescription(
                    `> *Question : ${question}*\n\n` +
                    `> **Réponse :** ${answer}`
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur 8ball:', error);
        }
    }
};
