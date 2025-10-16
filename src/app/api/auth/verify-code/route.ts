import { NextRequest, NextResponse } from 'next/server';
import { verifyCode, createUser, saveUserProfile } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email и код обязательны' },
        { status: 400 }
      );
    }
    
    console.log(`Проверка кода для: ${email}, код: ${code}`);
    
    // Проверяем код
    const isValid = await verifyCode(email, code);
    
    if (!isValid) {
      console.log(`Неверный код для: ${email}`);
      return NextResponse.json(
        { error: 'Неверный или просроченный код подтверждения' },
        { status: 400 }
      );
    }
    
    console.log(`Код верный для: ${email}, создаем пользователя...`);
    
    // Создаем пользователя (без пароля для email регистрации)
    const userId = await createUser(email);
    
    console.log(`Пользователь создан с ID: ${userId}`);
    
    return NextResponse.json({ 
      success: true,
      userId,
      message: 'Аккаунт создан успешно'
    });
    
  } catch (error) {
    console.error('Verify code error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Внутренняя ошибка сервера при подтверждении кода';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}