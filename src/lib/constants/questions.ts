// src/lib/constants/questions.ts
import { AssessmentQuestion } from '@/types';

export const MATH_QUESTIONS: AssessmentQuestion[] = [
  // Алгебра и начала анализа (20 вопросов)
  {
    id: '1',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( 2^{x-3} = 16 \\)',
    options: ['\\( x = 7 \\)', '\\( x = 5 \\)', '\\( x = 6 \\)', '\\( x = 4 \\)'],
    correctAnswer: '\\( x = 7 \\)',
    explanation: '\\( 2^{x-3} = 16 \\Rightarrow 2^{x-3} = 2^4 \\Rightarrow x - 3 = 4 \\Rightarrow x = 7 \\)',
    theme: 'Алгебра',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '2',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( \\log_2(x + 5) = 4 \\)',
    options: ['\\( x = 11 \\)', '\\( x = 3 \\)', '\\( x = 13 \\)', '\\( x = -1 \\)'],
    correctAnswer: '\\( x = 11 \\)',
    explanation: '\\( \\log_2(x + 5) = 4 \\Rightarrow x + 5 = 2^4 \\Rightarrow x + 5 = 16 \\Rightarrow x = 11 \\)',
    theme: 'Алгебра',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '3',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( 3^{2x-1} = 27 \\)',
    options: ['\\( x = 2 \\)', '\\( x = 1 \\)', '\\( x = 1.5 \\)', '\\( x = 3 \\)'],
    correctAnswer: '\\( x = 2 \\)',
    explanation: '\\( 3^{2x-1} = 27 \\Rightarrow 3^{2x-1} = 3^3 \\Rightarrow 2x - 1 = 3 \\Rightarrow 2x = 4 \\Rightarrow x = 2 \\)',
    theme: 'Алгебра',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '4',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( \\sqrt{3x + 4} = 5 \\)',
    options: ['\\( x = 7 \\)', '\\( x = 3 \\)', '\\( x = 5 \\)', '\\( x = 9 \\)'],
    correctAnswer: '\\( x = 7 \\)',
    explanation: '\\( \\sqrt{3x + 4} = 5 \\Rightarrow 3x + 4 = 25 \\Rightarrow 3x = 21 \\Rightarrow x = 7 \\)',
    theme: 'Алгебра',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '5',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( \\frac{x - 3}{x + 2} = 2 \\)',
    options: ['\\( x = -7 \\)', '\\( x = 1 \\)', '\\( x = 7 \\)', '\\( x = -1 \\)'],
    correctAnswer: '\\( x = -7 \\)',
    explanation: '\\( \\frac{x - 3}{x + 2} = 2 \\Rightarrow x - 3 = 2(x + 2) \\Rightarrow x - 3 = 2x + 4 \\Rightarrow -x = 7 \\Rightarrow x = -7 \\)',
    theme: 'Алгебра',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '6',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( 2\\cos x = 1 \\) на отрезке \\( [0; 2\\pi] \\)',
    options: ['\\( x = \\frac{\\pi}{3}, \\frac{5\\pi}{3} \\)', '\\( x = \\frac{\\pi}{6}, \\frac{11\\pi}{6} \\)', '\\( x = \\frac{\\pi}{4}, \\frac{7\\pi}{4} \\)', '\\( x = \\frac{\\pi}{2}, \\frac{3\\pi}{2} \\)'],
    correctAnswer: '\\( x = \\frac{\\pi}{3}, \\frac{5\\pi}{3} \\)',
    explanation: '\\( 2\\cos x = 1 \\Rightarrow \\cos x = \\frac{1}{2} \\Rightarrow x = \\frac{\\pi}{3} + 2\\pi n, x = \\frac{5\\pi}{3} + 2\\pi n \\). На \\( [0;2\\pi]: \\frac{\\pi}{3}, \\frac{5\\pi}{3} \\)',
    theme: 'Тригонометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '7',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( \\sin x = -\\frac{\\sqrt{3}}{2} \\) на отрезке \\( [-\\pi; \\pi] \\)',
    options: ['\\( x = -\\frac{\\pi}{3}, -\\frac{2\\pi}{3} \\)', '\\( x = -\\frac{\\pi}{6}, -\\frac{5\\pi}{6} \\)', '\\( x = \\frac{\\pi}{3}, \\frac{2\\pi}{3} \\)', '\\( x = \\frac{\\pi}{6}, \\frac{5\\pi}{6} \\)'],
    correctAnswer: '\\( x = -\\frac{\\pi}{3}, -\\frac{2\\pi}{3} \\)',
    explanation: '\\( \\sin x = -\\frac{\\sqrt{3}}{2} \\Rightarrow x = -\\frac{\\pi}{3} + 2\\pi n, x = -\\frac{2\\pi}{3} + 2\\pi n \\). На \\( [-\\pi;\\pi]: -\\frac{\\pi}{3}, -\\frac{2\\pi}{3} \\)',
    theme: 'Тригонометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '8',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( x^2 - 5x + 6 = 0 \\)',
    options: ['\\( x = 2; x = 3 \\)', '\\( x = 1; x = 6 \\)', '\\( x = -2; x = -3 \\)', '\\( x = -1; x = 6 \\)'],
    correctAnswer: '\\( x = 2; x = 3 \\)',
    explanation: '\\( x^2 - 5x + 6 = (x - 2)(x - 3) = 0 \\Rightarrow x = 2 \\) или \\( x = 3 \\)',
    theme: 'Алгебра',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '9',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( 2x^2 + 3x - 5 = 0 \\)',
    options: ['\\( x = 1; x = -2.5 \\)', '\\( x = -1; x = 2.5 \\)', '\\( x = 2; x = -1.5 \\)', '\\( x = -2; x = 1.5 \\)'],
    correctAnswer: '\\( x = 1; x = -2.5 \\)',
    explanation: '\\( D = 9 + 40 = 49, x = \\frac{-3 \\pm 7}{4} \\Rightarrow x_1 = 1, x_2 = -2.5 \\)',
    theme: 'Алгебра',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '10',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\log_2 16 + \\log_3 27 \\)',
    options: ['7', '5', '6', '8'],
    correctAnswer: '7',
    explanation: '\\( \\log_2 16 = 4 \\) (\\( 2^4 = 16 \\)), \\( \\log_3 27 = 3 \\) (\\( 3^3 = 27 \\)), сумма: \\( 4 + 3 = 7 \\)',
    theme: 'Алгебра',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '11',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( 8^{\\frac{2}{3}} \\times 4^{\\frac{1}{2}} \\)',
    options: ['8', '6', '10', '12'],
    correctAnswer: '8',
    explanation: '\\( 8^{\\frac{2}{3}} = (2^3)^{\\frac{2}{3}} = 2^2 = 4 \\), \\( 4^{\\frac{1}{2}} = \\sqrt{4} = 2 \\), произведение: \\( 4 \\times 2 = 8 \\)',
    theme: 'Алгебра',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '12',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\frac{\\sqrt{75} - \\sqrt{48}}{\\sqrt{3}} \\)',
    options: ['1', '2', '3', '4'],
    correctAnswer: '1',
    explanation: '\\( \\frac{\\sqrt{75} - \\sqrt{48}}{\\sqrt{3}} = \\frac{5\\sqrt{3} - 4\\sqrt{3}}{\\sqrt{3}} = \\frac{\\sqrt{3}}{\\sqrt{3}} = 1 \\)',
    theme: 'Алгебра',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '13',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\sin\\frac{\\pi}{6} + \\cos\\frac{\\pi}{3} \\)',
    options: ['1', '0.5', '1.5', '0'],
    correctAnswer: '1',
    explanation: '\\( \\sin\\frac{\\pi}{6} = \\frac{1}{2} \\), \\( \\cos\\frac{\\pi}{3} = \\frac{1}{2} \\), сумма: \\( \\frac{1}{2} + \\frac{1}{2} = 1 \\)',
    theme: 'Тригонометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '14',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\frac{2^{-3} \\times 8^2}{16^{-1}} \\)',
    options: ['32', '16', '64', '8'],
    correctAnswer: '32',
    explanation: '\\( 2^{-3} = \\frac{1}{8} \\), \\( 8^2 = 64 \\), \\( 16^{-1} = \\frac{1}{16} \\Rightarrow \\frac{\\frac{1}{8} \\times 64}{\\frac{1}{16}} = 8 \\times 16 = 128 \\)',
    theme: 'Алгебра',
    difficulty: 'hard',
    points: 3
  },
  {
    id: '15',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\log_5 125 - \\log_5 25 \\)',
    options: ['1', '2', '0', '3'],
    correctAnswer: '1',
    explanation: '\\( \\log_5 125 = 3 \\), \\( \\log_5 25 = 2 \\), разность: \\( 3 - 2 = 1 \\)',
    theme: 'Алгебра',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '16',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\frac{\\sqrt{12} \\times \\sqrt{27}}{\\sqrt{6}} \\)',
    options: ['9', '6', '\\( 3\\sqrt{2} \\)', '\\( 2\\sqrt{3} \\)'],
    correctAnswer: '9',
    explanation: '\\( \\frac{\\sqrt{12} \\times \\sqrt{27}}{\\sqrt{6}} = \\frac{\\sqrt{324}}{\\sqrt{6}} = \\frac{18}{\\sqrt{6}} = 3\\sqrt{6} \\)',
    theme: 'Алгебра',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '17',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\tan\\frac{\\pi}{4} + \\cot\\frac{\\pi}{4} \\)',
    options: ['2', '1', '0', '\\( \\sqrt{2} \\)'],
    correctAnswer: '2',
    explanation: '\\( \\tan\\frac{\\pi}{4} = 1 \\), \\( \\cot\\frac{\\pi}{4} = 1 \\), сумма: \\( 1 + 1 = 2 \\)',
    theme: 'Тригонометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '18',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( 3^{\\log_3 7} + 5^{\\log_5 2} \\)',
    options: ['9', '7', '5', '8'],
    correctAnswer: '9',
    explanation: '\\( 3^{\\log_3 7} = 7 \\), \\( 5^{\\log_5 2} = 2 \\), сумма: \\( 7 + 2 = 9 \\)',
    theme: 'Алгебра',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '19',
    type: 'multiple-choice',
    question: 'Найдите значение выражения: \\( \\frac{2\\sin 30^\\circ \\times \\cos 30^\\circ}{\\sin 60^\\circ} \\)',
    options: ['1', '\\( \\sqrt{3} \\)', '0.5', '2'],
    correctAnswer: '1',
    explanation: '\\( \\sin 30^\\circ = \\frac{1}{2} \\), \\( \\cos 30^\\circ = \\frac{\\sqrt{3}}{2} \\), \\( \\sin 60^\\circ = \\frac{\\sqrt{3}}{2} \\Rightarrow \\frac{2 \\times \\frac{1}{2} \\times \\frac{\\sqrt{3}}{2}}{\\frac{\\sqrt{3}}{2}} = 1 \\)',
    theme: 'Тригонометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '20',
    type: 'multiple-choice',
    question: 'Решите неравенство: \\( x^2 - 4x + 3 < 0 \\)',
    options: ['\\( 1 < x < 3 \\)', '\\( x < 1 \\) или \\( x > 3 \\)', '\\( x < -3 \\) или \\( x > -1 \\)', '\\( -3 < x < -1 \\)'],
    correctAnswer: '\\( 1 < x < 3 \\)',
    explanation: '\\( x^2 - 4x + 3 = (x-1)(x-3) < 0 \\Rightarrow 1 < x < 3 \\)',
    theme: 'Алгебра',
    difficulty: 'hard',
    points: 3
  },

  // Геометрия (15 вопросов)
  {
    id: '21',
    type: 'multiple-choice',
    question: 'В прямоугольном треугольнике катеты равны 3 и 4. Найдите гипотенузу.',
    options: ['5', '6', '7', '8'],
    correctAnswer: '5',
    explanation: 'По теореме Пифагора: \\( c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5 \\)',
    theme: 'Геометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '22',
    type: 'multiple-choice',
    question: 'Чему равна площадь круга с радиусом 5?',
    options: ['\\( 25\\pi \\)', '\\( 10\\pi \\)', '\\( 50\\pi \\)', '\\( 100\\pi \\)'],
    correctAnswer: '\\( 25\\pi \\)',
    explanation: '\\( S = \\pi r^2 = \\pi \\times 5^2 = 25\\pi \\)',
    theme: 'Геометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '23',
    type: 'multiple-choice',
    question: 'В треугольнике ABC угол \\( A = 40^\\circ \\), угол \\( B = 60^\\circ \\). Найдите угол C.',
    options: ['\\( 80^\\circ \\)', '\\( 90^\\circ \\)', '\\( 100^\\circ \\)', '\\( 70^\\circ \\)'],
    correctAnswer: '\\( 80^\\circ \\)',
    explanation: 'Сумма углов треугольника \\( 180^\\circ \\): \\( \\angle C = 180^\\circ - 40^\\circ - 60^\\circ = 80^\\circ \\)',
    theme: 'Геометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '24',
    type: 'multiple-choice',
    question: 'Найдите площадь прямоугольника со сторонами 8 и 12.',
    options: ['96', '48', '20', '40'],
    correctAnswer: '96',
    explanation: '\\( S = a \\times b = 8 \\times 12 = 96 \\)',
    theme: 'Геометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '25',
    type: 'multiple-choice',
    question: 'В равнобедренном треугольнике основание равно 10, а боковая сторона 13. Найдите высоту.',
    options: ['12', '11', '10', '9'],
    correctAnswer: '12',
    explanation: 'Высота делит основание пополам: \\( h = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12 \\)',
    theme: 'Геометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '26',
    type: 'multiple-choice',
    question: 'В треугольнике ABC угол \\( A = 45^\\circ \\), угол \\( B = 60^\\circ \\), сторона \\( BC = 6 \\). Найдите сторону AC.',
    options: ['\\( 3\\sqrt{6} \\)', '\\( 4\\sqrt{3} \\)', '\\( 2\\sqrt{6} \\)', '\\( 3\\sqrt{2} \\)'],
    correctAnswer: '\\( 3\\sqrt{6} \\)',
    explanation: 'По теореме синусов: \\( \\frac{AC}{\\sin B} = \\frac{BC}{\\sin A} \\Rightarrow AC = \\frac{6 \\times \\sin 60^\\circ}{\\sin 45^\\circ} = \\frac{6 \\times \\frac{\\sqrt{3}}{2}}{\\frac{\\sqrt{2}}{2}} = 3\\sqrt{6} \\)',
    theme: 'Геометрия',
    difficulty: 'hard',
    points: 3
  },
  {
    id: '27',
    type: 'multiple-choice',
    question: 'В параллелограмме сторона \\( AB = 8 \\), \\( AD = 6 \\), угол \\( A = 60^\\circ \\). Найдите площадь параллелограмма.',
    options: ['\\( 24\\sqrt{3} \\)', '48', '24', '36'],
    correctAnswer: '\\( 24\\sqrt{3} \\)',
    explanation: '\\( S = a \\cdot b \\cdot \\sin\\alpha = 8 \\cdot 6 \\cdot \\sin 60^\\circ = 48 \\cdot \\frac{\\sqrt{3}}{2} = 24\\sqrt{3} \\)',
    theme: 'Геометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '28',
    type: 'multiple-choice',
    question: 'В ромбе сторона равна 10, одна из диагоналей равна 12. Найдите вторую диагональ.',
    options: ['16', '14', '12', '18'],
    correctAnswer: '16',
    explanation: 'Диагонали ромба перпендикулярны: \\( d_2 = 2\\sqrt{10^2 - 6^2} = 2\\sqrt{100 - 36} = 2\\sqrt{64} = 16 \\)',
    theme: 'Геометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '29',
    type: 'multiple-choice',
    question: 'В окружности радиуса 13 проведена хорда длиной 24. Найдите расстояние от центра окружности до хорды.',
    options: ['5', '6', '7', '8'],
    correctAnswer: '5',
    explanation: 'Расстояние \\( = \\sqrt{R^2 - (\\frac{l}{2})^2} = \\sqrt{169 - 144} = \\sqrt{25} = 5 \\)',
    theme: 'Геометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '30',
    type: 'multiple-choice',
    question: 'В прямоугольном параллелепипеде измерения равны 3, 4, 5. Найдите длину диагонали.',
    options: ['\\( 5\\sqrt{2} \\)', '\\( 6\\sqrt{2} \\)', '7', '\\( 5\\sqrt{3} \\)'],
    correctAnswer: '\\( 5\\sqrt{2} \\)',
    explanation: '\\( d = \\sqrt{3^2 + 4^2 + 5^2} = \\sqrt{9 + 16 + 25} = \\sqrt{50} = 5\\sqrt{2} \\)',
    theme: 'Геометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '31',
    type: 'multiple-choice',
    question: 'В конусе радиус основания равен 6, образующая равна 10. Найдите высоту конуса.',
    options: ['8', '6', '9', '7'],
    correctAnswer: '8',
    explanation: '\\( h = \\sqrt{l^2 - r^2} = \\sqrt{100 - 36} = \\sqrt{64} = 8 \\)',
    theme: 'Геометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '32',
    type: 'multiple-choice',
    question: 'В цилиндре радиус основания равен 4, высота равна 7. Найдите площадь боковой поверхности.',
    options: ['\\( 56\\pi \\)', '\\( 48\\pi \\)', '\\( 64\\pi \\)', '\\( 32\\pi \\)'],
    correctAnswer: '\\( 56\\pi \\)',
    explanation: '\\( S_{бок} = 2\\pi rh = 2\\pi \\times 4 \\times 7 = 56\\pi \\)',
    theme: 'Геометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '33',
    type: 'multiple-choice',
    question: 'В треугольнике ABC проведена медиана AM. \\( AB = 8 \\), \\( AC = 6 \\), \\( BC = 7 \\). Найдите длину медианы AM.',
    options: ['\\( \\sqrt{23} \\)', '5', '\\( \\sqrt{21} \\)', '4.5'],
    correctAnswer: '\\( \\sqrt{23} \\)',
    explanation: 'Формула медианы: \\( m_a = \\frac{1}{2}\\sqrt{2b^2 + 2c^2 - a^2} = \\frac{1}{2}\\sqrt{2 \\times 36 + 2 \\times 64 - 49} = \\frac{1}{2}\\sqrt{72 + 128 - 49} = \\frac{1}{2}\\sqrt{151} \\)',
    theme: 'Геометрия',
    difficulty: 'hard',
    points: 3
  },
  {
    id: '34',
    type: 'multiple-choice',
    question: 'В трапеции ABCD основания \\( AD = 12 \\), \\( BC = 8 \\), боковые стороны \\( AB = 5 \\), \\( CD = 5 \\). Найдите высоту трапеции.',
    options: ['3', '4', '5', '6'],
    correctAnswer: '3',
    explanation: '\\( h = \\sqrt{AB^2 - (\\frac{AD - BC}{2})^2} = \\sqrt{25 - 4^2} = \\sqrt{25 - 16} = \\sqrt{9} = 3 \\)',
    theme: 'Геометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '35',
    type: 'multiple-choice',
    question: 'В правильной четырехугольной пирамиде сторона основания равна 6, боковое ребро равно 5. Найдите высоту пирамиды.',
    options: ['\\( \\sqrt{7} \\)', '4', '\\( \\sqrt{13} \\)', '3'],
    correctAnswer: '\\( \\sqrt{7} \\)',
    explanation: 'Половина диагонали основания: \\( 3\\sqrt{2} \\), \\( h = \\sqrt{5^2 - (3\\sqrt{2})^2} = \\sqrt{25 - 18} = \\sqrt{7} \\)',
    theme: 'Геометрия',
    difficulty: 'hard',
    points: 3
  },

  // Стереометрия (5 вопросов)
  {
    id: '36',
    type: 'multiple-choice',
    question: 'Найдите объем куба с ребром 5.',
    options: ['125', '25', '100', '150'],
    correctAnswer: '125',
    explanation: '\\( V = a^3 = 5^3 = 125 \\)',
    theme: 'Стереометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '37',
    type: 'multiple-choice',
    question: 'Найдите объем прямоугольного параллелепипеда с измерениями 4, 5, 6.',
    options: ['120', '100', '80', '150'],
    correctAnswer: '120',
    explanation: '\\( V = a \\times b \\times c = 4 \\times 5 \\times 6 = 120 \\)',
    theme: 'Стереометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '38',
    type: 'multiple-choice',
    question: 'Найдите объем цилиндра с радиусом основания 3 и высотой 7.',
    options: ['\\( 63\\pi \\)', '\\( 42\\pi \\)', '\\( 49\\pi \\)', '\\( 56\\pi \\)'],
    correctAnswer: '\\( 63\\pi \\)',
    explanation: '\\( V = \\pi r^2 h = \\pi \\times 9 \\times 7 = 63\\pi \\)',
    theme: 'Стереометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '39',
    type: 'multiple-choice',
    question: 'Найдите объем конуса с радиусом основания 4 и высотой 9.',
    options: ['\\( 48\\pi \\)', '\\( 36\\pi \\)', '\\( 54\\pi \\)', '\\( 42\\pi \\)'],
    correctAnswer: '\\( 48\\pi \\)',
    explanation: '\\( V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\times 16 \\times 9 = 48\\pi \\)',
    theme: 'Стереометрия',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '40',
    type: 'multiple-choice',
    question: 'Найдите объем шара радиусом 6.',
    options: ['\\( 288\\pi \\)', '\\( 216\\pi \\)', '\\( 144\\pi \\)', '\\( 172\\pi \\)'],
    correctAnswer: '\\( 288\\pi \\)',
    explanation: '\\( V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi \\times 216 = 288\\pi \\)',
    theme: 'Стереометрия',
    difficulty: 'medium',
    points: 2
  },

  // Тригонометрия (5 вопросов)
  {
    id: '41',
    type: 'multiple-choice',
    question: 'Найдите значение: \\( \\sin 30^\\circ \\)',
    options: ['\\( \\frac{1}{2} \\)', '\\( \\frac{\\sqrt{3}}{2} \\)', '\\( \\frac{\\sqrt{2}}{2} \\)', '1'],
    correctAnswer: '\\( \\frac{1}{2} \\)',
    explanation: '\\( \\sin 30^\\circ = \\frac{1}{2} \\) - это табличное значение',
    theme: 'Тригонометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '42',
    type: 'multiple-choice',
    question: 'Чему равен \\( \\cos 45^\\circ \\)?',
    options: ['\\( \\frac{\\sqrt{2}}{2} \\)', '\\( \\frac{1}{2} \\)', '\\( \\frac{\\sqrt{3}}{2} \\)', '1'],
    correctAnswer: '\\( \\frac{\\sqrt{2}}{2} \\)',
    explanation: '\\( \\cos 45^\\circ = \\frac{\\sqrt{2}}{2} \\) - это табличное значение',
    theme: 'Тригонометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '43',
    type: 'multiple-choice',
    question: 'Упростите выражение: \\( \\sin^2 x + \\cos^2 x \\)',
    options: ['1', '0', '\\( \\sin 2x \\)', '\\( \\cos 2x \\)'],
    correctAnswer: '1',
    explanation: 'Это основное тригонометрическое тождество: \\( \\sin^2 x + \\cos^2 x = 1 \\)',
    theme: 'Тригонометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '44',
    type: 'multiple-choice',
    question: 'Найдите \\( \\tan 45^\\circ \\)',
    options: ['1', '\\( \\sqrt{3} \\)', '\\( \\frac{\\sqrt{3}}{3} \\)', '0'],
    correctAnswer: '1',
    explanation: '\\( \\tan 45^\\circ = \\frac{\\sin 45^\\circ}{\\cos 45^\\circ} = \\frac{\\frac{\\sqrt{2}}{2}}{\\frac{\\sqrt{2}}{2}} = 1 \\)',
    theme: 'Тригонометрия',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '45',
    type: 'multiple-choice',
    question: 'Решите уравнение: \\( \\sin x = \\frac{1}{2} \\)',
    options: ['\\( x = \\frac{\\pi}{6} + 2\\pi n, \\frac{5\\pi}{6} + 2\\pi n \\)', '\\( x = \\frac{\\pi}{3} + 2\\pi n, \\frac{2\\pi}{3} + 2\\pi n \\)', '\\( x = \\frac{\\pi}{4} + 2\\pi n, \\frac{3\\pi}{4} + 2\\pi n \\)', '\\( x = \\frac{\\pi}{2} + 2\\pi n \\)'],
    correctAnswer: '\\( x = \\frac{\\pi}{6} + 2\\pi n, \\frac{5\\pi}{6} + 2\\pi n \\)',
    explanation: '\\( \\sin x = \\frac{1}{2} \\) при \\( x = \\frac{\\pi}{6} + 2\\pi n \\) и \\( x = \\frac{5\\pi}{6} + 2\\pi n \\), где \\( n \\in \\mathbb{Z} \\)',
    theme: 'Тригонометрия',
    difficulty: 'medium',
    points: 2
  },

  // Вероятность и статистика (3 вопроса)
  {
    id: '46',
    type: 'multiple-choice',
    question: 'Брошены две игральные кости. Найдите вероятность того, что сумма выпавших очков равна 7.',
    options: ['\\( \\frac{1}{6} \\)', '\\( \\frac{1}{12} \\)', '\\( \\frac{1}{18} \\)', '\\( \\frac{1}{36} \\)'],
    correctAnswer: '\\( \\frac{1}{6} \\)',
    explanation: 'Благоприятные исходы: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) - 6 из 36 возможных',
    theme: 'Вероятность',
    difficulty: 'medium',
    points: 2
  },
  {
    id: '47',
    type: 'multiple-choice',
    question: 'В коробке 5 красных и 3 синих шара. Найдите вероятность вынуть красный шар.',
    options: ['\\( \\frac{5}{8} \\)', '\\( \\frac{3}{8} \\)', '\\( \\frac{1}{2} \\)', '\\( \\frac{2}{3} \\)'],
    correctAnswer: '\\( \\frac{5}{8} \\)',
    explanation: 'Всего шаров: \\( 5 + 3 = 8 \\). Вероятность красного: \\( \\frac{5}{8} \\)',
    theme: 'Вероятность',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '48',
    type: 'multiple-choice',
    question: 'Найдите среднее арифметическое чисел: 2, 4, 6, 8, 10',
    options: ['6', '5', '7', '8'],
    correctAnswer: '6',
    explanation: '\\( \\frac{2 + 4 + 6 + 8 + 10}{5} = \\frac{30}{5} = 6 \\)',
    theme: 'Статистика',
    difficulty: 'easy',
    points: 1
  },

  // Функции и производные (2 вопроса)
  {
    id: '49',
    type: 'multiple-choice',
    question: 'Найдите производную функции: \\( f(x) = x^3 \\)',
    options: ['\\( 3x^2 \\)', '\\( 2x^3 \\)', '\\( 3x \\)', '\\( x^2 \\)'],
    correctAnswer: '\\( 3x^2 \\)',
    explanation: 'По формуле производной степенной функции: \\( (x^n)^\\prime = n \\cdot x^{n-1} \\)',
    theme: 'Производные',
    difficulty: 'easy',
    points: 1
  },
  {
    id: '50',
    type: 'multiple-choice',
    question: 'Найдите производную функции: \\( f(x) = \\sin x \\)',
    options: ['\\( \\cos x \\)', '\\( -\\cos x \\)', '\\( -\\sin x \\)', '\\( \\tan x \\)'],
    correctAnswer: '\\( \\cos x \\)',
    explanation: 'Производная \\( \\sin x \\) равна \\( \\cos x \\)',
    theme: 'Производные',
    difficulty: 'easy',
    points: 1
  }
];

// Функция для получения случайных вопросов (15 вопросов для тестирования)
export const getRandomQuestions = (count: number = 15): AssessmentQuestion[] => {
  const shuffled = [...MATH_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Функция для получения вопросов по сложности
export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard', count: number): AssessmentQuestion[] => {
  const filtered = MATH_QUESTIONS.filter(q => q.difficulty === difficulty);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Функция для получения сбалансированного набора вопросов
export const getBalancedQuestions = (): AssessmentQuestion[] => {
  const easy = getQuestionsByDifficulty('easy', 6);
  const medium = getQuestionsByDifficulty('medium', 6);
  const hard = getQuestionsByDifficulty('hard', 3);
  
  return [...easy, ...medium, ...hard].sort(() => 0.5 - Math.random());
};

export const getAssessmentQuestions = (): AssessmentQuestion[] => {
  const shuffled = [...MATH_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 15);
};