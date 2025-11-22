import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('bigemoji')
        .setDescription('Afficher un emoji en grand')
        .addStringOption(opt => opt.setName('emoji').setDescription('L\'emoji').setRequired(true)),

    async execute(interaction) {
        try {
            const emoji = interaction.options.getString('emoji');
            const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
            const match = emoji.match(emojiRegex);

            if (match) {
                const animated = match[1];
                const id = match[3];
                const ext = animated ? 'gif' : 'png';
                const url = `https://cdn.discordapp.com/emojis/${id}.${ext}?size=2048`;

                const embed = new EmbedBuilder()
                    .setTitle('`😀`〃Big Emoji')
                    .setImage(url)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            } else {
                const codePoint = [...emoji][0].codePointAt(0).toString(16);
                const url = `https://emojicdn.elk.sh/${emoji}?style=twitter`;

                const embed = new EmbedBuilder()
                    .setTitle('`😀`〃Big Emoji')
                    .setImage(url)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur bigemoji:', error);
        }
    }
};
