import express from "express";
import { initializeDB } from "./db.js";

const app = express();
app.use(express.json());

let db;

// データベース初期化
initializeDB().then((database) => {
    db = database;
    console.log("データベースの接続に成功しました");
}).catch((err) => {
    console.error("データベースの接続に失敗しました:", err);
});

// ユーザー一覧を取得
app.get("/users", async (req, res) => {
    try {
        const users = await db.all("SELECT * FROM users");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 新しいユーザーを作成
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await db.run(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        res.json({
            id: result.lastID,
            name,
            email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("サーバーが起動しました。ポート3000で待機中...");
});
