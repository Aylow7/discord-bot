import { readDatabase, writeDatabase } from './database.js';

const MESSAGE_XP_COOLDOWN = 5000; // 5 secondes
const XP_PER_LEVEL = 100;

// Configuration par défaut
const DEFAULT_CONFIG = {
    messageXp: { min: 1, max: 5 },
    voiceXp: { min: 4, max: 12 },
    streamBonus: 5, // +5%
    camBonus: 10,   // +10%
    roleBonus: {},  // { roleId: percentage }
    lvlUpChannelId: null
};

function getGuildConfig(guildId) {
    const db = readDatabase();
    if (!db.guilds[guildId]) {
        db.guilds[guildId] = { xp: {}, xpConfig: { ...DEFAULT_CONFIG } };
        writeDatabase(db);
    }
    if (!db.guilds[guildId].xpConfig) {
        db.guilds[guildId].xpConfig = { ...DEFAULT_CONFIG };
        writeDatabase(db);
    }
    return db.guilds[guildId].xpConfig;
}

function calculateBonus(member, config) {
    let bonus = 0;
    
    // Bonus cam
    if (member?.voice?.streaming) {
        bonus += config.streamBonus || 5;
    }
    
    // Bonus stream
    if (member?.voice?.selfVideo) {
        bonus += config.camBonus || 10;
    }
    
    // Bonus rôles
    if (member && config.roleBonus) {
        for (const roleId in config.roleBonus) {
            if (member.roles.cache.has(roleId)) {
                bonus += config.roleBonus[roleId];
            }
        }
    }
    
    return bonus;
}

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
    
    const requiredXP = userData.level * XP_PER_LEVEL;
    let leveledUp = false;
    let newLevel = userData.level;

    if (userData.xp >= requiredXP) {
        newLevel = userData.level + 1;
        userData.level = newLevel;
        leveledUp = true;
    }
    
    db.guilds[guildId].xp[userId] = userData;
    writeDatabase(db);
    return { levelUp: leveledUp, newLevel, userData };
}

export function addMessageXP(guildId, userId, member = null) {
    const db = readDatabase();
    const userData = getXP(guildId, userId);
    const config = getGuildConfig(guildId);
    
    // Cooldown de 5 secondes entre les XP
    const now = Date.now();
    if (now - userData.lastMessage < MESSAGE_XP_COOLDOWN) {
        return null;
    }

    let xpGain = Math.floor(Math.random() * (config.messageXp.max - config.messageXp.min + 1)) + config.messageXp.min;
    
    // Appliquer les bonus
    if (member) {
        const bonus = calculateBonus(member, config);
        xpGain = Math.floor(xpGain * (1 + bonus / 100));
    }
    
    userData.lastMessage = now;
    
    const result = addXP(guildId, userId, xpGain);
    return { ...result, xpGain };
}

export function addVoiceXP(guildId, userId, member = null) {
    const config = getGuildConfig(guildId);
    
    let xpGain = Math.floor(Math.random() * (config.voiceXp.max - config.voiceXp.min + 1)) + config.voiceXp.min;
    
    // Appliquer les bonus
    if (member) {
        const bonus = calculateBonus(member, config);
        xpGain = Math.floor(xpGain * (1 + bonus / 100));
    }
    
    const result = addXP(guildId, userId, xpGain);
    return { ...result, xpGain };
}

export function setXP(guildId, userId, xp) {
    const db = readDatabase();
    const userData = getXP(guildId, userId);
    userData.xp = xp;
    db.guilds[guildId].xp[userId] = userData;
    writeDatabase(db);
    return userData;
}

export function setGuildConfig(guildId, config) {
    const db = readDatabase();
    if (!db.guilds[guildId]) {
        db.guilds[guildId] = { xp: {} };
    }
    db.guilds[guildId].xpConfig = { ...db.guilds[guildId].xpConfig, ...config };
    writeDatabase(db);
    return db.guilds[guildId].xpConfig;
}

export function getGuildXPConfig(guildId) {
    return getGuildConfig(guildId);
}

export function setLvlUpChannelId(guildId, channelId) {
    return setGuildConfig(guildId, { lvlUpChannelId: channelId });
}

export function getLvlUpChannelId(guildId) {
    const config = getGuildConfig(guildId);
    return config.lvlUpChannelId || null;
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
