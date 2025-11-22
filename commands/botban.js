import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { readDatabase, writeDatabase, incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('botban')
        .setDescription('Bannir un utilisateur d\'utiliser le bot')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');

            const db = readDatabase();
            if (!db.guilds[interaction.guildId]) db.guilds[interaction.guildId] = {};
            if (!db.guilds[interaction.guildId].botBans) db.guilds[interaction.guildId].botBans = [];

            if (db.guilds[interaction.guildId].botBans.includes(user.id)) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Already Banned')
                    .setDescription(`> *${user} est déjà banni du bot !*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            db.guilds[interaction.guildId].botBans.push(user.id);
            writeDatabase(db);

            const embed = new EmbedBuilder()
                .setTitle('`🔨`〃Bot Ban')
                .setDescription(`> *${user} a été banni du bot !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur botban:', error);
        }
    }
};
