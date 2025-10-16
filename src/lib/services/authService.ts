import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'lib/database');
const dbPath = path.join(dbDir, 'users.db');

// Р РЋР С•Р В·Р Т‘Р В°Р ВµР С� Р С—Р В°Р С—Р С”РЎС“ Р ВµРЎРѓР В»Р С‘ Р С•Р Р…Р В° Р Р…Р Вµ РЎРѓРЎС“РЎвЂ°Р ВµРЎРѓРЎвЂљР Р†РЎС“Р ВµРЎвЂљ
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Р В¤РЎС“Р Р…Р С”РЎвЂ Р С‘РЎРЏ Р Т‘Р В»РЎРЏ Р С—Р С•Р В»РЎС“РЎвЂЎР ВµР Р…Р С‘РЎРЏ РЎРѓР С•Р ВµР Т‘Р С‘Р Р…Р ВµР Р…Р С‘РЎРЏ РЎРѓ Р В±Р В°Р В·Р С•Р в„– Р Т‘Р В°Р Р…Р Р…РЎвЂ№РЎвЂ¦
const getDB = () => {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      throw err;
    }
  });
};

// Р пїЅР Р…Р С‘РЎвЂ Р С‘Р В°Р В»Р С‘Р В·Р В°РЎвЂ Р С‘РЎРЏ Р В±Р В°Р В·РЎвЂ№ Р Т‘Р В°Р Р…Р Р…РЎвЂ№РЎвЂ¦
export const initDB = async () => {
  const db = getDB();
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_verified BOOLEAN DEFAULT FALSE
        )
      `);
      
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
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS test_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          subject TEXT NOT NULL,
          score INTEGER NOT NULL,
          total_questions INTEGER NOT NULL,
          correct_answers INTEGER NOT NULL,
          time_spent INTEGER NOT NULL,
          test_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `), 
      
      db.run(`
        CREATE TABLE IF NOT EXISTS user_subjects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          subject_name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(user_id, subject_name)
        )
      `);
      
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
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve(true);
        }
        db.close();
      });
    });
  });
};

// Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° РЎРѓРЎС“РЎвЂ°Р ВµРЎРѓРЎвЂљР Р†Р С•Р Р†Р В°Р Р…Р С‘РЎРЏ Р С—Р С•Р В»РЎРЉР В·Р С•Р Р†Р В°РЎвЂљР ВµР В»РЎРЏ
export const checkUserExists = async (email: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.get(
      'SELECT id FROM users WHERE email = ?',
      [email],
      (err, row) => {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error checking user existence:', err);
          reject(err);
          return;
        }
        resolve(!!row);
      }
    );
  });
};
// РЈСЃС‚Р°РЅРѕРІРєР° РїР°СЂРѕР»СЏ РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
export const setUserPassword = async (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const passwordHash = bcrypt.hashSync(password, 10);
    
    db.run(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [passwordHash, email],
      function(err) {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error setting password:', err);
          reject(err);
          return;
        }
        
        // Р•СЃР»Рё affectedRows > 0, Р·РЅР°С‡РёС‚ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅР°Р№РґРµРЅ Рё РїР°СЂРѕР»СЊ РѕР±РЅРѕРІР»РµРЅ
        resolve(this.changes > 0);
      }
    );
  });
};
// Р РЋР С•Р В·Р Т‘Р В°Р Р…Р С‘Р Вµ Р Р…Р С•Р Р†Р С•Р С–Р С• Р С—Р С•Р В»РЎРЉР В·Р С•Р Р†Р В°РЎвЂљР ВµР В»РЎРЏ
// РЎРѕР·РґР°РЅРёРµ РЅРѕРІРѕРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ (Р±РµР· РїР°СЂРѕР»СЏ)
export const createUser = async (email: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.run(
      'INSERT INTO users (email) VALUES (?)',
      [email],
      function(err) {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error creating user:', err);
          reject(err);
          return;
        }
        
        resolve(this.lastID);
      }
    );
  });
};

// Получение ID пользователя по email
export const getUserIdByEmail = async (email: string): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.get(
      'SELECT id FROM users WHERE email = ?',
      [email],
      (err, row: any) => {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error getting user ID:', err);
          reject(err);
          return;
        }
        
        resolve(row ? row.id : null);
      }
    );
  });
};
// Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С—Р В°РЎР‚Р С•Р В»РЎРЏ
export const verifyPassword = async (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.get(
      'SELECT password_hash FROM users WHERE email = ?',
      [email],
      (err, row: any) => {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error verifying password:', err);
          reject(err);
          return;
        }
        
        if (!row || !row.password_hash) {
          resolve(false);
          return;
        }
        
        resolve(bcrypt.compareSync(password, row.password_hash));
      }
    );
  });
};

