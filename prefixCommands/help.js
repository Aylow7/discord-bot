import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { blueColor, orangeColor } from '../config.js';
import { incrementCommandCount } from '../utils/database.js';

const categories = {
    '📋 Modération': [
        '`+ban` - Bannir un membre',
        '`+kick` - Expulser un membre',
        '`+warn` - Avertir un membre',
        '`+mute` - Mettre en mute',
        '`+clear` - Supprimer messages',
        '`+unban` - Débannir'
    ],
    '💰 Économie': [
        '`+balance` - Voir solde',
        '`+daily` - Récompense quotidienne',
        '`+weekly` - Récompense hebdomadaire',
        '`+monthly` - Récompense mensuelle',
        '`+work` - Travailler',
        '`+beg` - Mendier argent',
        '`+pay` - Donner argent',
        '`+deposit` - Déposer banque',
        '`+withdraw` - Retirer banque',
        '`+rob` - Voler quelqu\'un'
    ],
    '⭐ XP & Niveaux': [
        '`+rank` - Voir niveau',
        '`+leaderboard` - Top 10'
    ],
    '😂 Amusement': [
        '`+8ball` - Boule magique',
        '`+hug` - Faire câlin',
        '`+kiss` - Faire bisou',
        '`+slap` - Gifler',
        '`+dice` - Lancer dé',
        '`+coinflip` - Lancer pièce',
        '`+roast` - Insulter',
        '`+kill` - Tuer',
        '`+hack` - Hacker (fake)',
        '`+joke` - Blague',
        '`+marry` - Se marier',
        '`+rate` - Noter quelqu\'un'
    ],
    '🛠️ Utilitaires': [
        '`+ping` - Latence bot',
        '`+uptime` - Uptime bot',
        '`+botinfo` - Info bot',
        '`+serverinfo` - Info serveur',
        '`+userinfo` - Info utilisateur',
        '`+avatar` - Avatar utilisateur',
        '`+membercount` - Nombre membres',
        '`+invite` - Lien invitation'
    ]
};

const categoryNames = Object.keys(categories);

export default {
    name: 'help',
    description: 'Voir toutes les commandes triées par catégorie',

    async execute(message, args) {
        try {
            if (args.length > 0) {
                const categoryInput = args.join(' ');
                const selectedCategory = categoryNames.find(cat => cat.includes(categoryInput) || cat.toLowerCase().includes(categoryInput.toLowerCase()));

                if (selectedCategory) {
                    const commands = categories[selectedCategory];
                    const embed = new EmbedBuilder()
                        .setTitle(`\`${selectedCategory}\``)
                        .setDescription(commands.join('\n'))
                        .setColor(blueColor)
                        .setFooter({ text: `${commands.length} commandes • Aussi disponibles en /slash`, iconURL: message.author.displayAvatarURL() });

                    return message.reply({ embeds: [embed] });
                }
            }

            const totalCommands = Object.values(categories).reduce((a, b) => a + b.length, 0);
            const embed = new EmbedBuilder()
                .setTitle('`📚`〃Help - Toutes les Commandes')
                .setDescription(
                    `> **${categoryNames.length} catégories** | **${totalCommands}+ commandes prefix**\n\n` +
                    `> **Utilisation :**\n` +
                    `> • Slash : \`/commande\`\n` +
                    `> • Prefix : \`+commande\`\n\n` +
                    `> **Catégories disponibles :**\n` +
                    categoryNames.map(cat => `> ${cat}`).join('\n') +
                    `\n\n> *Utilisez \`+help <catégorie>\` pour voir les commandes d'une catégorie.*`
                )
                .setColor(orangeColor)
                .setFooter({ text: 'Ryosen Bot • 111+ Commandes', iconURL: message.client.user.displayAvatarURL() });

            await message.reply({ embeds: [embed] });
            incrementCommandCount();
        } catch (error) {
            console.error('Erreur help:', error);
        }
    }
};
