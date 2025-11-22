import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { blueColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('channelinfo')
        .setDescription('Afficher les informations d\'un salon')
        .addChannelOption(opt => opt.setName('channel').setDescription('Le salon')),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            const typeMap = {
                [ChannelType.GuildText]: "Texte",
                [ChannelType.GuildVoice]: "Vocal",
                [ChannelType.GuildCategory]: "Catégorie",
                [ChannelType.GuildStageVoice]: "Stage",
                [ChannelType.GuildForum]: "Forum",
                [ChannelType.GuildAnnouncement]: "Annonce"
            };

            const isVoice = channel.type === ChannelType.GuildVoice
                ? `> *Membres connectés : \`${channel.members.size}\`*\n`
                : '';

            const embed = new EmbedBuilder()
                .setTitle('`📺`〃Channel Information')
                .setDescription(
                    `> *Mention : ${channel}*\n` +
                    `> *Nom : \`${channel.name}\`*\n` +
                    `> *ID : \`${channel.id}\`*\n` +
                    `> *Type : \`${typeMap[channel.type] || 'Inconnu'}\`*\n` +
                    `> *Catégorie : \`${channel.parent ? channel.parent.name : "Aucune"}\`*\n` +
                    `> *NSFW : \`${channel.nsfw ? 'Oui' : 'Non'}\`*\n` +
                    isVoice +
                    `> *Créé le : <t:${Math.floor(channel.createdTimestamp / 1000)}:F>*`
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur channelinfo:', error);
        }
    }
};