// Р РЋР С•РЎвЂ¦РЎР‚Р В°Р Р…Р ВµР Р…Р С‘Р Вµ Р С—РЎР‚Р С•РЎвЂћР С‘Р В»РЎРЏ Р С—Р С•Р В»РЎРЉР В·Р С•Р Р†Р В°РЎвЂљР ВµР В»РЎРЏ
export const saveUserProfile = async (userId: number, profile: any) => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.serialize(() => {
      // Р РЋР С•РЎвЂ¦РЎР‚Р В°Р Р…РЎРЏР ВµР С� Р С•РЎРѓР Р…Р С•Р Р†Р Р…Р С•Р в„– Р С—РЎР‚Р С•РЎвЂћР С‘Р В»РЎРЉ
      db.run(
        `INSERT INTO user_profiles (user_id, target_score, deadline, preferred_intensity, grade) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, profile.targetScore, profile.deadline, profile.preferredIntensity, profile.grade],
        function(err) {
          if (err) {
            console.error('Error saving user profile:', err);
            reject(err);
            return;
          }
        }
      );
      
      // Р РЋР С•РЎвЂ¦РЎР‚Р В°Р Р…РЎРЏР ВµР С� Р С—РЎР‚Р ВµР Т‘Р С�Р ВµРЎвЂљРЎвЂ№
      const stmt = db.prepare(
        'INSERT INTO user_subjects (user_id, subject_name) VALUES (?, ?)'
      );
      
      profile.subjects.forEach((subject: string) => {
        stmt.run([userId, subject], (err) => {
          if (err) console.error('Error saving subject:', err);
        });
      });
      
      stmt.finalize();
      
      db.close((closeErr) => {
        if (closeErr) console.error('Error closing database:', closeErr);
      });
      
      resolve(true);
    });
  });
};

// Р вЂњР ВµР Р…Р ВµРЎР‚Р В°РЎвЂ Р С‘РЎРЏ Р С‘ РЎРѓР С•РЎвЂ¦РЎР‚Р В°Р Р…Р ВµР Р…Р С‘Р Вµ Р С”Р С•Р Т‘Р В° Р С—Р С•Р Т‘РЎвЂљР Р†Р ВµРЎР‚Р В¶Р Т‘Р ВµР Р…Р С‘РЎРЏ
export const saveVerificationCode = async (email: string, code: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 Р С�Р С‘Р Р…РЎС“РЎвЂљ
    
    db.run(
      'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
      [email, code, expiresAt.toISOString()],
      (err) => {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error saving verification code:', err);
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

// Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С”Р С•Р Т‘Р В° Р С—Р С•Р Т‘РЎвЂљР Р†Р ВµРЎР‚Р В¶Р Т‘Р ВµР Р…Р С‘РЎРЏ
export const verifyCode = async (email: string, code: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.get(
      `SELECT id FROM verification_codes 
       WHERE email = ? AND code = ? AND used = FALSE AND expires_at > datetime('now')`,
      [email, code],
      (err, row) => {
        if (err) {
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database:', closeErr);
          });
          console.error('Error verifying code:', err);
          reject(err);
          return;
        }
        
        if (row) {
          // Р СџР С•Р С�Р ВµРЎвЂЎР В°Р ВµР С� Р С”Р С•Р Т‘ Р С”Р В°Р С” Р С‘РЎРѓР С—Р С•Р В»РЎРЉР В·Р С•Р Р†Р В°Р Р…Р Р…РЎвЂ№Р в„–
          db.run(
            'UPDATE verification_codes SET used = TRUE WHERE id = ?',
            [(row as any).id],
            (updateErr) => {
              db.close((closeErr) => {
                if (closeErr) console.error('Error closing database:', closeErr);
              });
              
              if (updateErr) {
                console.error('Error updating verification code:', updateErr);
                reject(updateErr);
                return;
              }
              resolve(true);
            }
          );
        } else {
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database:', closeErr);
          });
          resolve(false);
        }
      }
    );
  });
};