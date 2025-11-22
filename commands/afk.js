import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, blueColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';
import { readDatabase, writeDatabase } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Vous mettre en AFK')
        .addStringOption(opt => opt.setName('reason').setDescription('Raison de votre AFK')),

    async execute(interaction) {
        try {
            const reason = interaction.options.getString('reason') || 'AFK';
            const db = readDatabase();

            if (!db.guilds[interaction.guildId]) {
                db.guilds[interaction.guildId] = {};
            }
            if (!db.guilds[interaction.guildId].afk) {
                db.guilds[interaction.guildId].afk = {};
            }

            db.guilds[interaction.guildId].afk[interaction.user.id] = {
                reason: reason,
                timestamp: Date.now()
            };

            writeDatabase(db);

            const embed = new EmbedBuilder()
                .setTitle('`💤`〃AFK')
                .setDescription(`> *Vous êtes maintenant AFK.*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur afk:', error);
        }
    }
};
