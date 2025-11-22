import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Afficher le nombre de membres du serveur'),

    async execute(interaction) {
        try {
            await interaction.guild.members.fetch();
            
            const total = interaction.guild.memberCount;
            const humans = interaction.guild.members.cache.filter(m => !m.user.bot).size;
            const bots = interaction.guild.members.cache.filter(m => m.user.bot).size;
            const online = interaction.guild.members.cache.filter(m => m.presence?.status !== 'offline').size;

            const embed = new EmbedBuilder()
                .setTitle('`👥`〃Member Count')
                .setDescription(
                    `> *Total : \`${total}\`*\n` +
                    `> *Humains : \`${humans}\`*\n` +
                    `> *Bots : \`${bots}\`*\n` +
                    `> *En ligne : \`${online}\`*`
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur membercount:', error);
        }
    }
};
