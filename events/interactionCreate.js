export default {
    name: 'interactionCreate',
    async execute(interaction, client) {
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
    }
};
