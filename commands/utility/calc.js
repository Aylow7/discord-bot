import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculer une expression mathématique')
        .addStringOption(opt => opt.setName('expression').setDescription('L\'expression à calculer (ex: 2+2)').setRequired(true)),

    async execute(interaction) {
        try {
            const expression = interaction.options.getString('expression');
            
            const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, '');
            
            if (!sanitized) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Invalid Expression')
                    .setDescription('> *Expression invalide.*')
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const result = eval(sanitized);

            const embed = new EmbedBuilder()
                .setTitle('`🔢`〃Calculator')
                .setDescription(
                    `> **Expression :** \`${expression}\`\n` +
                    `> **Résultat :** \`${result}\``
                )
                .setColor(blueColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur calc:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription('> *Erreur de calcul.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
