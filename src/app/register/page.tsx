'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { User, Intensity } from '@/types';

const subjectsList = ['Математика', 'Физика', 'Химия', 'Биология'];

export default function Register() {
  const router = useRouter();
  const { setUser } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Новое состояние для переключения между входом и регистрацией
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    profile: {
      targetScore: 80,
      deadline: '2024-06-01',
      preferredIntensity: 'medium' as Intensity,
      subjects: [] as string[],
      grade: 11
    }
  });

  // Переключение между регистрацией и входом
  const toggleLogin = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setMessage('');
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
      verificationCode: ''
    }));
  };

  // Проверка существования пользователя (для регистрации)
  const checkUser = async () => {
    if (!formData.email) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await response.json();
      setUserExists(data.exists);
      
      if (data.exists) {
        setMessage('Пользователь с таким email существует. Введите пароль.');
        setStep(1.5); // Шаг для ввода пароля (вход)
      } else {
        setMessage('Отправляем код подтверждения на вашу почту...');
        await sendVerificationCode();
        setStep(1.5); // Шаг для ввода кода подтверждения
      }
    } catch (error) {
      setMessage('Ошибка при проверке пользователя');
    } finally {
      setLoading(false);
    }
  };

  // Вход пользователя (для формы входа)
  const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.email || !formData.password) {
    setMessage('Введите email и пароль');
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setMessage('Вход выполнен успешно!');
      
      // Создаем объект пользователя
      const user: User = {
        id: data.userId || Math.random().toString(36).substr(2, 9),
        email: formData.email,
        profile: formData.profile,
        createdAt: new Date()
      };
      
      setUser(user);
      
      // Переходим в личный кабинет
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } else {
      setMessage(data.error || 'Неверный email или пароль');
    }
  } catch (error) {
    setMessage('Ошибка при входе');
  } finally {
    setLoading(false);
  }
};

  // Отправка кода подтверждения
  const sendVerificationCode = async () => {
    try {
      setLoading(true);
      setMessage('Отправляем код подтверждения...');
      
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Код подтверждения отправлен на вашу почту! Проверьте папку "Спам", если не видите письмо.');
        setVerificationSent(true);
      } else {
        setMessage(data.error || 'Ошибка при отправке кода');
      }
    } catch (error) {
      setMessage('Ошибка соединения. Проверьте интернет и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  // Вход существующего пользователя (при регистрации)
  const handleLogin = async () => {
  if (!formData.password) return;
  
  setLoading(true);
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setMessage('Вход выполнен успешно!');
      
      // Создаем объект пользователя
      const user: User = {
        id: data.userId || Math.random().toString(36).substr(2, 9),
        email: formData.email,
        profile: formData.profile,
        createdAt: new Date()
      };
      
      setUser(user);
      
      // Переходим в личный кабинет
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } else {
      setMessage(data.error || 'Неверный пароль');
    }
  } catch (error) {
    setMessage('Ошибка при входе');
  } finally {
    setLoading(false);
  }
};

  // Подтверждение кода и переход к созданию пароля
  const handleVerification = async () => {
    if (!formData.verificationCode) {
      setMessage('Введите код подтверждения');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Email подтвержден! Теперь создайте пароль.');
        setStep(1.7); // Шаг для создания пароля
      } else {
        setMessage(data.error || 'Неверный код подтверждения');
      }
    } catch (error) {
      setMessage('Ошибка при подтверждении кода');
    } finally {
      setLoading(false);
    }
  };

  // Создание пароля для нового пользователя
  const handleCreatePassword = async () => {
  if (!formData.password || !formData.confirmPassword) {
    setMessage('Введите пароль и подтверждение');
    return;
  }
  
  if (formData.password !== formData.confirmPassword) {
    setMessage('Пароли не совпадают');
    return;
  }
  
  if (formData.password.length < 6) {
    setMessage('Пароль должен быть не менее 6 символов');
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch('/api/auth/create-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setMessage('Пароль создан успешно!');
      
      // Создаем объект пользователя
      const user: User = {
        id: data.userId || Math.random().toString(36).substr(2, 9),
        email: formData.email,
        profile: formData.profile,
        createdAt: new Date()
      };
      
      setUser(user);
      
      // Переходим в личный кабинет
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } else {
      setMessage(data.error || 'Ошибка при создании пароля');
    }
  } catch (error) {
    setMessage('Ошибка при создании пароля');
  } finally {
    setLoading(false);
  }
};

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        subjects: prev.profile.subjects.includes(subject)
          ? prev.profile.subjects.filter(s => s !== subject)
          : [...prev.profile.subjects, subject]
      }
    }));
  };

  // Финальное сохранение профиля и переход к тестированию
  const handleFinalSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      profile: formData.profile,
      createdAt: new Date()
    };
    
    setUser(user);
    console.log('User registered:', user);
    
    // Переходим в личный кабинет вместо тестирования
    router.push('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    setMessage('Ошибка при сохранении профиля');
  }
};

  const registrationSteps = [
    { number: 1, title: 'Email' },
    { number: 2, title: 'Пароль' },
    { number: 3, title: 'Предметы' },
    { number: 4, title: 'Настройки' }
  ];

  const loginSteps = [
    { number: 1, title: 'Вход' },
    { number: 2, title: 'Предметы' },
    { number: 3, title: 'Настройки' }
  ];

  const currentSteps = isLogin ? loginSteps : registrationSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {isLogin 
              ? 'Войдите в свой аккаунт для продолжения' 
              : 'Составьте свой персональный план подготовки к ЕГЭ'
            }
          </p>
        </div>

        {/* Progress Steps */}
        {!isLogin && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {currentSteps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step >= stepItem.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  } font-semibold text-sm`}>
                    {stepItem.number}
                  </div>
                  {index < currentSteps.length - 1 && (
                    <div className={`w-8 h-0.5 ${
                      step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={isLogin ? handleLoginSubmit : handleFinalSubmit} className="space-y-6">
            
            {/* Форма входа */}
            {isLogin && step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Вход в аккаунт
                  </h2>
                  <p className="text-gray-500">
                    Введите ваши учетные данные
                  </p>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm ${
                    message.includes('Ошибка') || message.includes('Неверный')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {message}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Электронная почта
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Введите ваш пароль"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.email || !formData.password}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Входим...' : 'Войти'}
                </button>
              </div>
            )}

            {/* Step 1: Email Input (регистрация) */}
            {!isLogin && step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Основная информация
                  </h2>
                  <p className="text-gray-500">
                    Введите ваш email для начала работы
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Электронная почта
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={checkUser}
                  disabled={loading || !formData.email}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Проверяем...' : 'Продолжить'}
                </button>
              </div>
            )}

            {/* Step 1.5: Authentication - код подтверждения или вход (регистрация) */}
            {!isLogin && step === 1.5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {userExists ? 'Вход в аккаунт' : 'Подтверждение email'}
                  </h2>
                  <p className="text-gray-500">
                    {userExists 
                      ? 'Введите ваш пароль' 
                      : 'Введите код подтверждения отправленный на вашу почту'
                    }
                  </p>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm ${
                    message.includes('Ошибка') || message.includes('Неверный')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {message}
                  </div>
                )}
                
                {userExists ? (
                  // Поле для пароля (вход)
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Введите ваш пароль"
                      required
                    />
                  </div>
                ) : (
                  // Поле для кода подтверждения
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Код подтверждения
                      </label>
                      <input
                        type="text"
                        value={formData.verificationCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, verificationCode: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg font-mono"
                        placeholder="Введите 6-значный код"
                        maxLength={6}
                        required
                      />
                    </div>
                    
                    {!verificationSent && (
                      <button
                        type="button"
                        onClick={sendVerificationCode}
                        className="w-full text-sm text-blue-600 hover:text-blue-700 py-2"
                      >
                        Отправить код повторно
                      </button>
                    )}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setMessage('');
                      setVerificationSent(false);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={userExists ? handleLogin : handleVerification}
                    disabled={loading || (userExists ? !formData.password : !formData.verificationCode)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Проверяем...' : 'Продолжить'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1.7: Создание пароля для нового пользователя (регистрация) */}
            {!isLogin && step === 1.7 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Создание пароля
                  </h2>
                  <p className="text-gray-500">
                    Придумайте надежный пароль для вашего аккаунта
                  </p>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm ${
                    message.includes('Ошибка') || message.includes('Неверный')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {message}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Не менее 6 символов"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Подтверждение пароля
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Повторите пароль"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1.5);
                      setMessage('');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePassword}
                    disabled={loading || !formData.password || !formData.confirmPassword}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Создаем...' : 'Создать пароль'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Subjects (общий для входа и регистрации) */}
            {(step === 2) && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Выбор предметов
                  </h2>
                  <p className="text-gray-500">
                    Выберите предметы для подготовки
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {subjectsList.map(subject => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleSubjectToggle(subject)}
                      className={`p-4 border-2 rounded-xl text-sm font-semibold transition-all ${
                        formData.profile.subjects.includes(subject)
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => isLogin ? setStep(1) : (userExists ? setStep(1.5) : setStep(1.7))}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={formData.profile.subjects.length === 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Settings (общий для входа и регистрации) */}
            {(step === 3) && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Настройки подготовки
                  </h2>
                  <p className="text-gray-500">
                    Настройте параметры вашего обучения
                  </p>
                </div>
                
                {/* Target Score */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-700">
                      Целевой балл
                    </label>
                    <span className="text-2xl font-bold text-blue-600">
                      {formData.profile.targetScore}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    step="5"
                    value={formData.profile.targetScore}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      profile: { ...prev.profile, targetScore: Number(e.target.value) }
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>60</span>
                    <span>70</span>
                    <span>80</span>
                    <span>90</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Intensity */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Интенсивность подготовки
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as Intensity[]).map(intensity => (
                      <button
                        key={intensity}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, preferredIntensity: intensity }
                        }))}
                        className={`p-4 border-2 rounded-xl text-sm font-semibold transition-all ${
                          formData.profile.preferredIntensity === intensity
                            ? intensity === 'low' 
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : intensity === 'medium'
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'bg-red-50 border-red-500 text-red-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {intensity === 'low' && 'Низкая'}
                        {intensity === 'medium' && 'Средняя'}
                        {intensity === 'high' && 'Высокая'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Начать тестирование
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Switch between Login and Register */}
        <div className="text-center text-sm text-gray-500">
          <p>
            {isLogin ? 'Еще нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              onClick={toggleLogin}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}