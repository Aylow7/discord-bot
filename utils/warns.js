import { readDatabase, writeDatabase } from './database.js';
import { EmbedBuilder } from 'discord.js';
import { blueColor, redColor } from '../config.js';

export async function add(guildId, userId, reason, modId) {
    const db = readDatabase();
    if (!db.guilds[guildId]) {
        db.guilds[guildId] = { warns: {} };
    }
    if (!db.guilds[guildId].warns) {
        db.guilds[guildId].warns = {};
    }
    if (!db.guilds[guildId].warns[userId]) {
        db.guilds[guildId].warns[userId] = [];
    }

    const warnCase = {
        id: db.guilds[guildId].warns[userId].length + 1,
        reason: reason,
        moderator: modId,
        timestamp: Date.now()
    };

    db.guilds[guildId].warns[userId].push(warnCase);
    writeDatabase(db);
    return warnCase.id;
}

export async function view(guild, target) {
    const db = readDatabase();
    const warns = db.guilds[guild.id]?.warns?.[target.id] || [];

    if (warns.length === 0) {
        const embed = new EmbedBuilder()
            .setTitle('`📋`〃Warns List')
            .setDescription(`> *${target} n'a aucun warn.*`)
            .setColor(blueColor);
        return { embeds: [embed] };
    }

    let description = `> *Warns de ${target} (\`${target.id}\`)*\n\n`;
    for (const warn of warns) {
        const mod = await guild.members.fetch(warn.moderator).catch(() => null);
        const modTag = mod ? mod.user.tag : 'Inconnu';
        description += `**Warn #${warn.id}**\n`;
        description += `> *Raison:* ${warn.reason}\n`;
        description += `> *Modérateur:* ${modTag}\n`;
        description += `> *Date:* <t:${Math.floor(warn.timestamp / 1000)}:F>\n\n`;
    }

    const embed = new EmbedBuilder()
        .setTitle('`📋`〃Warns List')
        .setDescription(description)
        .setColor(blueColor);

    return { embeds: [embed] };
}

export async function remove(guildId, userId, caseNumber) {
    const db = readDatabase();
    if (!db.guilds[guildId]?.warns?.[userId]) {
        throw new Error('Aucun warn trouvé pour cet utilisateur');
    }

    const warns = db.guilds[guildId].warns[userId];
    const index = warns.findIndex(w => w.id === parseInt(caseNumber));
    
    if (index === -1) {
        throw new Error(`Warn #${caseNumber} introuvable`);
    }

    warns.splice(index, 1);
    writeDatabase(db);
}

export async function reason(guildId, userId, caseNumber, newReason) {
    const db = readDatabase();
    if (!db.guilds[guildId]?.warns?.[userId]) {
        throw new Error('Aucun warn trouvé pour cet utilisateur');
    }

    const warn = db.guilds[guildId].warns[userId].find(w => w.id === parseInt(caseNumber));
    
    if (!warn) {
        throw new Error(`Warn #${caseNumber} introuvable`);
    }

    warn.reason = newReason;
    writeDatabase(db);
}

export function getWarns(guildId, userId) {
    const db = readDatabase();
    return db.guilds[guildId]?.warns?.[userId] || [];
}

export function clearWarns(guildId, userId) {
    const db = readDatabase();
    if (!db.guilds[guildId]) {
        db.guilds[guildId] = { warns: {} };
    }
    if (!db.guilds[guildId].warns) {
        db.guilds[guildId].warns = {};
    }
    db.guilds[guildId].warns[userId] = [];
    writeDatabase(db);
}
