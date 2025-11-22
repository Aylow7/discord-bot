import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Verrouiller tous les salons du serveur')
        .addStringOption(opt => opt.setName('reason').setDescription('Raison'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const reason = interaction.options.getString('reason') || 'Lockdown';
            const channels = interaction.guild.channels.cache.filter(c => c.isTextBased());

            let locked = 0;
            for (const [id, channel] of channels) {
                try {
                    await channel.permissionOverwrites.edit(interaction.guild.id, {
                        SendMessages: false
                    }, { reason });
                    locked++;
                } catch (e) {
                    console.error(`Erreur lockdown ${channel.name}:`, e);
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('`🔒`〃Server Lockdown')
                .setDescription(`> *${locked} salons verrouillés !*\n> **Raison :** ${reason}`)
                .setColor(greenColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur lockdown:', error);
        }
    }
};
