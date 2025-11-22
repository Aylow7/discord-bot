import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { blueColor, greenColor, redColor } from '../../config.js';
import { incrementCommandCount } from '../../utils/database.js';
import axios from 'axios';

export default {
    data: new SlashCommandBuilder()
        .setName('fun')
        .setDescription('Commandes amusantes')
        .addSubcommand(sub => sub.setName('8ball').setDescription('Magic 8 Ball'))
        .addSubcommand(sub => sub.setName('coinflip').setDescription('Lancer une pièce'))
        .addSubcommand(sub => sub.setName('dice').setDescription('Lancer un dé').addIntegerOption(opt => opt.setName('faces').setDescription('Nombre de faces (défaut 6)').setMinValue(2).setMaxValue(100)))
        .addSubcommand(sub => sub.setName('howgay').setDescription('Calculer le pourcentage de gay').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur')))
        .addSubcommand(sub => sub.setName('rate').setDescription('Noter quelque chose').addStringOption(opt => opt.setName('chose').setDescription('Chose à noter').setRequired(true)))
        .addSubcommand(sub => sub.setName('cat').setDescription('Obtenir une photo de chat'))
        .addSubcommand(sub => sub.setName('dog').setDescription('Obtenir une photo de chien'))
        .addSubcommand(sub => sub.setName('joke').setDescription('Obtenir une blague'))
        .addSubcommand(sub => sub.setName('meme').setDescription('Obtenir un mème'))
        .addSubcommand(sub => sub.setName('roast').setDescription('Se faire insulter').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur à roast')))
        .addSubcommand(sub => sub.setName('hug').setDescription('Donner un câlin').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)))
        .addSubcommand(sub => sub.setName('kiss').setDescription('Embrasser').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)))
        .addSubcommand(sub => sub.setName('slap').setDescription('Gifler').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)))
        .addSubcommand(sub => sub.setName('kill').setDescription('Tuer (blague)').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)))
        .addSubcommand(sub => sub.setName('marry').setDescription('Se marier').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)))
        .addSubcommand(sub => sub.setName('ship').setDescription('Shipper deux personnes').addUserOption(opt => opt.setName('user1').setDescription('Première personne').setRequired(true)).addUserOption(opt => opt.setName('user2').setDescription('Deuxième personne').setRequired(true)))
        .addSubcommand(sub => sub.setName('pp').setDescription('PP size').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur')))
        .addSubcommand(sub => sub.setName('hack').setDescription('Hacker quelqu\'un (blague)').addUserOption(opt => opt.setName('user').setDescription('L\'utilisateur').setRequired(true)))
        .addSubcommand(sub => sub.setName('rps').setDescription('Pierre, Papier, Ciseaux').addStringOption(opt => opt.setName('choix').setDescription('Votre choix').addChoices({name: 'Pierre', value: 'pierre'}, {name: 'Papier', value: 'papier'}, {name: 'Ciseaux', value: 'ciseaux'}).setRequired(true)))
        .addSubcommand(sub => sub.setName('slots').setDescription('Machine à sous'))
        .addSubcommand(sub => sub.setName('poll').setDescription('Créer un sondage').addStringOption(opt => opt.setName('question').setDescription('Question').setRequired(true))),

    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();

            if (sub === 'coinflip') {
                const result = Math.random() < 0.5 ? 'Pile' : 'Face';
                const embed = new EmbedBuilder()
                    .setTitle('`🪙`〃Coin Flip')
                    .setDescription(`> *Résultat :* **${result}**`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'dice') {
                const faces = interaction.options.getInteger('faces') || 6;
                const result = Math.floor(Math.random() * faces) + 1;
                const embed = new EmbedBuilder()
                    .setTitle('`🎲`〃Dice Roll')
                    .setDescription(`> *Dé à \`${faces}\` faces :* **${result}**`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'howgay') {
                const user = interaction.options.getUser('user') || interaction.user;
                const percentage = Math.floor(Math.random() * 101);
                const embed = new EmbedBuilder()
                    .setTitle('`🏳️‍🌈`〃How Gay')
                    .setDescription(`> *${user} est gay à \`${percentage}%\` !*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'rate') {
                const chose = interaction.options.getString('chose');
                const rating = Math.floor(Math.random() * 11);
                const embed = new EmbedBuilder()
                    .setTitle('`⭐`〃Rating')
                    .setDescription(`> *\`${chose}\` : \`${rating}/10\`*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'cat') {
                try {
                    const res = await axios.get('https://api.thecatapi.com/v1/images/search');
                    const embed = new EmbedBuilder()
                        .setTitle('`🐱`〃Cat')
                        .setImage(res.data[0].url)
                        .setColor(blueColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ embeds: [embed] });
                } catch (e) {
                    await interaction.reply({ content: '❌ Erreur lors de la récupération du chat', ephemeral: true });
                }

            } else if (sub === 'dog') {
                try {
                    const res = await axios.get('https://api.thedogapi.com/v1/images/search');
                    const embed = new EmbedBuilder()
                        .setTitle('`🐶`〃Dog')
                        .setImage(res.data[0].url)
                        .setColor(blueColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ embeds: [embed] });
                } catch (e) {
                    await interaction.reply({ content: '❌ Erreur lors de la récupération du chien', ephemeral: true });
                }

            } else if (sub === 'joke') {
                try {
                    const res = await axios.get('https://api.api-ninjas.com/v1/jokes', { headers: { 'X-Api-Key': 'YOUR_API_KEY' } }).catch(() => null);
                    const embed = new EmbedBuilder()
                        .setTitle('`😂`〃Joke')
                        .setDescription(`> *${res?.data?.[0]?.joke || 'Blague non trouvée'}*`)
                        .setColor(blueColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ embeds: [embed] });
                } catch (e) {
                    await interaction.reply({ content: '❌ Erreur lors de la récupération de la blague', ephemeral: true });
                }

            } else if (sub === 'meme') {
                try {
                    const res = await axios.get('https://api.imgflip.com/get_memes');
                    const meme = res.data.data.memes[Math.floor(Math.random() * res.data.data.memes.length)];
                    const embed = new EmbedBuilder()
                        .setTitle('`😆`〃Meme')
                        .setImage(meme.url)
                        .setColor(blueColor)
                        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ embeds: [embed] });
                } catch (e) {
                    await interaction.reply({ content: '❌ Erreur lors de la récupération du mème', ephemeral: true });
                }

            } else if (sub === 'roast') {
                const user = interaction.options.getUser('user') || interaction.user;
                const roasts = ['T\'es tellement moche que même les glaces crient!', 'Ta beauté est comme un code source - illisible!', 'T\'es tellement nul que même ta mère s\'en doute!'];
                const roast = roasts[Math.floor(Math.random() * roasts.length)];
                const embed = new EmbedBuilder()
                    .setTitle('`🔥`〃Roast')
                    .setDescription(`> ${user} : *${roast}*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'hug') {
                const user = interaction.options.getUser('user');
                const embed = new EmbedBuilder()
                    .setTitle('`🤗`〃Hug')
                    .setDescription(`> *${interaction.user} câline ${user}*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'kiss') {
                const user = interaction.options.getUser('user');
                const embed = new EmbedBuilder()
                    .setTitle('`💋`〃Kiss')
                    .setDescription(`> *${interaction.user} embrasse ${user}*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'slap') {
                const user = interaction.options.getUser('user');
                const embed = new EmbedBuilder()
                    .setTitle('`👋`〃Slap')
                    .setDescription(`> *${interaction.user} gifle ${user}*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'kill') {
                const user = interaction.options.getUser('user');
                const embed = new EmbedBuilder()
                    .setTitle('`⚰️`〃Kill')
                    .setDescription(`> *${interaction.user} tue ${user}*`)
                    .setColor(redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'marry') {
                const user = interaction.options.getUser('user');
                const embed = new EmbedBuilder()
                    .setTitle('`💍`〃Marry')
                    .setDescription(`> *${interaction.user} épouse ${user}*`)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'ship') {
                const user1 = interaction.options.getUser('user1');
                const user2 = interaction.options.getUser('user2');
                const percentage = Math.floor(Math.random() * 101);
                const embed = new EmbedBuilder()
                    .setTitle('`💕`〃Ship')
                    .setDescription(`> *${user1} et ${user2} : \`${percentage}%\`*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'pp') {
                const user = interaction.options.getUser('user') || interaction.user;
                const size = Math.floor(Math.random() * 11);
                const bar = '█'.repeat(size) + '░'.repeat(10 - size);
                const embed = new EmbedBuilder()
                    .setTitle('`📏`〃PP Size')
                    .setDescription(`> *${user} : \`${bar}\` (\`${size}/10\`)*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'hack') {
                const user = interaction.options.getUser('user');
                const embed = new EmbedBuilder()
                    .setTitle('`💻`〃Hack')
                    .setDescription(`> *Hack de ${user} en cours...*\n> \`$> Accès obtenu\`\n> \`$> Téléchargement des données...\`\n> \`$> 100% ✅\``)
                    .setColor(greenColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'rps') {
                const choices = { pierre: '🪨', papier: '📄', ciseaux: '✂️' };
                const playerChoice = interaction.options.getString('choix');
                const botChoices = ['pierre', 'papier', 'ciseaux'];
                const botChoice = botChoices[Math.floor(Math.random() * botChoices.length)];

                let result = '';
                if (playerChoice === botChoice) result = 'Égalité!';
                else if ((playerChoice === 'pierre' && botChoice === 'ciseaux') || (playerChoice === 'papier' && botChoice === 'pierre') || (playerChoice === 'ciseaux' && botChoice === 'papier')) result = 'Tu as gagné!';
                else result = 'Tu as perdu!';

                const embed = new EmbedBuilder()
                    .setTitle('`🎮`〃Pierre Papier Ciseaux')
                    .setDescription(`> *${choices[playerChoice]} vs ${choices[botChoice]}*\n> **${result}**`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'slots') {
                const symbols = ['🍎', '🍊', '🍋', '🍌', '🍉'];
                const result = [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]];
                const win = result[0] === result[1] && result[1] === result[2];
                const embed = new EmbedBuilder()
                    .setTitle('`🎰`〃Slots')
                    .setDescription(`> *${result.join(' ')}*\n> ${win ? '🎉 **GAGNÉ!**' : '❌ Perdu!'}`)
                    .setColor(win ? greenColor : redColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'poll') {
                const question = interaction.options.getString('question');
                const embed = new EmbedBuilder()
                    .setTitle('`📊`〃Sondage')
                    .setDescription(`> ${question}`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                const msg = await interaction.reply({ embeds: [embed] });
                await msg.react('👍');
                await msg.react('👎');

            } else if (sub === '8ball') {
                const responses = ['Oui', 'Non', 'Peut-être', 'C\'est sur!', 'Je ne pense pas', 'Demande plus tard'];
                const result = responses[Math.floor(Math.random() * responses.length)];
                const embed = new EmbedBuilder()
                    .setTitle('`🔮`〃Magic 8 Ball')
                    .setDescription(`> *${result}*`)
                    .setColor(blueColor)
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });
            }

            incrementCommandCount();
        } catch (error) {
            console.error('Erreur fun:', error);
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Erreur')
                .setDescription('> *Une erreur est survenue*')
                .setColor(redColor)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
