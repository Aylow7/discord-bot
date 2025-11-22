import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Hacker quelqu\'un (fake)')
        .addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            
            await interaction.reply(`> *Hack de ${user} en cours...*`);
            
            await new Promise(r => setTimeout(r, 1500));
            await interaction.editReply(`> *Récupération de l'email : ${user.tag.split('#')[0]}@gmail.com*`);
            
            await new Promise(r => setTimeout(r, 1500));
            await interaction.editReply(`> *Récupération du mot de passe : ${Array(12).fill('*').map(() => Math.random().toString(36)[2]).join('')}*`);
            
            await new Promise(r => setTimeout(r, 1500));
            await interaction.editReply(`> *Récupération de l'IP : ${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}*`);
            
            await new Promise(r => setTimeout(r, 1500));
            
            const embed = new EmbedBuilder()
                .setTitle('`🔓`〃Hacked')
                .setDescription(`> *${user} a été hacké avec succès !*\n> *(C'est une blague, rien n'a vraiment été hacké)*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.editReply({ content: null, embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur hack:', error);
        }
    }
};
