import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Recréer le salon actuel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            const channel = interaction.channel;
            const position = channel.position;

            const newChannel = await channel.clone();
            await newChannel.setPosition(position);
            await channel.delete();

            const embed = new EmbedBuilder()
                .setTitle('`💣`〃Channel Nuked')
                .setDescription('> *Ce salon a été recréé !*')
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await newChannel.send({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur nuke:', error);
        }
    }
};
