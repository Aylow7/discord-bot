import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

export default {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Récupère un meme aléatoire depuis Reddit'),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: false });
            
            const res = await fetch("https://www.reddit.com/r/memes/top.json?limit=50&t=day");
            const data = await res.json();
            const posts = data?.data?.children?.filter(post => post.data && !post.data.over_18);

            if (!posts || !posts.length) throw new Error("Aucun meme trouvé");

            const meme = posts[Math.floor(Math.random() * posts.length)].data;

            let authorAvatar = null;
            try {
                const authorRes = await fetch(`https://www.reddit.com/user/${meme.author}/about.json`);
                const authorData = await authorRes.json();
                authorAvatar = authorData?.data?.icon_img || null;
            } catch {}

            const embed = new EmbedBuilder()
                .setTitle(meme.title)
                .setURL(`https://www.reddit.com${meme.permalink}`)
                .setImage(meme.url)
                .setAuthor({ name: `u/${meme.author}`, iconURL: authorAvatar || undefined })
                .setFooter({ text: `👍 ${meme.ups} upvotes` })

            await interaction.editReply({ embeds: [embed] });
        } catch(error) {
            console.error(`Erreur dans /meme : ${error}`);
            
            const embed = new EmbedBuilder()
                .setTitle('`❌`〃Erreur')
                .setDescription(`> *Une erreur est survenue :*\n\`\`\`ansi\n[1;31m${error}[0m\n\`\`\``)
                .setColor(15548997)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
};
