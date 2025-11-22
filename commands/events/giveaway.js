import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { blueColor, greenColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';

export default {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Créer un giveaway')
        .addStringOption(opt => opt.setName('prize').setDescription('Le prix').setRequired(true))
        .addIntegerOption(opt => opt.setName('duration').setDescription('Durée en minutes').setRequired(true).setMinValue(1))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Nombre de gagnants').setRequired(true).setMinValue(1))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        try {
            const prize = interaction.options.getString('prize');
            const duration = interaction.options.getInteger('duration');
            const winnersCount = interaction.options.getInteger('winners');

            const endTime = Date.now() + (duration * 60 * 1000);

            const embed = new EmbedBuilder()
                .setTitle('`🎉`〃Giveaway')
                .setDescription(
                    `> **Prix :** ${prize}\n` +
                    `> **Organisé par :** ${interaction.user}\n` +
                    `> **Gagnants :** ${winnersCount}\n` +
                    `> **Se termine :** <t:${Math.floor(endTime / 1000)}:R>\n\n` +
                    `> *Réagissez avec 🎉 pour participer !*`
                )
                .setColor(blueColor)
                .setFooter({ text: `Se termine le`, iconURL: interaction.guild.iconURL() })
                .setTimestamp(endTime);

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            await message.react('🎉');

            // Attendre la fin du giveaway
            setTimeout(async () => {
                try {
                    const updatedMessage = await interaction.channel.messages.fetch(message.id);
                    const reactions = updatedMessage.reactions.cache.get('🎉');
                    
                    if (!reactions || reactions.count <= 0) {
                        await interaction.channel.send('> *Personne n\'a participé au giveaway !*');
                        return;
                    }

                    // Récupérer tous les utilisateurs qui ont réagi (sauf le bot)
                    const users = await reactions.users.fetch();
                    const participants = users.filter(user => !user.bot).map(user => user);

                    if (participants.length === 0) {
                        await interaction.channel.send('> *Personne n\'a participé au giveaway !*');
                        return;
                    }

                    // Sélectionner les gagnants aléatoirement
                    const winners = [];
                    const numWinners = Math.min(winnersCount, participants.length);
                    
                    for (let i = 0; i < numWinners; i++) {
                        const randomIndex = Math.floor(Math.random() * participants.length);
                        winners.push(participants[randomIndex]);
                        participants.splice(randomIndex, 1);
                    }

                    // Envoyer le message de félicitation
                    const winnerMentions = winners.map(w => `<@${w.id}>`).join(', ');
                    const winnerEmbed = new EmbedBuilder()
                        .setTitle('`🎊`〃Bravo!')
                        .setDescription(`> *Félicitations ${winnerMentions} !*\n> *Vous avez gagné **${prize}** !*`)
                        .setColor(greenColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

                    await interaction.channel.send({ embeds: [winnerEmbed] });
                } catch (error) {
                    console.error('Erreur lors de la finalisation du giveaway:', error);
                }
            }, duration * 60 * 1000);

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur giveaway:', error);
        }
    }
};
