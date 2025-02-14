import express from "express";
import { initializeDB } from "./db.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

let db;

async function startServer() {
    try {
        db = await initializeDB();

        app.get("/", async (req, res) => {
            const todos = db.prepare(`
                SELECT id, todo, is_done, created_at 
                FROM todos 
                WHERE is_deleted = 0
                ORDER BY created_at DESC
            `).all();
            res.json(todos);
            console.log("get");
        });

        app.post("/", async (req, res) => {
            console.log("post");
            const { todo } = req.body;
            try {
                const stmt = db.prepare("INSERT INTO todos (todo) VALUES (?)");
                const result = stmt.run(todo);
                res.json({
                    message: "Todo created successfully",
                    id: result.lastInsertRowid
                });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.put("/:id", async (req, res) => {
            const { id } = req.params;
            const { todo } = req.body;
            const stmt = db.prepare("UPDATE todos SET todo = ? WHERE id = ?");
            stmt.run(todo, id);
            res.json({ message: "Todo updated successfully" });
            console.log("put");
        });

        app.delete("/:id", async (req, res) => {
            const { id } = req.params;
            const stmt = db.prepare("UPDATE todos SET is_deleted = 1 WHERE id = ?");
            stmt.run(id);
            res.json({ message: "Todo deleted successfully" });
            console.log("delete");
        });

        // チェックボックスの状態を更新
        app.put("/:id/toggle", async (req, res) => {
            const { id } = req.params;
            try {
                // 現在の状態を取得
                const todo = db.prepare("SELECT is_done FROM todos WHERE id = ?").get(id);
                if (!todo) {
                    return res.status(404).json({ error: "Todo not found" });
                }

                // 状態を反転（0→1、1→0）
                const newState = todo.is_done === 0 ? 1 : 0;

                // 更新を実行
                const stmt = db.prepare("UPDATE todos SET is_done = ? WHERE id = ?");
                stmt.run(newState, id);

                res.json({
                    message: "Todo status updated successfully",
                    is_done: newState
                });
                console.log("toggle", id, newState);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.listen(3000, '0.0.0.0', () => {
            console.log("サーバーが起動しました。ポート3000で待機中...");
        });
    } catch (err) {
        console.error("データベース初期化エラー:", err);
        process.exit(1);
    }
}

startServer();
