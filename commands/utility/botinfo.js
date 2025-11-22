import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount, readDatabase } from '../../utils/database.js';
import os from 'os';

export default {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Affiche les informations du bot'),

    async execute(interaction) {
        try {
            const client = interaction.client;
            const db = readDatabase();
            
            const totalGuilds = client.guilds.cache.size;
            const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const totalChannels = client.channels.cache.size;
            const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            const totalCommands = db.totalCommands || 0;

            const embed = new EmbedBuilder()
                .setTitle('`🤖`〃Bot Information')
                .setDescription(
                    `> *Nom : \`${client.user.tag}\`*\n` +
                    `> *ID : \`${client.user.id}\`*\n` +
                    `> *Serveurs : \`${totalGuilds}\`*\n` +
                    `> *Utilisateurs : \`${totalUsers}\`*\n` +
                    `> *Salons : \`${totalChannels}\`*\n` +
                    `> *Commandes exécutées : \`${totalCommands}\`*\n` +
                    `> *Utilisation mémoire : \`${memoryUsage} MB\`*\n` +
                    `> *Node.js : \`${process.version}\`*\n` +
                    `> *Discord.js : \`14.16.3\`*`
                )
                .setColor(blueColor)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande botinfo:', error);
        }
    }
};
