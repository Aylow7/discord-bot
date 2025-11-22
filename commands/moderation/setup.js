import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getGuildXPConfig, setGuildConfig, setLvlUpChannelId } from '../../utils/xp.js';
import { greenColor, redColor, blueColor } from '../../config.js';

function buildConfigEmbed(config) {
    return new EmbedBuilder()
        .setTitle('`⚙️`〃XP Configuration')
        .setDescription('Configurez le système XP de votre serveur')
        .addFields(
            { 
                name: '📊 XP par Message', 
                value: `\`${config.messageXp.min}-${config.messageXp.max}\` XP`,
                inline: true
            },
            { 
                name: '🎙️ XP par 15min Voice', 
                value: `\`${config.voiceXp.min}-${config.voiceXp.max}\` XP`,
                inline: true
            },
            { 
                name: '📹 Bonus Cam', 
                value: `\`+${config.camBonus}%\``,
                inline: true
            },
            { 
                name: '📡 Bonus Stream', 
                value: `\`+${config.streamBonus}%\``,
                inline: true
            },
            { 
                name: '🎁 Rôles Bonus', 
                value: Object.keys(config.roleBonus || {}).length > 0 
                    ? Object.entries(config.roleBonus).map(([roleId, bonus]) => `<@&${roleId}> : \`+${bonus}%\``).join('\n')
                    : '`Aucun rôle configuré`',
                inline: false
            },
            { 
                name: '💬 Channel Level Up', 
                value: config.lvlUpChannelId ? `<#${config.lvlUpChannelId}>` : '`Non configuré`',
                inline: false
            }
        )
        .setColor(blueColor);
}

function buildActionRows() {
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('xp_message')
                .setLabel('Modifier XP Message')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('xp_voice')
                .setLabel('Modifier XP Voice')
                .setStyle(ButtonStyle.Primary)
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('xp_bonus_cam')
                .setLabel('Modifier Bonus Cam')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('xp_bonus_stream')
                .setLabel('Modifier Bonus Stream')
                .setStyle(ButtonStyle.Secondary)
        );

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('xp_roles')
                .setLabel('Gérer Rôles Bonus')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('xp_channel')
                .setLabel('Définir Channel LvlUp')
                .setStyle(ButtonStyle.Danger)
        );

    return [row1, row2, row3];
}

