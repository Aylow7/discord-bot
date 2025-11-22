import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { blueColor, orangeColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

const categories = {
    '📋 Modération': [
        '`/ban` - Bannir un membre',
        '`/kick` - Expulser un membre',
        '`/warn` - Avertir un membre',
        '`/mute` - Mettre en mute',
        '`/unmute` - Retirer le mute',
        '`/clear` - Supprimer messages',
        '`/lock` - Verrouiller salon',
        '`/unlock` - Déverrouiller',
        '`/slowmode` - Slowmode',
        '`/softban` - Softban',
        '`/tempban` - Ban temporaire',
        '`/lockdown` - Verrouiller serveur',
        '`/nuke` - Recréer salon',
        '`/unban` - Débannir',
        '`/warnings` - Voir avertissements',
        '`/clearwarns` - Effacer avertissements',
        '`/timeout` - Timeout membre',
        '`/role` - Modifier rôles'
    ],
    '💰 Économie': [
        '`/balance` - Voir solde',
        '`/daily` - Récompense quotidienne',
        '`/weekly` - Récompense hebdomadaire',
        '`/monthly` - Récompense mensuelle',
        '`/work` - Travailler',
        '`/beg` - Mendier argent',
        '`/pay` - Donner argent',
        '`/deposit` - Déposer banque',
        '`/withdraw` - Retirer banque',
        '`/rob` - Voler quelqu\'un',
        '`/crime` - Commettre crime',
        '`/shop` - Voir boutique',
        '`/buy` - Acheter article',
        '`/inventory` - Inventaire'
    ],
    '⭐ XP & Niveaux': [
        '`/rank` - Voir niveau',
        '`/leaderboard` - Top 10',
        '`/xpadd` - Ajouter XP',
        '`/xpset` - Définir XP'
    ],
    '😂 Amusement': [
        '`/8ball` - Boule magique',
        '`/hug` - Faire câlin',
        '`/kiss` - Faire bisou',
        '`/slap` - Gifler',
        '`/dice` - Lancer dé',
        '`/coinflip` - Lancer pièce',
        '`/howgay` - % de gay',
        '`/pp` - Taille pp',
        '`/roast` - Insulter',
        '`/kill` - Tuer',
        '`/hack` - Hacker (fake)',
        '`/cat` - Photo chat',
        '`/dog` - Photo chien',
        '`/meme` - Meme',
        '`/rps` - Pierre Papier Ciseaux',
        '`/slots` - Machine à sous',
        '`/joke` - Blague',
        '`/marry` - Se marier',
        '`/ship` - Compatibilité',
        '`/rate` - Noter quelqu\'un',
        '`/poll` - Sondage'
    ],
    '🛠️ Utilitaires': [
        '`/ping` - Latence bot',
        '`/uptime` - Uptime bot',
        '`/botinfo` - Info bot',
        '`/serverinfo` - Info serveur',
        '`/stats` - Stats serveur',
        '`/userinfo` - Info utilisateur',
        '`/whois` - Infos détaillées',
        '`/avatar` - Avatar utilisateur',
        '`/banner` - Bannière',
        '`/calc` - Calculatrice',
        '`/reverse` - Inverser texte',
        '`/translate` - Traduire',
        '`/invite` - Lien invitation',
        '`/reminder` - Rappel',
        '`/weather` - Météo',
        '`/membercount` - Nombre membres',
        '`/channelinfo` - Info salon',
        '`/servericon` - Icône serveur',
        '`/nickname` - Changer surnom',
        '`/say` - Dire quelque chose',
        '`/dm` - Message privé'
    ],
    '🎨 Émojis & Couleurs': [
        '`/emoji` - Agrandir emoji',
        '`/addemoji` - Ajouter emoji',
        '`/steal` - Voler emoji',
        '`/enlarge` - Agrandir',
        '`/bigemoji` - Gros emoji',
        '`/color` - Afficher couleur',
        '`/ascii` - ASCII art'
    ],
    '🔐 Encodage': [
        '`/binary` - Convertir binaire',
        '`/hex` - Convertir hexadécimal',
        '`/base64` - Base64',
        '`/hash` - Hacher texte',
        '`/randomnumber` - Nombre aléatoire',
        '`/choose` - Choisir options'
    ],
    '👥 Rôles': [
        '`/addrole` - Ajouter rôle',
        '`/removerole` - Retirer rôle',
        '`/roleinfo` - Info rôle',
        '`/createrole` - Créer rôle',
        '`/deleterole` - Supprimer rôle'
    ],
    '🎉 Événements': [
        '`/giveaway` - Giveaway',
        '`/suggest` - Suggestion',
        '`/ticket` - Tickets',
        '`/botban` - Bannir du bot',
        '`/botunban` - Débannir du bot',
        '`/announce` - Annonce',
        '`/embed` - Embed personnalisé'
    ],
    '🎵 Musique': [
        '`/play` - Jouer musique',
        '`/queue` - File d\'attente'
    ],
    '🤖 IA': [
        '`/ai` - Parler IA',
        '`/imagine` - Générer image',
        '`/afk` - Définir AFK'
    ]
};

const categoryNames = Object.keys(categories);

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Voir TOUTES les commandes triées par catégorie')
        .addStringOption(opt =>
            opt.setName('categorie')
                .setDescription('Catégorie à afficher')
                .addChoices(
                    { name: '📋 Modération', value: '📋 Modération' },
                    { name: '💰 Économie', value: '💰 Économie' },
                    { name: '⭐ XP & Niveaux', value: '⭐ XP & Niveaux' },
                    { name: '😂 Amusement', value: '😂 Amusement' },
                    { name: '🛠️ Utilitaires', value: '🛠️ Utilitaires' },
                    { name: '🎨 Émojis & Couleurs', value: '🎨 Émojis & Couleurs' },
                    { name: '🔐 Encodage', value: '🔐 Encodage' },
                    { name: '👥 Rôles', value: '👥 Rôles' },
                    { name: '🎉 Événements', value: '🎉 Événements' },
                    { name: '🎵 Musique', value: '🎵 Musique' },
                    { name: '🤖 IA', value: '🤖 IA' }
                )
        ),

    async execute(interaction) {
        try {
            const selectedCategory = interaction.options.getString('categorie');

            if (selectedCategory) {
                const commands = categories[selectedCategory];
                const embed = new EmbedBuilder()
                    .setTitle(`\`${selectedCategory}\``)
                    .setDescription(commands.join('\n'))
                    .setColor(blueColor)
                    .setFooter({ 
                        text: `${commands.length} commandes • Prefix: +commande`, 
                        iconURL: interaction.user.displayAvatarURL() 
                    });

                await interaction.reply({ embeds: [embed] });
            } else {
                const totalCommands = Object.values(categories).reduce((a, b) => a + b.length, 0);
                const embed = new EmbedBuilder()
                    .setTitle('`📚`〃Help - Toutes les Commandes')
                    .setDescription(
                        `> **${categoryNames.length} catégories** | **${totalCommands} commandes slash**\n\n` +
                        `> **Utilisation :**\n` +
                        `> • Slash : \`/commande\`\n` +
                        `> • Prefix : \`+commande\` (même nom)\n\n` +
                        `> *Choisissez une catégorie ci-dessous pour voir les commandes !*`
                    )
                    .setColor(orangeColor)
                    .setFooter({ text: 'Ryosen Bot • 111+ Commandes', iconURL: interaction.client.user.displayAvatarURL() });

                const rows = [];
                for (let i = 0; i < categoryNames.length; i += 5) {
                    const buttons = categoryNames.slice(i, i + 5).map((cat, idx) => {
                        const icon = cat.split(' ')[0];
                        const name = cat.split(' ').slice(1).join(' ');
                        return new ButtonBuilder()
                            .setCustomId(`help_${i + idx}`)
                            .setLabel(name.substring(0, 20))
                            .setEmoji(icon)
                            .setStyle(ButtonStyle.Secondary);
                    });
                    rows.push(new ActionRowBuilder().addComponents(buttons));
                }

                const msg = await interaction.reply({ embeds: [embed], components: rows, fetchReply: true });

                const filter = i => i.user.id === interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

                collector.on('collect', async i => {
                    const idx = parseInt(i.customId.split('_')[1]);
                    const catName = categoryNames[idx];
                    const cmds = categories[catName];

                    const helpEmbed = new EmbedBuilder()
                        .setTitle(`\`${catName}\``)
                        .setDescription(cmds.join('\n'))
                        .setColor(blueColor)
                        .setFooter({ 
                            text: `${cmds.length} commandes • ${idx + 1}/${categoryNames.length}`, 
                            iconURL: interaction.user.displayAvatarURL() 
                        });

                    await i.update({ embeds: [helpEmbed] });
                });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur help:', error);
        }
    }
};
