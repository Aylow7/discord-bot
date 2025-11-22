import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config, token } from './config.js';
import { initDatabase, setBotStartTime } from './utils/database.js';
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
    
    async function loadDir(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                await loadDir(itemPath);
            } else if (item.endsWith('.js')) {
                try {
                    const command = await import(`file://${itemPath}`);
                    if (command.default && command.default.data && command.default.execute) {
                        client.slashCommands.set(command.default.data.name, command.default);
                        console.log(`✅ Slash command chargée: ${command.default.data.name}`);
                    }
                } catch (e) {
                    console.error(`❌ Erreur ${item}:`, e.message);
                }
            }
        }
    }
    
    await loadDir(commandsPath);
};

const loadPrefixCommands = async () => {
    const commandsPath = path.join(__dirname, 'prefixCommands');
    
    async function loadDir(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                await loadDir(itemPath);
            } else if (item.endsWith('.js')) {
                try {
                    const command = await import(`file://${itemPath}`);
                    if (command.default && command.default.name && command.default.execute) {
                        client.prefixCommands.set(command.default.name, command.default);
                        console.log(`✅ Prefix command chargée: ${command.default.name}`);
                    }
                } catch (e) {
                    console.error(`❌ Erreur ${item}:`, e.message);
                }
            }
        }
    }
    
    await loadDir(commandsPath);
};

const loadEvents = async () => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        try {
            const event = await import(`file://${path.join(eventsPath, file)}`);
            if (event.default && event.default.name && event.default.execute) {
                if (event.default.once) {
                    client.once(event.default.name, (...args) => event.default.execute(...args, client));
                } else {
                    client.on(event.default.name, (...args) => event.default.execute(...args, client));
                }
                console.log(`✅ Événement chargé: ${event.default.name}`);
            }
        } catch (e) {
            console.error(`❌ Erreur ${file}:`, e.message);
        }
    }
};

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
        initDatabase();
        await loadSlashCommands();
        await loadPrefixCommands();
        await loadEvents();
        
        if (!token) {
            console.error('❌ ERREUR: Le token Discord n\'est pas défini dans les variables d\'environnement.');
            console.error('⚠️  Veuillez définir la variable d\'environnement DISCORD_TOKEN');
            process.exit(1);
        }
        
        await client.login(token || process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du bot:', error);
        process.exit(1);
    }
};

start();