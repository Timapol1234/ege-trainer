import { NextRequest, NextResponse } from 'next/server';
import { setUserPassword } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен быть не менее 6 символов' },
        { status: 400 }
      );
    }
    
    console.log(`Установка пароля для: ${email}`);
    
    const success = await setUserPassword(email, password);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Пароль создан успешно'
    });
    
  } catch (error) {
    console.error('Create password error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}