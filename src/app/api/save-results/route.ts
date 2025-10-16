import { NextRequest, NextResponse } from 'next/server';
import { saveTestResult } from '@/lib/services/testResultsService';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('📥 Получен запрос на сохранение результата теста:', data);
    
    const { userId, subject, score, totalQuestions, correctAnswers, timeSpent, testData } = data;
    
    // Валидация обязательных полей
    if (!userId || !subject || score === undefined || score === null) {
      console.log('❌ Отсутствуют обязательные поля:', { userId, subject, score });
      return NextResponse.json(
        { error: 'Обязательные поля: userId, subject, score' },
        { status: 400 }
      );
    }
    
    console.log(`💾 Сохранение результата теста для пользователя ${userId}`);
    
    // Преобразуем userId в число
    let numericUserId: number;
    
    if (typeof userId === 'number') {
      numericUserId = userId;
    } else if (typeof userId === 'string') {
      // Если userId в формате "user-12345", извлекаем числовой ID
      const match = userId.match(/user-(\d+)/);
      if (match) {
        numericUserId = parseInt(match[1]);
      } else {
        // Ищем пользователя по email
        const { getUserIdByEmail } = await import('@/lib/services/authService');
        const foundUserId = await getUserIdByEmail(userId);
        if (foundUserId) {
          numericUserId = foundUserId;
        } else {
          // Создаем временный ID
          numericUserId = Date.now();
          console.log('⚠️ Пользователь не найден, используем временный ID:', numericUserId);
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Некорректный формат userId' },
        { status: 400 }
      );
    }
    
    const resultId = await saveTestResult({
      userId: numericUserId,
      subject,
      score: Number(score),
      totalQuestions: Number(totalQuestions) || 0,
      correctAnswers: Number(correctAnswers) || 0,
      timeSpent: Number(timeSpent) || 0,
      testData: testData || {}
    });
    
    console.log(`✅ Результат теста сохранен в базу данных, ID: ${resultId}`);
    
    return NextResponse.json({ 
      success: true,
      resultId,
      message: 'Результат теста успешно сохранен'
    });
    
  } catch (error) {
    console.error('❌ Ошибка сохранения результата теста:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера при сохранении результата теста' },
      { status: 500 }
    );
  }
}