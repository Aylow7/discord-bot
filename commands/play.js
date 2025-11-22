import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { redColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Jouer de la musique')
        .addStringOption(opt => opt.setName('song').setDescription('URL ou nom de la chanson').setRequired(true)),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('`🎵`〃Music Player')
                .setDescription(
                    '> *Cette commande nécessite une bibliothèque de musique Discord.*\n' +
                    '> *Installation requise : @discordjs/voice, ytdl-core ou discord-player*\n' +
                    '> *Fonctionnalité à implémenter.*'
                )
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur play:', error);
        }
    }
};
