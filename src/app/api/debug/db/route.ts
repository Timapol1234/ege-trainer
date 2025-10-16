import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'lib/database/users.db');

export async function GET(request: NextRequest) {
  try {
    const db = new sqlite3.Database(dbPath);
    
    return new Promise((resolve) => {
      db.all(`SELECT * FROM verification_codes ORDER BY created_at DESC LIMIT 10`, (err, rows) => {
        if (err) {
          db.close();
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          return;
        }
        
        db.all(`SELECT * FROM users ORDER BY created_at DESC LIMIT 10`, (err, userRows) => {
          db.close();
          
          if (err) {
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            return;
          }
          
          resolve(NextResponse.json({
            verification_codes: rows,
            users: userRows,
            db_path: dbPath
          }));
        });
      });
    });
    
  } catch (error) {
    console.error('Debug DB error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}