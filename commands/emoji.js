import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Agrandir un emoji')
        .addStringOption(opt => opt.setName('emoji').setDescription('L\'emoji').setRequired(true)),

    async execute(interaction) {
        try {
            const emoji = interaction.options.getString('emoji');
            const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
            const match = emoji.match(emojiRegex);

            if (!match) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription('> *Emoji invalide ! Utilisez un emoji personnalisé du serveur.*')
                    .setColor('Red')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const animated = match[1];
            const name = match[2];
            const id = match[3];
            const ext = animated ? 'gif' : 'png';
            const url = `https://cdn.discordapp.com/emojis/${id}.${ext}`;

            const embed = new EmbedBuilder()
                .setTitle('`😀`〃Emoji')
                .setDescription(`> **Nom :** \`:${name}:\`\n> **ID :** \`${id}\``)
                .setImage(url)
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur emoji:', error);
        }
    }
};
