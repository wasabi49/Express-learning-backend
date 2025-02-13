import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// データベース接続を初期化する関数
export async function initializeDB() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // テーブルを作成
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return db;
} 