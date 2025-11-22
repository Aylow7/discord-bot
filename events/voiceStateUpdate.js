import { addVoiceXP, getLvlUpChannelId } from '../utils/xp.js';
import { EmbedBuilder } from 'discord.js';
import { greenColor } from '../config.js';

const VOICE_CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutes
const voiceXpTracker = new Map(); // Tracker les intervalles par guild

export default {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        // Ignorer les bots
        if (newState.member?.user.bot) return;
        
        const userId = newState.id;
        const guildId = newState.guild.id;

        // Quand quelqu'un rejoint un channel vocal
        if (!oldState.channel && newState.channel) {
            console.log(`${newState.member.user.tag} a rejoint le channel vocal`);
            
            // Initier le tracker pour ce user/guild
            if (!voiceXpTracker.has(guildId)) {
                voiceXpTracker.set(guildId, {});
            }
            
            const guildTracker = voiceXpTracker.get(guildId);
            if (!guildTracker[userId]) {
                guildTracker[userId] = setInterval(async () => {
                    // Vérifier si l'utilisateur est toujours en vocal
                    const member = await newState.guild.members.fetch(userId).catch(() => null);
                    if (member && member.voice.channel) {
                        const xpResult = addVoiceXP(guildId, userId, member);
                        
                        if (xpResult && xpResult.levelUp) {
                            const lvlUpChannelId = getLvlUpChannelId(guildId);
                            if (lvlUpChannelId) {
                                try {
                                    const channel = await client.channels.fetch(lvlUpChannelId);
                                    const embed = new EmbedBuilder()
                                        .setTitle('`🎉`〃Level Up!')
                                        .setDescription(`> *${member.user} a atteint le niveau \`${xpResult.newLevel}\` ! Félicitations ! 🎊*`)
                                        .setColor(greenColor)
                                        .setThumbnail(member.user.displayAvatarURL())
                                        .setTimestamp();
                                    
                                    await channel.send({ embeds: [embed] });
                                } catch (error) {
                                    console.error('Erreur lors de l\'envoi du message level up voice:', error);
                                }
                            }
                        }
                    }
                }, VOICE_CHECK_INTERVAL);
            }
        }

        // Quand quelqu'un quitte un channel vocal
        if (oldState.channel && !newState.channel) {
            console.log(`${newState.member.user.tag} a quitté le channel vocal`);
            
            const guildTracker = voiceXpTracker.get(guildId);
            if (guildTracker && guildTracker[userId]) {
                clearInterval(guildTracker[userId]);
                delete guildTracker[userId];
            }
        }

        // Quand quelqu'un change de channel vocal
        if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            console.log(`${newState.member.user.tag} a changé de channel vocal`);
            // L'intervalle continue, pas besoin de faire rien
        }
    }
};
