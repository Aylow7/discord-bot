import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { readDatabase, writeDatabase } from '../../utils/database.js';
import { greenColor, redColor } from '../../config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Gérer les pièces des utilisateurs')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Ajouter des pièces à un utilisateur')
                .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true))
                .addIntegerOption(opt => opt.setName('montant').setDescription('Nombre de pièces').setMinValue(1).setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Définir le nombre de pièces d\'un utilisateur')
                .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true))
                .addIntegerOption(opt => opt.setName('montant').setDescription('Nombre de pièces').setMinValue(0).setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('del')
                .setDescription('Retirer des pièces à un utilisateur')
                .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true))
                .addIntegerOption(opt => opt.setName('montant').setDescription('Nombre de pièces').setMinValue(1).setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('reset')
                .setDescription('Réinitialiser les pièces d\'un utilisateur')
                .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();
            const user = interaction.options.getUser('user');
            const db = readDatabase();

            if (!db.guilds[interaction.guildId]) {
                db.guilds[interaction.guildId] = { economy: {}, xp: {}, warns: {} };
            }

            if (!db.guilds[interaction.guildId].economy) {
                db.guilds[interaction.guildId].economy = {};
            }

            if (!db.guilds[interaction.guildId].economy[user.id]) {
                db.guilds[interaction.guildId].economy[user.id] = {
                    wallet: 0,
                    bank: 0,
                    inventory: [],
                    lastDaily: 0,
                    lastWeekly: 0,
                    lastMonthly: 0,
                    lastWork: 0
                };
            }

            const userEconomy = db.guilds[interaction.guildId].economy[user.id];

            if (sub === 'add') {
                const montant = interaction.options.getInteger('montant');
                userEconomy.wallet += montant;
                writeDatabase(db);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Pièces Ajoutées')
                    .setDescription(`> ${user} a reçu \`${montant}\` 💰\n> **Nouveau solde:** \`${userEconomy.wallet}\` 💰`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'set') {
                const montant = interaction.options.getInteger('montant');
                userEconomy.wallet = montant;
                writeDatabase(db);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Pièces Définies')
                    .setDescription(`> ${user} a maintenant \`${montant}\` 💰`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'del') {
                const montant = interaction.options.getInteger('montant');
                
                if (userEconomy.wallet < montant) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Erreur')
                        .setDescription(`> ${user} n'a que \`${userEconomy.wallet}\` 💰`)
                        .setColor(redColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                userEconomy.wallet -= montant;
                writeDatabase(db);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Pièces Retirées')
                    .setDescription(`> ${user} a perdu \`${montant}\` 💰\n> **Nouveau solde:** \`${userEconomy.wallet}\` 💰`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'reset') {
                userEconomy.wallet = 0;
                writeDatabase(db);

                const embed = new EmbedBuilder()
                    .setTitle('`✅`〃Pièces Réinitialisées')
                    .setDescription(`> Les pièces de ${user} ont été réinitialisées à 0 💰`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur dans coin:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Erreur')
                .setDescription('> *Une erreur est survenue*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
