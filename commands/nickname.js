import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { redColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Changer le surnom d\'un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Le membre').setRequired(true))
        .addStringOption(opt => opt.setName('nickname').setDescription('Le nouveau surnom').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const nickname = interaction.options.getString('nickname');
            const member = await interaction.guild.members.fetch(user.id);

            if (!member.manageable) {
                const embed = new EmbedBuilder()
                    .setTitle('`❌`〃Error')
                    .setDescription(`> *Je ne peux pas modifier le surnom de ce membre.*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.setNickname(nickname);

            const embed = new EmbedBuilder()
                .setTitle('`✏️`〃Nickname Changed')
                .setDescription(`> *Surnom de ${user} modifié !*\n> **Nouveau surnom :** \`${nickname}\``)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur nickname:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription(`> *Une erreur est survenue.*`)
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
