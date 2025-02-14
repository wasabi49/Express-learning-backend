import Database from 'better-sqlite3';

// データベース接続を初期化する関数
export async function initializeDB() {
    const db = new Database('./database.sqlite');

    // テーブルを作成
    db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo TEXT NOT NULL,
            is_done INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return db;
} 