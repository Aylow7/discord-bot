import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Tuer quelqu\'un (virtuellement)')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            
            const methods = [
                'avec une épée',
                'avec un fusil',
                'avec un couteau',
                'avec de la magie',
                'en le jetant d\'une falaise',
                'avec une explosion',
                'avec du poison'
            ];

            const method = methods[Math.floor(Math.random() * methods.length)];

            const embed = new EmbedBuilder()
                .setTitle('`💀`〃Kill')
                .setDescription(`> *${interaction.user} a tué ${user} ${method} !*`)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur kill:', error);
        }
    }
};
