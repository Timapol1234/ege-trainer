'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { User } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
    if (!user) {
      router.push('/register');
      return;
    }
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Личный кабинет
          </h1>
          <p className="text-gray-600 mt-2">
            Добро пожаловать, {user?.email}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Прогресс подготовки
            </h3>
            <p className="text-3xl font-bold text-blue-600">65%</p>
            <p className="text-gray-600 text-sm mt-2">Общий прогресс по всем предметам</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Пройдено тестов
            </h3>
            <p className="text-3xl font-bold text-green-600">12</p>
            <p className="text-gray-600 text-sm mt-2">За последний месяц</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Средний балл
            </h3>
            <p className="text-3xl font-bold text-purple-600">78</p>
            <p className="text-gray-600 text-sm mt-2">По результатам тестирования</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => router.push('/assessment')}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📝 Пройти тест
            </h3>
            <p className="text-gray-600 text-sm">
              Проверьте свои знания
            </p>
          </button>

          <button
            onClick={() => router.push('/learning/plan')}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📚 План обучения
            </h3>
            <p className="text-gray-600 text-sm">
              Персональный план подготовки
            </p>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              👤 Профиль
            </h3>
            <p className="text-gray-600 text-sm">
              Настройки аккаунта
            </p>
          </button>

          <button
            onClick={() => {
              // Логаут - очищаем контекст и переходим на главную
              localStorage.removeItem('user');
              router.push('/');
            }}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow border-l-4 border-red-500"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🚪 Выйти
            </h3>
            <p className="text-gray-600 text-sm">
              Завершить сеанс
            </p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Последняя активность
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Тест по математике</p>
                <p className="text-sm text-gray-600">Завершено 2 часа назад</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                85 баллов
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Тест по физике</p>
                <p className="text-sm text-gray-600">Завершено вчера</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                72 балла
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Изучение темы "Производные"</p>
                <p className="text-sm text-gray-600">Завершено 2 дня назад</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Завершено
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}