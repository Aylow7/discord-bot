import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../database/config.json');

const DEFAULT_DB = {
    botStartTime: null,
    totalCommands: 0,
    guilds: {}
};

export function initDatabase() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
            console.log('✅ Base de données initialisée');
        } else {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            if (!data || data.trim() === '') {
                fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
                console.log('✅ Base de données réinitialisée (fichier vide)');
            }
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    }
}

export function readDatabase() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            initDatabase();
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        if (!data || data.trim() === '') {
            return DEFAULT_DB;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture de la base de données:', error);
        return DEFAULT_DB;
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
