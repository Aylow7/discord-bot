import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { getBalance, addMoney } from '../utils/economy.js';
import { incrementCommandCount } from '../utils/database.js';
import { readDatabase, writeDatabase } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Travailler pour gagner de l\'argent'),

    async execute(interaction) {
        try {
            const userData = getBalance(interaction.guildId, interaction.user.id);
            const now = Date.now();
            const cooldown = 60 * 60 * 1000;

            if (userData.lastWork && now - userData.lastWork < cooldown) {
                const timeLeft = cooldown - (now - userData.lastWork);
                const minutes = Math.floor(timeLeft / (60 * 1000));

                const embed = new EmbedBuilder()
                    .setTitle('`⏰`〃Cooldown')
                    .setDescription(`> *Vous êtes fatigué !*\n> *Revenez dans \`${minutes}m\`*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const amount = Math.floor(Math.random() * 200) + 100;
            addMoney(interaction.guildId, interaction.user.id, amount);

            const db = readDatabase();
            db.guilds[interaction.guildId].economy[interaction.user.id].lastWork = now;
            writeDatabase(db);

            const jobs = [
                'développeur', 'designer', 'streamer', 'youtubeur', 'musicien',
                'écrivain', 'artiste', 'chef cuisinier', 'enseignant', 'médecin'
            ];
            const job = jobs[Math.floor(Math.random() * jobs.length)];

            const embed = new EmbedBuilder()
                .setTitle('`💼`〃Work')
                .setDescription(`> *Vous avez travaillé en tant que ${job} !*\n> **+${amount}$**`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur work:', error);
        }
    }
};
