import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addemoji')
        .setDescription('Ajouter un emoji au serveur')
        .addStringOption(opt => opt.setName('emoji').setDescription('L\'emoji ou URL').setRequired(true))
        .addStringOption(opt => opt.setName('name').setDescription('Nom de l\'emoji').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),

    async execute(interaction) {
        try {
            const emojiInput = interaction.options.getString('emoji');
            const name = interaction.options.getString('name');

            const emojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
            const urlRegex = /https?:\/\/.+\.(png|jpg|jpeg|gif)/i;

            let url;
            if (emojiRegex.test(emojiInput)) {
                const match = emojiInput.match(emojiRegex);
                const animated = match[1];
                const id = match[3];
                const ext = animated ? 'gif' : 'png';
                url = `https://cdn.discordapp.com/emojis/${id}.${ext}`;
            } else if (urlRegex.test(emojiInput)) {
                url = emojiInput;
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Input')
                    .setDescription('> *Veuillez fournir un emoji Discord ou une URL d\'image.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const emoji = await interaction.guild.emojis.create({ attachment: url, name });

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Emoji Added')
                .setDescription(`> *L'emoji ${emoji} \`:${name}:\` a été ajouté !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur addemoji:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription('> *Impossible d\'ajouter l\'emoji. Vérifiez le format et les permissions.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
