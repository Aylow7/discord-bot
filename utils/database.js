import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../database/config.json');

export function readDatabase() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture de la base de données:', error);
        return {
            botStartTime: null,
            totalCommands: 0,
            guilds: {}
        };
    }
}

export function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans la base de données:', error);
        return false;
    }
}

export function incrementCommandCount() {
    const db = readDatabase();
    db.totalCommands = (db.totalCommands || 0) + 1;
    writeDatabase(db);
}

export function setBotStartTime(timestamp) {
    const db = readDatabase();
    db.botStartTime = timestamp;
    writeDatabase(db);
}

export function getBotStartTime() {
    const db = readDatabase();
    return db.botStartTime;
}
