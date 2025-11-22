import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('enlarge')
        .setDescription('Agrandir un emoji ou sticker')
        .addStringOption(opt => opt.setName('emoji').setDescription('L\'emoji').setRequired(true)),

    async execute(interaction) {
        try {
            const emojiInput = interaction.options.getString('emoji');
            const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
            const match = emojiInput.match(emojiRegex);

            if (!match) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Emoji')
                    .setDescription('> *Emoji invalide ! Utilisez un emoji personnalisé Discord.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const animated = match[1];
            const name = match[2];
            const id = match[3];
            const ext = animated ? 'gif' : 'png';
            const url = `https://cdn.discordapp.com/emojis/${id}.${ext}?size=2048`;

            const embed = new EmbedBuilder()
                .setTitle('`🔍`〃Enlarged Emoji')
                .setDescription(`> **:${name}:**`)
                .setImage(url)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur enlarge:', error);
        }
    }
};
