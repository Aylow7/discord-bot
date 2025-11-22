import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor, redColor, blueColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Pierre, Papier, Ciseaux')
        .addStringOption(opt => 
            opt.setName('choice')
                .setDescription('Votre choix')
                .setRequired(true)
                .addChoices(
                    { name: 'Pierre', value: 'rock' },
                    { name: 'Papier', value: 'paper' },
                    { name: 'Ciseaux', value: 'scissors' }
                )
        ),

    async execute(interaction) {
        try {
            const userChoice = interaction.options.getString('choice');
            const choices = ['rock', 'paper', 'scissors'];
            const botChoice = choices[Math.floor(Math.random() * choices.length)];

            const names = { rock: 'Pierre', paper: 'Papier', scissors: 'Ciseaux' };

            let result = '';
            let color = blueColor;

            if (userChoice === botChoice) {
                result = 'Égalité !';
                color = blueColor;
            } else if (
                (userChoice === 'rock' && botChoice === 'scissors') ||
                (userChoice === 'paper' && botChoice === 'rock') ||
                (userChoice === 'scissors' && botChoice === 'paper')
            ) {
                result = 'Vous avez gagné ! 🎉';
                color = greenColor;
            } else {
                result = 'Vous avez perdu ! 😔';
                color = redColor;
            }

            const embed = new EmbedBuilder()
                .setTitle('`✊`〃Rock Paper Scissors')
                .setDescription(
                    `> *Vous : ${names[userChoice]}*\n` +
                    `> *Bot : ${names[botChoice]}*\n\n` +
                    `> **Résultat :** ${result}`
                )
                .setColor(color)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur rps:', error);
        }
    }
};
