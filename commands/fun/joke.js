import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Obtenir une blague aléatoire'),

    async execute(interaction) {
        try {
            const jokes = [
                'Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau.',
                'Qu\'est-ce qu\'un crocodile qui surveille la pharmacie ? Un Lacoste-garde.',
                'Qu\'est-ce qu\'un canif ? Un petit fien.',
                'Comment appelle-t-on un chat tombé dans un pot de peinture le jour de Noël ? Un chat-peint de Noël.',
                'Pourquoi les poissons n\'aiment pas jouer au tennis ? Parce qu\'ils ont peur du filet.'
            ];

            const joke = jokes[Math.floor(Math.random() * jokes.length)];

            const embed = new EmbedBuilder()
                .setTitle('`😂`〃Joke')
                .setDescription(`> ${joke}`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur joke:', error);
        }
    }
};
