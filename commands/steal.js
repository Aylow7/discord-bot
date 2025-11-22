import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('steal')
        .setDescription('Voler un emoji d\'un autre serveur')
        .addStringOption(opt => opt.setName('emoji').setDescription('L\'emoji').setRequired(true))
        .addStringOption(opt => opt.setName('name').setDescription('Nom de l\'emoji'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),

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
            const defaultName = match[2];
            const id = match[3];
            const name = interaction.options.getString('name') || defaultName;
            const ext = animated ? 'gif' : 'png';
            const url = `https://cdn.discordapp.com/emojis/${id}.${ext}`;

            const emoji = await interaction.guild.emojis.create({ attachment: url, name });

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Emoji Stolen')
                .setDescription(`> *L'emoji ${emoji} \`:${name}:\` a été volé et ajouté !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur steal:', error);
        }
    }
};
