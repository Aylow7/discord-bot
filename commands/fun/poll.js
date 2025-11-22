import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Créer un sondage')
        .addStringOption(opt => opt.setName('question').setDescription('La question').setRequired(true))
        .addStringOption(opt => opt.setName('option1').setDescription('Option 1').setRequired(true))
        .addStringOption(opt => opt.setName('option2').setDescription('Option 2').setRequired(true))
        .addStringOption(opt => opt.setName('option3').setDescription('Option 3'))
        .addStringOption(opt => opt.setName('option4').setDescription('Option 4'))
        .addStringOption(opt => opt.setName('option5').setDescription('Option 5')),

    async execute(interaction) {
        try {
            const question = interaction.options.getString('question');
            const options = [];
            
            for (let i = 1; i <= 5; i++) {
                const opt = interaction.options.getString(`option${i}`);
                if (opt) options.push(opt);
            }

            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
            let description = `> **${question}**\n\n`;
            
            options.forEach((opt, index) => {
                description += `> ${emojis[index]} ${opt}\n`;
            });

            const embed = new EmbedBuilder()
                .setTitle('`📊`〃Poll')
                .setDescription(description)
                .setColor(blueColor)
                .setFooter({ text: `Créé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });

            for (let i = 0; i < options.length; i++) {
                await message.react(emojis[i]);
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur poll:', error);
        }
    }
};