export default {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configurer le bot')
        .addSubcommand(sub =>
            sub.setName('xp')
                .setDescription('Configurer le système XP du serveur')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();

            if (sub === 'xp') {
                let config = getGuildXPConfig(interaction.guildId);
                
                const setupEmbed = buildConfigEmbed(config);
                const rows = buildActionRows();

                const response = await interaction.reply({ 
                    embeds: [setupEmbed], 
                    components: rows,
                    ephemeral: true
                });

                // Collecteur d'interactions
                const collector = interaction.channel.createMessageComponentCollector({
                    filter: i => i.user.id === interaction.user.id,
                    time: 300000 // 5 minutes
                });

                collector.on('collect', async (i) => {
                    try {
                        if (i.customId === 'xp_message') {
                            const modal = new ModalBuilder()
                                .setCustomId('modal_xp_message')
                                .setTitle('XP par Message');

                            config = getGuildXPConfig(interaction.guildId);
                            modal.addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('min_xp_message')
                                        .setLabel('XP Minimum')
                                        .setStyle(TextInputStyle.Short)
                                        .setValue(String(config.messageXp.min))
                                        .setRequired(true)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('max_xp_message')
                                        .setLabel('XP Maximum')
                                        .setStyle(TextInputStyle.Short)
                                        .setValue(String(config.messageXp.max))
                                        .setRequired(true)
                                )
                            );

                            await i.showModal(modal);
                        } else if (i.customId === 'xp_voice') {
                            const modal = new ModalBuilder()
                                .setCustomId('modal_xp_voice')
                                .setTitle('XP par 15min Voice');

                            config = getGuildXPConfig(interaction.guildId);
                            modal.addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('min_xp_voice')
                                        .setLabel('XP Minimum')
                                        .setStyle(TextInputStyle.Short)
                                        .setValue(String(config.voiceXp.min))
                                        .setRequired(true)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('max_xp_voice')
                                        .setLabel('XP Maximum')
                                        .setStyle(TextInputStyle.Short)
                                        .setValue(String(config.voiceXp.max))
                                        .setRequired(true)
                                )
                            );

                            await i.showModal(modal);
                        } else if (i.customId === 'xp_bonus_cam') {
                            const modal = new ModalBuilder()
                                .setCustomId('modal_bonus_cam')
                                .setTitle('Bonus Cam');

                            config = getGuildXPConfig(interaction.guildId);
                            modal.addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('bonus_cam_percent')
                                        .setLabel('Bonus en % (ex: 10)')
                                        .setStyle(TextInputStyle.Short)
                                        .setValue(String(config.camBonus))
                                        .setRequired(true)
                                )
                            );

                            await i.showModal(modal);
                        } else if (i.customId === 'xp_bonus_stream') {
                            const modal = new ModalBuilder()
                                .setCustomId('modal_bonus_stream')
                                .setTitle('Bonus Stream');

                            config = getGuildXPConfig(interaction.guildId);
                            modal.addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('bonus_stream_percent')
                                        .setLabel('Bonus en % (ex: 5)')
                                        .setStyle(TextInputStyle.Short)
                                        .setValue(String(config.streamBonus))
                                        .setRequired(true)
                                )
                            );

                            await i.showModal(modal);
                        } else if (i.customId === 'xp_roles') {
                            const select = new StringSelectMenuBuilder()
                                .setCustomId('role_bonus_select')
                                .setPlaceholder('Choisir une action')
                                .addOptions(
                                    { label: '➕ Ajouter un rôle bonus', value: 'add_role' },
                                    { label: '➖ Retirer un rôle bonus', value: 'remove_role' },
                                    { label: '📋 Voir les rôles bonus', value: 'list_roles' }
                                );

                            await i.reply({
                                components: [new ActionRowBuilder().addComponents(select)],
                                ephemeral: true
                            });
                        } else if (i.customId === 'xp_channel') {
                            const modal = new ModalBuilder()
                                .setCustomId('modal_channel_id')
                                .setTitle('Channel Level Up');

                            config = getGuildXPConfig(interaction.guildId);
                            modal.addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('channel_id_input')
                                        .setLabel('ID du Channel (ou @mention)')
                                        .setStyle(TextInputStyle.Short)
                                        .setPlaceholder('Copier l\'ID du channel')
                                        .setRequired(true)
                                )
                            );

                            await i.showModal(modal);
                        }
                    } catch (error) {
                        console.error('Erreur dans le collecteur de buttons:', error);
                    }
                });

                // Collecteur pour les modals
                const modalHandler = async (modalInteraction) => {
                    if (!modalInteraction.isModalSubmit()) return;
                    if (modalInteraction.user.id !== interaction.user.id) return;

                    try {
                        if (modalInteraction.customId === 'modal_xp_message') {
                            const minXp = parseInt(modalInteraction.fields.getTextInputValue('min_xp_message'));
                            const maxXp = parseInt(modalInteraction.fields.getTextInputValue('max_xp_message'));

                            if (isNaN(minXp) || isNaN(maxXp) || minXp < 0 || maxXp < minXp) {
                                return modalInteraction.reply({ 
                                    content: '❌ Valeurs invalides! Le minimum doit être positif et inférieur au maximum.',
                                    ephemeral: true
                                });
                            }

                            setGuildConfig(interaction.guildId, { messageXp: { min: minXp, max: maxXp } });
                            config = getGuildXPConfig(interaction.guildId);
                            
                            await modalInteraction.reply({ 
                                content: `✅ XP par message configuré: \`${minXp}-${maxXp}\``,
                                ephemeral: true
                            });

                            // Mettre à jour l'embed
                            await response.edit({
                                embeds: [buildConfigEmbed(config)],
                                components: buildActionRows()
                            });

                        } else if (modalInteraction.customId === 'modal_xp_voice') {
                            const minXp = parseInt(modalInteraction.fields.getTextInputValue('min_xp_voice'));
                            const maxXp = parseInt(modalInteraction.fields.getTextInputValue('max_xp_voice'));

                            if (isNaN(minXp) || isNaN(maxXp) || minXp < 0 || maxXp < minXp) {
                                return modalInteraction.reply({ 
                                    content: '❌ Valeurs invalides!',
                                    ephemeral: true
                                });
                            }

                            setGuildConfig(interaction.guildId, { voiceXp: { min: minXp, max: maxXp } });
                            config = getGuildXPConfig(interaction.guildId);
                            
                            await modalInteraction.reply({ 
                                content: `✅ XP par 15min voice configuré: \`${minXp}-${maxXp}\``,
                                ephemeral: true
                            });

                            // Mettre à jour l'embed
                            await response.edit({
                                embeds: [buildConfigEmbed(config)],
                                components: buildActionRows()
                            });

                        } else if (modalInteraction.customId === 'modal_bonus_cam') {
                            const bonus = parseInt(modalInteraction.fields.getTextInputValue('bonus_cam_percent'));

                            if (isNaN(bonus) || bonus < 0 || bonus > 100) {
                                return modalInteraction.reply({ 
                                    content: '❌ Le bonus doit être entre 0 et 100!',
                                    ephemeral: true
                                });
                            }

                            setGuildConfig(interaction.guildId, { camBonus: bonus });
                            config = getGuildXPConfig(interaction.guildId);
                            
                            await modalInteraction.reply({ 
                                content: `✅ Bonus cam configuré: \`+${bonus}%\``,
                                ephemeral: true
                            });

                            // Mettre à jour l'embed
                            await response.edit({
                                embeds: [buildConfigEmbed(config)],
                                components: buildActionRows()
                            });

                        } else if (modalInteraction.customId === 'modal_bonus_stream') {
                            const bonus = parseInt(modalInteraction.fields.getTextInputValue('bonus_stream_percent'));

                            if (isNaN(bonus) || bonus < 0 || bonus > 100) {
                                return modalInteraction.reply({ 
                                    content: '❌ Le bonus doit être entre 0 et 100!',
                                    ephemeral: true
                                });
                            }

                            setGuildConfig(interaction.guildId, { streamBonus: bonus });
                            config = getGuildXPConfig(interaction.guildId);
                            
                            await modalInteraction.reply({ 
                                content: `✅ Bonus stream configuré: \`+${bonus}%\``,
                                ephemeral: true
                            });

                            // Mettre à jour l'embed
                            await response.edit({
                                embeds: [buildConfigEmbed(config)],
                                components: buildActionRows()
                            });

                        } else if (modalInteraction.customId === 'modal_channel_id') {
                            let channelId = modalInteraction.fields.getTextInputValue('channel_id_input');

                            // Extraire l'ID si c'est une mention
                            if (channelId.startsWith('<#') && channelId.endsWith('>')) {
                                channelId = channelId.slice(2, -1);
                            }

                            // Vérifier que le channel existe
                            const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);
                            if (!channel) {
                                return modalInteraction.reply({ 
                                    content: '❌ Channel introuvable!',
                                    ephemeral: true
                                });
                            }

                            setLvlUpChannelId(interaction.guildId, channelId);
                            config = getGuildXPConfig(interaction.guildId);
                            
                            await modalInteraction.reply({ 
                                content: `✅ Channel level up configuré: <#${channelId}>`,
                                ephemeral: true
                            });

                            // Mettre à jour l'embed
                            await response.edit({
                                embeds: [buildConfigEmbed(config)],
                                components: buildActionRows()
                            });
                        }
                    } catch (error) {
                        console.error('Erreur dans le collecteur de modals:', error);
                        await modalInteraction.reply({ 
                            content: '❌ Une erreur est survenue!',
                            ephemeral: true
                        });
                    }
                };

                interaction.client.on('interactionCreate', modalHandler);

                // Arrêter les collecteurs après 5 minutes
                setTimeout(() => {
                    collector.stop();
                    interaction.client.removeListener('interactionCreate', modalHandler);
                }, 300000);
            }
        } catch (error) {
            console.error('Erreur dans setup:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Error')
                .setDescription('> *Une erreur est survenue.*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
