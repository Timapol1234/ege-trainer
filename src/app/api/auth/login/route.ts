import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, getUserIdByEmail } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const isValid = await verifyPassword(email, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }
    
    // Получаем ID пользователя
    const userId = await getUserIdByEmail(email);
    
    return NextResponse.json({ 
      success: true,
      userId,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}