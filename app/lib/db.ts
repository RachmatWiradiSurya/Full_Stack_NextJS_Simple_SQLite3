import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const globalForDb = globalThis as typeof globalThis & {
  sqliteDb?: Database.Database;
};

function createDatabase() {
  const dataDirectory = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  const database = new Database(
    path.join(dataDirectory, "database.sqlite")
  );

  database.pragma("foreign_keys = ON");
  database.pragma("journal_mode = WAL");

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user_id
      ON tasks(user_id);
  `);

  return database;
}

const db = globalForDb.sqliteDb ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqliteDb = db;
}

export default db;
