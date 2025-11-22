import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from './config.js';
import { setBotStartTime } from './utils/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

const loadSlashCommands = async () => {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(`file://${filePath}`);
        if (command.default && command.default.data && command.default.execute) {
            client.slashCommands.set(command.default.data.name, command.default);
            console.log(`✅ Slash command chargée: ${command.default.data.name}`);
        }
    }
};

const loadPrefixCommands = async () => {
    const commandsPath = path.join(__dirname, 'prefixCommands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(`file://${filePath}`);
        if (command.default && command.default.name && command.default.execute) {
            client.prefixCommands.set(command.default.name, command.default);
            console.log(`✅ Prefix command chargée: ${command.default.name}`);
        }
    }
};

const registerSlashCommands = async () => {
    const commands = [];
    client.slashCommands.forEach(command => {
        commands.push(command.data.toJSON());
    });

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('🔄 Démarrage du rechargement des commandes slash...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('✅ Commandes slash rechargées avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors du rechargement des commandes slash:', error);
    }
};

client.once('ready', async () => {
    console.log('╔═══════════════════════════════════════════╗');
    console.log(`║   ✅ Bot connecté en tant que ${client.user.tag}   `);
    console.log('╚═══════════════════════════════════════════╝');
    
    setBotStartTime(Date.now());
    
    client.user.setActivity('Utilisez /help ou +help', { type: 'WATCHING' });
    
    await registerSlashCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Erreur lors de l'exécution de ${interaction.commandName}:`, error);
        const errorMessage = { 
            content: '> *Une erreur est survenue lors de l\'exécution de cette commande.*', 
            ephemeral: true 
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Erreur lors de l'exécution de ${commandName}:`, error);
        await message.channel.send('> *Une erreur est survenue lors de l\'exécution de cette commande.*');
    }
});

const start = async () => {
    try {
        await loadSlashCommands();
        await loadPrefixCommands();
        
        const token = process.env.DISCORD_TOKEN;
        if (!token) {
            console.error('❌ ERREUR: Le token Discord n\'est pas défini dans les variables d\'environnement.');
            console.error('⚠️  Veuillez définir la variable d\'environnement DISCORD_TOKEN');
            process.exit(1);
        }
        
        await client.login(token);
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du bot:', error);
        process.exit(1);
    }
};

start();
