import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../config.js';
import { readDatabase, incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Statistiques du serveur'),

    async execute(interaction) {
        try {
            await interaction.guild.members.fetch();
            await interaction.guild.channels.fetch();

            const db = readDatabase();
            const guildData = db.guilds[interaction.guildId] || {};

            const totalMembers = interaction.guild.memberCount;
            const humans = interaction.guild.members.cache.filter(m => !m.user.bot).size;
            const bots = interaction.guild.members.cache.filter(m => m.user.bot).size;

            const textChannels = interaction.guild.channels.cache.filter(c => c.type === 0).size;
            const voiceChannels = interaction.guild.channels.cache.filter(c => c.type === 2).size;
            const categories = interaction.guild.channels.cache.filter(c => c.type === 4).size;

            const roles = interaction.guild.roles.cache.size;
            const emojis = interaction.guild.emojis.cache.size;

            const embed = new EmbedBuilder()
                .setTitle('`📊`〃Server Stats')
                .setDescription(
                    `> **Serveur :** ${interaction.guild.name}\n\n` +
                    `> **Membres :**\n` +
                    `> • Total : \`${totalMembers}\`\n` +
                    `> • Humains : \`${humans}\`\n` +
                    `> • Bots : \`${bots}\`\n\n` +
                    `> **Salons :**\n` +
                    `> • Texte : \`${textChannels}\`\n` +
                    `> • Vocal : \`${voiceChannels}\`\n` +
                    `> • Catégories : \`${categories}\`\n\n` +
                    `> **Autres :**\n` +
                    `> • Rôles : \`${roles}\`\n` +
                    `> • Emojis : \`${emojis}\`\n` +
                    `> • Créé le : <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>`
                )
                .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur stats:', error);
        }
    }
};
