import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'lib/database');
const dbPath = path.join(dbDir, 'users.db');

// Создаем папку если она не существует
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database:', dbPath);
    });

    // Создаем таблицы
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_verified BOOLEAN DEFAULT FALSE
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err);
      });
      
      db.run(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          target_score INTEGER DEFAULT 80,
          deadline DATE,
          preferred_intensity TEXT DEFAULT 'medium',
          grade INTEGER DEFAULT 11,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating user_profiles table:', err);
      });
      
      db.run(`
        CREATE TABLE IF NOT EXISTS user_subjects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          subject_name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(user_id, subject_name)
        )
      `, (err) => {
        if (err) console.error('Error creating user_subjects table:', err);
      });
      
      db.run(`
        CREATE TABLE IF NOT EXISTS verification_codes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          code TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NOT NULL,
          used BOOLEAN DEFAULT FALSE
        )
      `, (err) => {
        if (err) console.error('Error creating verification_codes table:', err);
        else {
          console.log('All database tables created successfully');
          resolve(db);
        }
      });
    });

    db.close((err) => {
      if (err) console.error('Error closing database:', err);
    });
  });
};