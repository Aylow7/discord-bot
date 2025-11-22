import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot'),

    async execute(interaction) {
        try {
            const latency = Date.now() - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            const embed = new EmbedBuilder()
                .setTitle('`🪄`〃Bot Latency')
                .setDescription(`> *Pong !*\n> *Latence du bot : \`${latency}ms\`*\n> *Latence de l'API : \`${apiLatency}ms\`*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur dans la commande ping:', error);
        }
    }
};
