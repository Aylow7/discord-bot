import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js';
import { blueColor, greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Système de tickets')
        .addSubcommand(sub => 
            sub.setName('setup')
                .setDescription('Configurer le système de tickets')
                .addChannelOption(opt => opt.setName('channel').setDescription('Salon').setRequired(true))
        )
        .addSubcommand(sub => 
            sub.setName('close')
                .setDescription('Fermer le ticket actuel')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'setup') {
                const channel = interaction.options.getChannel('channel');

                const embed = new EmbedBuilder()
                    .setTitle('`🎫`〃Support Tickets')
                    .setDescription(
                        '> *Besoin d\'aide ? Créez un ticket !*\n\n' +
                        '> **Cliquez sur le bouton ci-dessous pour ouvrir un ticket.**'
                    )
                    .setColor(blueColor)
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('create_ticket')
                            .setLabel('Créer un Ticket')
                            .setEmoji('🎫')
                            .setStyle(ButtonStyle.Primary)
                    );

                await channel.send({ embeds: [embed], components: [button] });

                const confirmEmbed = new EmbedBuilder()
                    .setTitle('`✅`〃Ticket Setup')
                    .setDescription(`> *Système de tickets configuré dans ${channel} !*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                incrementCommandCount();

            } else if (subcommand === 'close') {
                if (!interaction.channel.name.startsWith('ticket-')) {
                    const embed = new EmbedBuilder()
                        .setTitle('`❌`〃Error')
                        .setDescription('> *Cette commande ne peut être utilisée que dans un ticket !*')
                        .setColor('Red')
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('`🔒`〃Ticket Closed')
                    .setDescription('> *Ce ticket va être fermé dans 5 secondes...*')
                    .setColor('Red')
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
                setTimeout(() => interaction.channel.delete(), 5000);
                incrementCommandCount();
            }
        } catch (error) {
            console.error('Erreur ticket:', error);
        }
    }
};
