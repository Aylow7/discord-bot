import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Player } from 'discord-player';
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
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

const loadSlashCommands = async () => {
    const commandsPath = path.join(__dirname, 'commands');
    
    const loadCommandsRecursive = async (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // Charger récursivement les sous-dossiers
                await loadCommandsRecursive(itemPath);
            } else if (item.endsWith('.js')) {
                // Charger les fichiers JS
                const command = await import(`file://${itemPath}`);
                if (command.default && command.default.data && command.default.execute) {
                    client.slashCommands.set(command.default.data.name, command.default);
                    console.log(`✅ Slash command chargée: ${command.default.data.name}`);
                }
            }
        }
    };
    
    await loadCommandsRecursive(commandsPath);
};

const loadPrefixCommands = async () => {
    const commandsPath = path.join(__dirname, 'prefixCommands');
    
    const loadCommandsRecursive = async (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // Charger récursivement les sous-dossiers
                await loadCommandsRecursive(itemPath);
            } else if (item.endsWith('.js')) {
                // Charger les fichiers JS
                const command = await import(`file://${itemPath}`);
                if (command.default && command.default.name && command.default.execute) {
                    client.prefixCommands.set(command.default.name, command.default);
                    console.log(`✅ Prefix command chargée: ${command.default.name}`);
                }
            }
        }
    };
    
    await loadCommandsRecursive(commandsPath);
};

const loadEvents = async () => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = await import(`file://${filePath}`);
        
        if (event.default && event.default.name && event.default.execute) {
            if (event.default.once) {
                client.once(event.default.name, (...args) => event.default.execute(...args, client));
                console.log(`✅ Événement chargé (une fois): ${event.default.name}`);
            } else {
                client.on(event.default.name, (...args) => event.default.execute(...args, client));
                console.log(`✅ Événement chargé: ${event.default.name}`);
            }
        }
    }
};

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
