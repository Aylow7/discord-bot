import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { readDatabase, writeDatabase, incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('botunban')
        .setDescription('Débannir un utilisateur du bot')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');

            const db = readDatabase();
            if (!db.guilds[interaction.guildId]) db.guilds[interaction.guildId] = {};
            if (!db.guilds[interaction.guildId].botBans) db.guilds[interaction.guildId].botBans = [];

            if (!db.guilds[interaction.guildId].botBans.includes(user.id)) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Not Banned')
                    .setDescription(`> *${user} n'est pas banni du bot !*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            db.guilds[interaction.guildId].botBans = db.guilds[interaction.guildId].botBans.filter(id => id !== user.id);
            writeDatabase(db);

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Bot Unban')
                .setDescription(`> *${user} a été débanni du bot !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur botunban:', error);
        }
    }
};
