import { NextRequest, NextResponse } from 'next/server';
import { checkUserExists } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const userExists = await checkUserExists(email);
    
    return NextResponse.json({ 
      exists: userExists,
      message: userExists ? 'User exists' : 'User not found'
    });
    
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}