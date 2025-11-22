import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor } from '../config.js';
import { addMoney } from '../utils/economy.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Mendier de l\'argent'),

    async execute(interaction) {
        try {
            const chance = Math.random();
            
            if (chance < 0.5) {
                const embed = new EmbedBuilder()
                    .setTitle('`😔`〃Beg Failed')
                    .setDescription('> *Personne ne vous a donné d\'argent...*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });
                incrementCommandCount();
                return;
            }

            const amount = Math.floor(Math.random() * 100) + 10;
            addMoney(interaction.guildId, interaction.user.id, amount);

            const embed = new EmbedBuilder()
                .setTitle('`💵`〃Beg Success')
                .setDescription(`> *Quelqu'un vous a donné de l\'argent !*\n> **+${amount}$**`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur beg:', error);
        }
    }
};
