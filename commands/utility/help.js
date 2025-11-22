import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { blueColor, orangeColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping des catégories
const categoryEmojis = {
    moderation: '📋 Modération',
    economy: '💰 Économie',
    levels: '⭐ XP & Niveaux',
    fun: '😂 Amusement',
    utility: '🛠️ Utilitaires',
    emojis: '🎨 Émojis & Couleurs',
    encoding: '🔐 Encodage',
    roles: '👥 Rôles',
    events: '🎉 Événements',
    music: '🎵 Musique',
    ai: '🤖 IA'
};

// Charger les commandes depuis les fichiers
const loadCategories = async () => {
    const categories = {};
    const stats = { totalCommands: 0, totalSubcommands: 0 };
    const commandsPath = path.join(__dirname, '../../commands');

    const loadCommandsRecursive = async (dir) => {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory() && categoryEmojis[item]) {
                // C'est une catégorie
                const categoryName = categoryEmojis[item];
                categories[categoryName] = [];

                // Charger les commandes de cette catégorie
                const categoryPath = itemPath;
                const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

                for (const file of files) {
                    try {
                        const filePath = path.join(categoryPath, file);
                        const command = await import(`file://${filePath}`);

                        if (command.default && command.default.data) {
                            const cmd = command.default.data;
                            const cmdName = cmd.name;
                            const cmdDesc = cmd.description || 'Pas de description';

                            // Vérifier s'il y a des subcommands
                            const options = cmd.options || [];
                            const hasSubcommands = options.some(opt => opt.type === 1 || opt.type === 2);

                            if (hasSubcommands) {
                                // Charger les subcommands
                                let subCount = 0;
                                for (const opt of options) {
                                    if ((opt.type === 1 || opt.type === 2) && opt.name) {
                                        const subDesc = opt.description || 'Pas de description';
                                        categories[categoryName].push(`\`/${cmdName} ${opt.name}\` - ${subDesc}`);
                                        subCount++;
                                    }
                                }
                                stats.totalSubcommands += subCount;
                            } else {
                                // Commande simple
                                categories[categoryName].push(`\`/${cmdName}\` - ${cmdDesc}`);
                                stats.totalCommands++;
                            }
                        }
                    } catch (error) {
                        console.error(`Erreur lors du chargement de ${file}:`, error);
                    }
                }
            }
        }
    };

    await loadCommandsRecursive(commandsPath);
    return { categories, stats };
};

const categoryNames = Object.keys(categoryEmojis).map(k => categoryEmojis[k]);

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
            await interaction.deferReply();

            const { categories, stats } = await loadCategories();
            const selectedCategory = interaction.options.getString('categorie');

            if (selectedCategory) {
                const commands = categories[selectedCategory] || [];
                const embed = new EmbedBuilder()
                    .setTitle(`\`${selectedCategory}\``)
                    .setDescription(commands.length > 0 ? commands.join('\n') : '> *Aucune commande trouvée*')
                    .setColor(blueColor)
                    .setFooter({
                        text: `${commands.length} commandes • Prefix: +commande`,
                        iconURL: interaction.user.displayAvatarURL()
                    });

                await interaction.editReply({ embeds: [embed] });
            } else {
                const totalCommands = Object.values(categories).reduce((a, b) => a + b.length, 0);
                const embed = new EmbedBuilder()
                    .setTitle('`📚`〃Help - Toutes les Commandes')
                    .setDescription(
                        `> **${Object.keys(categories).length} catégories** | **${stats.totalCommands} commandes** | **${stats.totalSubcommands} subcommands**\n\n` +
                        `> **Utilisation :**\n` +
                        `> • Slash : \`/commande\`\n` +
                        `> • Prefix : \`+commande\` (même nom)\n\n` +
                        `> *Choisissez une catégorie ci-dessous pour voir les commandes !*`
                    )
                    .setColor(orangeColor)
                    .setFooter({ text: 'Ryosen Bot', iconURL: interaction.client.user.displayAvatarURL() });

                const categoryList = Object.keys(categories);
                const rows = [];
                for (let i = 0; i < categoryList.length; i += 5) {
                    const buttons = categoryList.slice(i, i + 5).map((cat, idx) => {
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

                const msg = await interaction.editReply({ embeds: [embed], components: rows });

                const filter = i => i.user.id === interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

                collector.on('collect', async i => {
                    const idx = parseInt(i.customId.split('_')[1]);
                    const catName = categoryList[idx];
                    const cmds = categories[catName];

                    const helpEmbed = new EmbedBuilder()
                        .setTitle(`\`${catName}\``)
                        .setDescription(cmds.length > 0 ? cmds.join('\n') : '> *Aucune commande trouvée*')
                        .setColor(blueColor)
                        .setFooter({
                            text: `${cmds.length} commandes • ${idx + 1}/${categoryList.length}`,
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