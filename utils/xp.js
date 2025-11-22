import { readDatabase, writeDatabase } from './database.js';

export function getXP(guildId, userId) {
    const db = readDatabase();
    if (!db.guilds[guildId]) {
        db.guilds[guildId] = { xp: {} };
        writeDatabase(db);
    }
    if (!db.guilds[guildId].xp) {
        db.guilds[guildId].xp = {};
        writeDatabase(db);
    }
    if (!db.guilds[guildId].xp[userId]) {
        db.guilds[guildId].xp[userId] = {
            xp: 0,
            level: 1,
            lastMessage: 0
        };
        writeDatabase(db);
    }
    return db.guilds[guildId].xp[userId];
}

export function addXP(guildId, userId, amount) {
    const db = readDatabase();
    const userData = getXP(guildId, userId);
    userData.xp += amount;
    
    const requiredXP = userData.level * 100;
    if (userData.xp >= requiredXP) {
        userData.level += 1;
        userData.xp -= requiredXP;
        db.guilds[guildId].xp[userId] = userData;
        writeDatabase(db);
        return { levelUp: true, newLevel: userData.level, userData };
    }
    
    db.guilds[guildId].xp[userId] = userData;
    writeDatabase(db);
    return { levelUp: false, userData };
}

export function setXP(guildId, userId, xp) {
    const db = readDatabase();
    const userData = getXP(guildId, userId);
    userData.xp = xp;
    db.guilds[guildId].xp[userId] = userData;
    writeDatabase(db);
    return userData;
}

export function setLevel(guildId, userId, level) {
    const db = readDatabase();
    const userData = getXP(guildId, userId);
    userData.level = level;
    db.guilds[guildId].xp[userId] = userData;
    writeDatabase(db);
    return userData;
}

export function getLeaderboard(guildId, limit = 10) {
    const db = readDatabase();
    if (!db.guilds[guildId]?.xp) return [];
    
    const users = Object.entries(db.guilds[guildId].xp)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            return b.xp - a.xp;
        })
        .slice(0, limit);
    
    return users;
}
