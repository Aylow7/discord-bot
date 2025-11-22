import { setBotStartTime } from '../utils/database.js';
import { REST, Routes } from 'discord.js';
import { token } from '../config.js';

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('╔═══════════════════════════════════════════╗');
        console.log(`║  ✅ Bot connecté en tant que ${client.user.tag}  ║`);
        console.log('╚═══════════════════════════════════════════╝');
        
        setBotStartTime(Date.now());
        
        client.user.setActivity('Utilisez /help ou +help', { type: 'WATCHING' });
        
        // Enregistrer les slash commands
        const commands = [];
        client.slashCommands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(token);

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
    }
};
