import { NextRequest, NextResponse } from 'next/server';
import { getUserIdByEmail } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email обязателен' },
        { status: 400 }
      );
    }
    
    console.log(`🔍 Поиск ID пользователя для email: ${email}`);
    
    const userId = await getUserIdByEmail(email);
    
    if (userId) {
      return NextResponse.json({ 
        success: true,
        userId,
        message: 'Пользователь найден'
      });
    } else {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Get user ID error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}