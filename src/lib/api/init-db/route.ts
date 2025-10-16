import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/services/authService';

export async function GET(request: NextRequest) {
  try {
    await initDB();
    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}