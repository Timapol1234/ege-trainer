import { NextRequest, NextResponse } from 'next/server';
import { saveVerificationCode } from '@/lib/services/authService';
import nodemailer from 'nodemailer';

// Конфигурация транспорта для отправки email
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error('EMAIL_USER и EMAIL_PASSWORD должны быть заданы в .env.local');
  }

  console.log('Creating transporter for email:', emailUser);

  // Для Mail.ru
  if (emailUser.includes('mail.ru')) {
    return nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true, // true для 465 порта
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  
  else if (emailUser.includes('yandex.ru') || emailUser.includes('ya.ru')) {
    return nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  else if (emailUser.includes('mail.ru')) {
    return nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    // Кастомный SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  else {
    throw new Error('Неизвестный почтовый сервис. Укажите SMTP настройки вручную.');
  }
};

async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    // Для Mail.ru используем только email без имени
    const fromEmail = process.env.EMAIL_USER; // Обязательно тот же что и в аутентификации
    const siteName = process.env.SITE_NAME || 'ЕГЭ Подготовка';
    
    const mailOptions = {
      from: fromEmail, // Просто email, без имени
      to: email,
      subject: 'Код подтверждения для регистрации в ЕГЭ-Тренер',
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Подтверждение email</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
                .header p { opacity: 0.9; font-size: 16px; }
                .content { padding: 40px 30px; background: #ffffff; }
                .greeting { font-size: 18px; margin-bottom: 20px; color: #2d3748; }
                .instruction { font-size: 16px; margin-bottom: 30px; color: #4a5568; line-height: 1.7; }
                .code-container { text-align: center; margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 8px; border: 2px dashed #cbd5e0; }
                .code { font-size: 42px; font-weight: 800; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; text-align: center; margin: 10px 0; }
                .warning { background: #fffaf0; border-left: 4px solid #ed8936; padding: 16px; margin: 25px 0; border-radius: 4px; }
                .warning strong { color: #c05621; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px; }
                @media (max-width: 600px) {
                  .container { border-radius: 8px; }
                  .header { padding: 30px 20px; }
                  .header h1 { font-size: 24px; }
                  .content { padding: 30px 20px; }
                  .code { font-size: 32px; letter-spacing: 6px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Подтверждение email</h1>
                    <p>ЕГЭ-Тренер - Ваш персональный план подготовки</p>
                </div>
                <div class="content">
                    <p class="greeting">Здравствуйте!</p>
                    <p class="instruction">
                        Для завершения регистрации введите этот код подтверждения на сайте:
                    </p>
                    <div class="code-container">
                        <div class="code">${code}</div>
                    </div>
                    <div class="warning">
                        <strong>⚠️ Важно:</strong> Код действителен 30 минут. Никому не сообщайте его.
                    </div>
                    <p class="instruction">
                        Если вы не регистрировались в ЕГЭ-Тренере, проигнорируйте это письмо.
                    </p>
                </div>
                <div class="footer">
                    <p>© 2024 ЕГЭ-Тренер. Все права защищены.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
ЕГЭ-Тренер - Подтверждение регистрации

Здравствуйте!

Ваш код подтверждения: ${code}

Введите этот код на сайте для завершения регистрации.

Код действителен в течение 30 минут.

Если вы не регистрировались, проигнорируйте это письмо.

С уважением,
Команда ЕГЭ-Тренер
      `.trim()
    };

    console.log(`📧 Отправка письма на: ${email}`);
    console.log(`🔑 Отправляем с: ${fromEmail}`);
    
    // Проверяем соединение
    await transporter.verify();
    console.log('✅ SMTP соединение установлено');
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Письмо отправлено:', {
      messageId: result.messageId,
      to: email
    });
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки письма:', error);
    
    let errorMessage = 'Не удалось отправить код подтверждения. ';
    
    if (error instanceof Error) {
      if (error.message.includes('sender address must match authenticated user')) {
        errorMessage += 'Ошибка Mail.ru: адрес отправителя должен совпадать с аутентифицированным пользователем. Проверьте EMAIL_FROM в .env.local';
      } else if (error.message.includes('Invalid login') || error.message.includes('Authentication failed')) {
        errorMessage += 'Ошибка аутентификации. Проверьте EMAIL_USER и EMAIL_PASSWORD в .env.local';
      } else if (error.message.includes('Connection timeout')) {
        errorMessage += 'Таймаут подключения. Проверьте интернет-соединение.';
      } else {
        errorMessage += error.message;
      }
    }
    
    throw new Error(errorMessage);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email обязателен для отправки кода' },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Неверный формат email адреса' },
        { status: 400 }
      );
    }
    
    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`Generating verification code for: ${email}, code: ${code}`);
    
    // Сохраняем код в базе
    await saveVerificationCode(email, code);
    
    // Отправляем код на email
    await sendVerificationEmail(email, code);
    
    return NextResponse.json({ 
      success: true,
      message: 'Код подтверждения отправлен на вашу электронную почту'
    });
    
  } catch (error) {
    console.error('Send verification error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Внутренняя ошибка сервера при отправке кода подтверждения';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}