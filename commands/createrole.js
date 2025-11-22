import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('createrole')
        .setDescription('Créer un rôle')
        .addStringOption(opt => opt.setName('name').setDescription('Nom du rôle').setRequired(true))
        .addStringOption(opt => opt.setName('color').setDescription('Couleur (hex)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        try {
            const name = interaction.options.getString('name');
            let color = interaction.options.getString('color') || '#99AAB5';

            if (!color.startsWith('#')) color = '#' + color;

            const role = await interaction.guild.roles.create({
                name: name,
                color: color,
                reason: `Créé par ${interaction.user.tag}`
            });

            const embed = new EmbedBuilder()
                .setTitle('`✅`〃Role Created')
                .setDescription(`> *Le rôle ${role} a été créé !*`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur createrole:', error);
        }
    }
};
