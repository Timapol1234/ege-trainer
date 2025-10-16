import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import './globals.css';
import { initDB } from '@/lib/services/authService';

export const metadata: Metadata = {
  title: 'ЕГЭ-Тренер',
  description: 'Персональный репетитор для подготовки к ЕГЭ',
};

// Инициализация базы данных на сервере
async function initializeDatabase() {
  try {
    await initDB();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Вызываем инициализацию при загрузке layout
initializeDatabase();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}