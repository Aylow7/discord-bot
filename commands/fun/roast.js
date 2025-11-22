import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription('Insulter quelqu\'un (gentiment)')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            
            const roasts = [
                'est tellement bête que même un robot a pitié de toi.',
                'a un QI si faible qu\'il est négatif.',
                'est la raison pour laquelle il y a des instructions sur le shampoing.',
                'est aussi utile qu\'un parapluie dans le désert.',
                'a autant de charisme qu\'une brique.'
            ];

            const roast = roasts[Math.floor(Math.random() * roasts.length)];

            const embed = new EmbedBuilder()
                .setTitle('`🔥`〃Roast')
                .setDescription(`> *${user} ${roast}*`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur roast:', error);
        }
    }
};
