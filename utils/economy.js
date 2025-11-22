import { readDatabase, writeDatabase } from './database.js';

export function getBalance(guildId, userId) {
    const db = readDatabase();
    if (!db.guilds[guildId]) {
        db.guilds[guildId] = { economy: {} };
        writeDatabase(db);
    }
    if (!db.guilds[guildId].economy) {
        db.guilds[guildId].economy = {};
        writeDatabase(db);
    }
    if (!db.guilds[guildId].economy[userId]) {
        db.guilds[guildId].economy[userId] = {
            wallet: 0,
            bank: 0,
            inventory: [],
            lastDaily: 0,
            lastWeekly: 0,
            lastMonthly: 0,
            lastWork: 0
        };
        writeDatabase(db);
    }
    return db.guilds[guildId].economy[userId];
}

export function addMoney(guildId, userId, amount, location = 'wallet') {
    const db = readDatabase();
    const userData = getBalance(guildId, userId);
    userData[location] += amount;
    db.guilds[guildId].economy[userId] = userData;
    writeDatabase(db);
    return userData;
}

export function removeMoney(guildId, userId, amount, location = 'wallet') {
    const db = readDatabase();
    const userData = getBalance(guildId, userId);
    if (userData[location] < amount) {
        return null;
    }
    userData[location] -= amount;
    db.guilds[guildId].economy[userId] = userData;
    writeDatabase(db);
    return userData;
}

export function setBalance(guildId, userId, amount, location = 'wallet') {
    const db = readDatabase();
    const userData = getBalance(guildId, userId);
    userData[location] = amount;
    db.guilds[guildId].economy[userId] = userData;
    writeDatabase(db);
    return userData;
}

export function addItem(guildId, userId, item) {
    const db = readDatabase();
    const userData = getBalance(guildId, userId);
    userData.inventory.push(item);
    db.guilds[guildId].economy[userId] = userData;
    writeDatabase(db);
    return userData;
}

export function removeItem(guildId, userId, itemName) {
    const db = readDatabase();
    const userData = getBalance(guildId, userId);
    const index = userData.inventory.findIndex(i => i.name === itemName);
    if (index !== -1) {
        userData.inventory.splice(index, 1);
        db.guilds[guildId].economy[userId] = userData;
        writeDatabase(db);
        return userData;
    }
    return null;
}
