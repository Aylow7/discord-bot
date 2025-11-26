import { setBotStartTime } from '../utils/database.js';
import { REST, Routes } from 'discord.js';
import { token, guildId } from '../config.js';

const GUILD_ID = guildId;

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('╔═══════════════════════════════════════════╗');
        console.log(`║  ✅ Bot connecté en tant que ${client.user.tag}  ║`);
        console.log('╚═══════════════════════════════════════════╝\n');
        
        setBotStartTime(Date.now());
        client.user.setActivity('Utilisez /help ou +help', { type: 'WATCHING' });
        console.log(`✅ ${client.slashCommands.size} commandes slash prêtes`);
        
        // Enregistrer les commandes dans la guild
        try {
            const commands = [];
            client.slashCommands.forEach(command => {
                commands.push(command.data.toJSON());
            });

            const rest = new REST({ version: '10' }).setToken(token);
            
            console.log(`🔄 Enregistrement des commandes dans la guild ${GUILD_ID}...`);
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, GUILD_ID),
                { body: commands }
            );
            console.log('✅ Commandes slash enregistrées dans la guild !');
        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement des commandes:', error.message);
        }
    }
};

