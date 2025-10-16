from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from datetime import datetime, timedelta
import logging
from enum import Enum
import json

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Advanced EGE Trainer ML API", 
    version="2.0.0",
    description="Умный генератор учебных планов для подготовки к ЕГЭ с адаптивным ML"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Расширенные модели данных
class LearningStyle(str, Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    READING_WRITING = "reading_writing"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class UserData(BaseModel):
    userId: str
    currentScore: float
    targetScore: float
    examDate: str
    availableHoursPerWeek: int
    weakAreas: List[str]
    strongAreas: List[str]
    subject: str
    testResults: Dict[str, Any]
    learningStyle: Optional[LearningStyle] = LearningStyle.READING_WRITING
    preferredDifficulty: Optional[DifficultyLevel] = DifficultyLevel.INTERMEDIATE
    previousExperience: Optional[str] = ""
    motivationLevel: Optional[int] = 7  # 1-10
    focusAreas: Optional[List[str]] = []

class StudyPlanResponse(BaseModel):
    success: bool
    plan: Dict[str, Any]
    recommendations: List[str]
    confidence: float
    generatedBy: str
    planId: Optional[str] = None
    analytics: Optional[Dict[str, Any]] = None

# Полная база знаний ЕГЭ математика с расширенными метаданными
EGE_MATH_TOPICS = {
    'Базовые навыки': [
        {'name': 'Арифметика', 'weight': 0.8, 'base_time': 4, 'complexity': 2, 'importance': 'high'},
        {'name': 'Алгебраические преобразования', 'weight': 0.9, 'base_time': 6, 'complexity': 3, 'importance': 'high'},
        {'name': 'Проценты', 'weight': 0.7, 'base_time': 5, 'complexity': 2, 'importance': 'medium'},
        {'name': 'Дроби', 'weight': 0.7, 'base_time': 4, 'complexity': 2, 'importance': 'medium'},
        {'name': 'Степени и корни', 'weight': 0.8, 'base_time': 5, 'complexity': 3, 'importance': 'high'}
    ],
    'Уравнения': [
        {'name': 'Линейные уравнения', 'weight': 0.8, 'base_time': 5, 'complexity': 2, 'importance': 'high'},
        {'name': 'Квадратные уравнения', 'weight': 0.9, 'base_time': 7, 'complexity': 3, 'importance': 'high'},
        {'name': 'Рациональные уравнения', 'weight': 0.8, 'base_time': 6, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Иррациональные уравнения', 'weight': 0.7, 'base_time': 8, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Показательные уравнения', 'weight': 0.8, 'base_time': 7, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Логарифмические уравнения', 'weight': 0.8, 'base_time': 7, 'complexity': 4, 'importance': 'medium'}
    ],
    'Неравенства': [
        {'name': 'Линейные неравенства', 'weight': 0.7, 'base_time': 4, 'complexity': 2, 'importance': 'medium'},
        {'name': 'Квадратные неравенства', 'weight': 0.8, 'base_time': 6, 'complexity': 3, 'importance': 'high'},
        {'name': 'Рациональные неравенства', 'weight': 0.7, 'base_time': 7, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Показательные неравенства', 'weight': 0.6, 'base_time': 8, 'complexity': 4, 'importance': 'low'},
        {'name': 'Логарифмические неравенства', 'weight': 0.6, 'base_time': 8, 'complexity': 4, 'importance': 'low'}
    ],
    'Функции': [
        {'name': 'Линейные функции', 'weight': 0.8, 'base_time': 5, 'complexity': 2, 'importance': 'high'},
        {'name': 'Квадратичные функции', 'weight': 0.9, 'base_time': 7, 'complexity': 3, 'importance': 'high'},
        {'name': 'Показательные функции', 'weight': 0.8, 'base_time': 8, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Логарифмические функции', 'weight': 0.8, 'base_time': 8, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Тригонометрические функции', 'weight': 0.9, 'base_time': 9, 'complexity': 4, 'importance': 'high'},
        {'name': 'Графики функций', 'weight': 0.7, 'base_time': 6, 'complexity': 3, 'importance': 'medium'}
    ],
    'Тригонометрия': [
        {'name': 'Тригонометрические функции', 'weight': 0.9, 'base_time': 8, 'complexity': 4, 'importance': 'high'},
        {'name': 'Тригонометрические уравнения', 'weight': 0.9, 'base_time': 10, 'complexity': 4, 'importance': 'high'},
        {'name': 'Тригонометрические тождества', 'weight': 0.7, 'base_time': 6, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Обратные тригонометрические функции', 'weight': 0.6, 'base_time': 7, 'complexity': 4, 'importance': 'low'},
        {'name': 'Тригонометрические неравенства', 'weight': 0.5, 'base_time': 9, 'complexity': 5, 'importance': 'low'}
    ],
    'Производная': [
        {'name': 'Производная функции', 'weight': 0.9, 'base_time': 10, 'complexity': 4, 'importance': 'high'},
        {'name': 'Исследование функций', 'weight': 0.9, 'base_time': 12, 'complexity': 5, 'importance': 'high'},
        {'name': 'Наибольшие и наименьшие значения', 'weight': 0.8, 'base_time': 8, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Касательная к графику', 'weight': 0.7, 'base_time': 6, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Приложения производной', 'weight': 0.6, 'base_time': 7, 'complexity': 4, 'importance': 'low'}
    ],
    'Первообразная': [
        {'name': 'Первообразная', 'weight': 0.8, 'base_time': 8, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Определенный интеграл', 'weight': 0.8, 'base_time': 10, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Площадь фигур', 'weight': 0.7, 'base_time': 6, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Приложения интеграла', 'weight': 0.5, 'base_time': 7, 'complexity': 4, 'importance': 'low'}
    ],
    'Планиметрия': [
        {'name': 'Треугольники', 'weight': 0.9, 'base_time': 8, 'complexity': 3, 'importance': 'high'},
        {'name': 'Четырехугольники', 'weight': 0.8, 'base_time': 7, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Окружность', 'weight': 0.9, 'base_time': 9, 'complexity': 4, 'importance': 'high'},
        {'name': 'Векторы на плоскости', 'weight': 0.7, 'base_time': 6, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Координаты на плоскости', 'weight': 0.7, 'base_time': 5, 'complexity': 2, 'importance': 'medium'},
        {'name': 'Геометрические преобразования', 'weight': 0.6, 'base_time': 7, 'complexity': 4, 'importance': 'low'}
    ],
    'Стереометрия': [
        {'name': 'Многогранники', 'weight': 0.9, 'base_time': 12, 'complexity': 5, 'importance': 'high'},
        {'name': 'Тела вращения', 'weight': 0.8, 'base_time': 10, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Векторы в пространстве', 'weight': 0.7, 'base_time': 8, 'complexity': 4, 'importance': 'medium'},
        {'name': 'Координаты в пространстве', 'weight': 0.7, 'base_time': 7, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Сечения фигур', 'weight': 0.6, 'base_time': 9, 'complexity': 5, 'importance': 'low'}
    ],
    'Теория вероятностей': [
        {'name': 'Комбинаторика', 'weight': 0.8, 'base_time': 8, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Вероятности событий', 'weight': 0.9, 'base_time': 10, 'complexity': 4, 'importance': 'high'},
        {'name': 'Статистика', 'weight': 0.6, 'base_time': 5, 'complexity': 2, 'importance': 'low'},
        {'name': 'Случайные величины', 'weight': 0.5, 'base_time': 7, 'complexity': 4, 'importance': 'low'}
    ],
    'Текстовые задачи': [
        {'name': 'Задачи на движение', 'weight': 0.8, 'base_time': 6, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Задачи на работу', 'weight': 0.7, 'base_time': 5, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Задачи на проценты', 'weight': 0.7, 'base_time': 4, 'complexity': 2, 'importance': 'medium'},
        {'name': 'Задачи на смеси', 'weight': 0.6, 'base_time': 5, 'complexity': 3, 'importance': 'low'},
        {'name': 'Задачи на прогрессии', 'weight': 0.7, 'base_time': 6, 'complexity': 3, 'importance': 'medium'}
    ],
    'Параметры': [
        {'name': 'Задачи с параметрами', 'weight': 0.6, 'base_time': 15, 'complexity': 5, 'importance': 'low'},
        {'name': 'Исследование уравнений с параметрами', 'weight': 0.5, 'base_time': 12, 'complexity': 5, 'importance': 'low'}
    ],
    'Числа и последовательности': [
        {'name': 'Прогрессии', 'weight': 0.8, 'base_time': 7, 'complexity': 3, 'importance': 'medium'},
        {'name': 'Числовые множества', 'weight': 0.6, 'base_time': 4, 'complexity': 2, 'importance': 'low'},
        {'name': 'Делимость чисел', 'weight': 0.5, 'base_time': 5, 'complexity': 3, 'importance': 'low'}
    ]
}

class AdaptiveStudyPlanGenerator:
    def __init__(self):
        self.topic_dependencies = self._build_advanced_dependencies()
        self.learning_strategies = self._build_learning_strategies()
        self.difficulty_profiles = self._build_difficulty_profiles()
        self.basic_topics_for_advanced = self._define_basic_topics_to_exclude()
        
    def _build_advanced_dependencies(self):
        """Расширенные зависимости между темами с учетом логических связей"""
        return {
            'Квадратные уравнения': ['Линейные уравнения', 'Алгебраические преобразования'],
            'Рациональные уравнения': ['Квадратные уравнения', 'Дроби'],
            'Иррациональные уравнения': ['Рациональные уравнения', 'Корни'],
            'Квадратные неравенства': ['Квадратные уравнения', 'Линейные неравенства'],
            'Тригонометрические уравнения': ['Тригонометрические функции', 'Основные тождества'],
            'Производная функции': ['Пределы функций', 'Графики функций'],
            'Исследование функций': ['Производная функции', 'Графики функций'],
            'Первообразная': ['Производная функции', 'Интегралы'],
            'Стереометрия': ['Планиметрия', 'Векторы в пространстве'],
            'Задачи с параметрами': ['Квадратные уравнения', 'Неравенства', 'Графики функций'],
            'Теория вероятностей': ['Комбинаторика', 'Дроби'],
            'Текстовые задачи': ['Проценты', 'Уравнения']
        }
    
    def _build_learning_strategies(self):
        """Стратегии обучения для разных стилей"""
        return {
            LearningStyle.VISUAL: {
                'resources': ['видеоуроки', 'инфографика', 'диаграммы', '3D-модели'],
                'methods': ['визуализация', 'рисование схем', 'цветовое кодирование'],
                'practice': ['графические задачи', 'геометрические построения']
            },
            LearningStyle.AUDITORY: {
                'resources': ['аудиолекции', 'подкасты', 'обсуждения'],
                'methods': ['объяснение вслух', 'запись на диктофон', 'групповые обсуждения'],
                'practice': ['устные задачи', 'объяснение решений']
            },
            LearningStyle.KINESTHETIC: {
                'resources': ['интерактивные симуляции', 'физические модели', 'практические эксперименты'],
                'methods': ['решение на доске', 'физические манипуляции', 'ролевые игры'],
                'practice': ['практические задачи', 'реальные примеры']
            },
            LearningStyle.READING_WRITING: {
                'resources': ['учебники', 'конспекты', 'статьи', 'письменные задания'],
                'methods': ['ведение тетради', 'составление планов', 'письменные упражнения'],
                'practice': ['письменные решения', 'эссе', 'анализ текстов']
            }
        }
    
    def _build_difficulty_profiles(self):
        """Профили сложности для разных уровней подготовки"""
        return {
            DifficultyLevel.BEGINNER: {
                'theory_practice_ratio': 0.6,  # 60% теории, 40% практики
                'step_by_step_guidance': True,
                'review_frequency': 'high',
                'max_topic_duration': 4
            },
            DifficultyLevel.INTERMEDIATE: {
                'theory_practice_ratio': 0.4,  # 40% теории, 60% практики
                'step_by_step_guidance': False,
                'review_frequency': 'medium',
                'max_topic_duration': 6
            },
            DifficultyLevel.ADVANCED: {
                'theory_practice_ratio': 0.2,  # 20% теории, 80% практики
                'step_by_step_guidance': False,
                'review_frequency': 'low',
                'max_topic_duration': 8
            }
        }

    def _define_basic_topics_to_exclude(self):
        """Определяет базовые темы, которые можно исключить для продвинутых учеников"""
        return {
            'high_score': {
                'exclude_completely': [
                    'Арифметика', 'Проценты', 'Дроби', 'Линейные уравнения',
                    'Линейные неравенства', 'Числовые множества', 'Статистика'
                ],
                'reduce_time': [
                    'Алгебраические преобразования', 'Степени и корни',
                    'Линейные функции', 'Графики функций'
                ]
            },
            'medium_score': {
                'exclude_completely': [
                    'Арифметика', 'Проценты'
                ],
                'reduce_time': [
                    'Дроби', 'Линейные уравнения', 'Линейные неравенства'
                ]
            }
        }

    def analyze_learning_gaps(self, user_data: UserData) -> Dict[str, Any]:
        """Анализ пробелов в знаниях на основе результатов тестов"""
        gaps = {
            'critical': [],
            'significant': [],
            'minor': []
        }
        
        # Анализ слабых областей
        for area in user_data.weakAreas:
            # Определяем критичность пробела
            if any(keyword in area.lower() for keyword in ['функции', 'уравнения', 'производная']):
                gaps['critical'].append(area)
            elif any(keyword in area.lower() for keyword in ['геометрия', 'тригонометрия']):
                gaps['significant'].append(area)
            else:
                gaps['minor'].append(area)
        
        return gaps

    def calculate_adaptive_priority(self, topic: Dict, user_data: UserData, learning_gaps: Dict) -> float:
        """Адаптивный расчет приоритета темы с учетом множества факторов"""
        base_weight = topic['weight']
        
        # Фактор слабых областей
        if topic['name'] in learning_gaps['critical']:
            gap_boost = 3.0
        elif topic['name'] in learning_gaps['significant']:
            gap_boost = 2.0
        elif topic['name'] in user_data.weakAreas:
            gap_boost = 1.5
        else:
            gap_boost = 1.0
        
        # Фактор текущего уровня
        current_score = user_data.currentScore
        if current_score < 40:
            level_factor = 1.6 if topic['base_time'] <= 5 else 0.6
        elif current_score < 60:
            level_factor = 1.3 if topic['base_time'] <= 7 else 0.8
        elif current_score < 80:
            level_factor = 1.1
        else:
            level_factor = 1.0 if topic['base_time'] >= 8 else 0.9
        
        # Фактор целевого балла
        target_factor = 1.0 + (user_data.targetScore - 50) / 100
        
        # Фактор мотивации
        motivation_factor = 0.8 + (user_data.motivationLevel * 0.02)
        
        # Фактор предпочтений пользователя
        preference_factor = 1.2 if topic['name'] in user_data.focusAreas else 1.0
        
        return base_weight * gap_boost * level_factor * target_factor * motivation_factor * preference_factor * 100

    def estimate_learning_time_v2(self, topic: Dict, user_data: UserData) -> int:
        """Улучшенная оценка времени изучения с учетом стиля обучения"""
        base_time = topic['base_time']
        
        # Корректировка на основе текущего уровня
        level_multipliers = {
            DifficultyLevel.BEGINNER: 1.5,
            DifficultyLevel.INTERMEDIATE: 1.2,
            DifficultyLevel.ADVANCED: 0.9
        }
        level_multiplier = level_multipliers.get(user_data.preferredDifficulty, 1.2)
        
        # Корректировка на целевой балл
        target_multiplier = 1.0 + (user_data.targetScore - 60) / 80
        
        # Корректировка на стиль обучения
        style_multipliers = {
            LearningStyle.VISUAL: 0.9,
            LearningStyle.AUDITORY: 1.1,
            LearningStyle.KINESTHETIC: 1.0,
            LearningStyle.READING_WRITING: 1.0
        }
        style_multiplier = style_multipliers.get(user_data.learningStyle, 1.0)
        
        estimated_time = base_time * level_multiplier * target_multiplier * style_multiplier
        
        # Ограничения по времени
        max_time = self.difficulty_profiles[user_data.preferredDifficulty]['max_topic_duration']
        return max(2, min(int(round(estimated_time)), max_time))

    def filter_topics_for_advanced_students(self, user_data: UserData, topics_analysis: Dict) -> Dict:
        """Фильтрует темы для продвинутых учеников (currentScore > 70)"""
        if user_data.currentScore < 70:
            return topics_analysis
            
        filtered_analysis = topics_analysis.copy()
        
        # Определяем стратегию фильтрации в зависимости от баллов
        if user_data.currentScore >= 80:
            strategy = 'high_score'
        else:
            strategy = 'medium_score'
        
        # Полностью исключаем базовые темы
        for topic_name in self.basic_topics_for_advanced[strategy]['exclude_completely']:
            if topic_name in filtered_analysis:
                del filtered_analysis[topic_name]
                logger.info(f"🚫 Исключена базовая тема для продвинутого ученика: {topic_name}")
        
        # Уменьшаем время на упрощенные темы
        for topic_name in self.basic_topics_for_advanced[strategy]['reduce_time']:
            if topic_name in filtered_analysis:
                # Уменьшаем время на 50-70%
                original_time = filtered_analysis[topic_name]['estimated_time']
                reduced_time = max(2, int(original_time * 0.3))  # Оставляем 30% времени
                filtered_analysis[topic_name]['estimated_time'] = reduced_time
                logger.info(f"⏱️ Уменьшено время на тему {topic_name}: {original_time}ч → {reduced_time}ч")
        
        return filtered_analysis

    def adjust_for_high_target_score(self, user_data: UserData, topics_analysis: Dict) -> Dict:
        """Добавляет сложные темы для учеников с высокими целевыми баллами"""
        if user_data.targetScore < 85:
            return topics_analysis
            
        adjusted_analysis = topics_analysis.copy()
        
        # Сложные темы для высоких баллов
        advanced_topics = {
            'Задачи с параметрами': {
                'weight': 0.9,
                'base_time': 18,
                'complexity': 5,
                'importance': 'high'
            },
            'Исследование уравнений с параметрами': {
                'weight': 0.8,
                'base_time': 15,
                'complexity': 5,
                'importance': 'high'
            },
            'Сложные стереометрические задачи': {
                'weight': 0.8,
                'base_time': 14,
                'complexity': 5,
                'importance': 'high'
            },
            'Олимпиадные задачи': {
                'weight': 0.7,
                'base_time': 12,
                'complexity': 5,
                'importance': 'medium'
            }
        }
        
        # Добавляем сложные темы если их еще нет
        for topic_name, topic_info in advanced_topics.items():
            if topic_name not in adjusted_analysis:
                priority = self.calculate_adaptive_priority(
                    topic_info, user_data, self.analyze_learning_gaps(user_data)
                )
                estimated_time = self.estimate_learning_time_v2(topic_info, user_data)
                
                adjusted_analysis[topic_name] = {
                    'priority': priority,
                    'estimated_time': estimated_time,
                    'category': 'Продвинутые темы',
                    'base_time': topic_info['base_time'],
                    'weight': topic_info['weight'],
                    'complexity': topic_info['complexity'],
                    'dependencies': ['Квадратные уравнения', 'Неравенства', 'Функции']
                }
                logger.info(f"🎯 Добавлена сложная тема для высокого балла: {topic_name}")
        
        return adjusted_analysis

    def optimize_topic_selection(self, user_data: UserData) -> Dict[str, Dict[str, Any]]:
        """Оптимизированный выбор тем с учетом уровня ученика"""
        exam_date = datetime.fromisoformat(user_data.examDate.replace('Z', '+00:00'))
        current_date = datetime.now()
        total_weeks = max(4, (exam_date - current_date).days // 7)
        total_hours = total_weeks * user_data.availableHoursPerWeek
        
        learning_gaps = self.analyze_learning_gaps(user_data)
        
        # Собираем все темы с расширенной информацией
        topic_analysis = {}
        for category_name, category_topics in EGE_MATH_TOPICS.items():
            for topic in category_topics:
                priority = self.calculate_adaptive_priority(topic, user_data, learning_gaps)
                estimated_time = self.estimate_learning_time_v2(topic, user_data)
                
                topic_analysis[topic['name']] = {
                    'priority': priority,
                    'estimated_time': estimated_time,
                    'category': category_name,
                    'base_time': topic['base_time'],
                    'weight': topic['weight'],
                    'complexity': topic['complexity'],
                    'dependencies': self.topic_dependencies.get(topic['name'], [])
                }
        
        # Оптимизация для продвинутых учеников
        if user_data.currentScore > 70:
            topic_analysis = self.filter_topics_for_advanced_students(user_data, topic_analysis)
        
        # Добавление сложных тем для высоких целевых баллов
        if user_data.targetScore > 80:
            topic_analysis = self.adjust_for_high_target_score(user_data, topic_analysis)
        
        # Оптимизированное распределение с учетом зависимостей
        schedule = {}
        remaining_hours = total_hours
        scheduled_topics = set()
        
        def is_topic_ready(topic_name):
            deps = topic_analysis[topic_name]['dependencies']
            return all(dep in scheduled_topics for dep in deps)
        
        # Стратегия распределения в зависимости от уровня
        if user_data.currentScore > 70:
            # Для продвинутых: фокус на сложных темах и пробелах
            distribution_strategy = 'advanced'
        else:
            # Для начинающих и средних: сбалансированный подход
            distribution_strategy = 'balanced'
        
        for pass_num in range(3):
            if remaining_hours <= 0:
                break
                
            # Для продвинутых учеников меняем приоритеты на первых проходах
            if distribution_strategy == 'advanced' and pass_num == 0:
                # Первый проход: только сложные темы и пробелы
                ready_topics = [
                    (name, info) for name, info in topic_analysis.items()
                    if name not in scheduled_topics and is_topic_ready(name)
                    and (info['complexity'] >= 4 or name in learning_gaps['critical'])
                ]
            else:
                # Стандартный отбор
                ready_topics = [
                    (name, info) for name, info in topic_analysis.items()
                    if name not in scheduled_topics and (pass_num > 0 or is_topic_ready(name))
                ]
            
            if not ready_topics and pass_num == 0:
                ready_topics = [
                    (name, info) for name, info in topic_analysis.items()
                    if name not in scheduled_topics and not info['dependencies']
                ]
            
            sorted_topics = sorted(ready_topics, key=lambda x: x[1]['priority'], reverse=True)
            
            for topic_name, topic_info in sorted_topics:
                if remaining_hours <= 0:
                    break
                    
                needed_time = topic_info['estimated_time']
                
                total_priority = sum(info['priority'] for _, info in sorted_topics if _ not in schedule)
                if total_priority > 0:
                    allocated_time = min(
                        needed_time,
                        int(remaining_hours * (topic_info['priority'] / total_priority))
                    )
                else:
                    allocated_time = needed_time
                
                # Для продвинутых учеников увеличиваем максимум времени на сложные темы
                if (distribution_strategy == 'advanced' and 
                    topic_info.get('complexity', 0) >= 4):
                    max_time = 16
                else:
                    max_time = 12
                
                allocated_time = max(2, min(allocated_time, max_time))
                
                if allocated_time >= 2 and remaining_hours >= allocated_time:
                    schedule[topic_name] = {
                        'allocated_hours': allocated_time,
                        'priority': topic_info['priority'],
                        'category': topic_info['category'],
                        'week_distribution': [],
                        'complexity': topic_info.get('complexity', 3)
                    }
                    scheduled_topics.add(topic_name)
                    remaining_hours -= allocated_time
        
        return schedule

    def generate_optimized_schedule(self, user_data: UserData) -> Dict[str, Dict[str, Any]]:
        """Обновленная основная функция генерации расписания"""
        return self.optimize_topic_selection(user_data)

    def create_personalized_weekly_plan(self, schedule: Dict[str, Dict], user_data: UserData) -> List[Dict[str, Any]]:
        """Создание персонализированного недельного плана"""
        exam_date = datetime.fromisoformat(user_data.examDate.replace('Z', '+00:00'))
        current_date = datetime.now()
        total_weeks = max(4, (exam_date - current_date).days // 7)
        weekly_hours = user_data.availableHoursPerWeek
        
        # Получаем стратегию обучения
        learning_strategy = self.learning_strategies[user_data.learningStyle]
        difficulty_profile = self.difficulty_profiles[user_data.preferredDifficulty]
        
        weekly_plans = []
        
        # Распределяем темы по неделям с учетом зависимостей
        remaining_schedule = schedule.copy()
        current_week = 1
        
        while remaining_schedule and current_week <= total_weeks:
            week_plan = {
                'weekNumber': current_week,
                'focusTopics': [],
                'totalHours': 0,
                'dailyBreakdown': [],
                'learningActivities': [],
                'goals': self._get_adaptive_weekly_goals(current_week, total_weeks, user_data),
                'practiceTests': [],
                'resources': [],
                'successMetrics': []
            }
            
            current_week_hours = 0
            
            # Выбираем темы для текущей недели
            topics_for_week = []
            for topic_name, topic_info in list(remaining_schedule.items()):
                if current_week_hours >= weekly_hours:
                    break
                    
                # Проверяем зависимости
                deps = topic_info.get('dependencies', [])
                if not all(dep not in remaining_schedule for dep in deps):
                    continue
                
                topic_hours = topic_info['allocated_hours']
                hours_this_week = min(topic_hours, 8, weekly_hours - current_week_hours)
                
                if hours_this_week >= 2:
                    topics_for_week.append((topic_name, hours_this_week, topic_info))
                    current_week_hours += hours_this_week
                    
                    # Обновляем оставшееся время
                    remaining_hours = topic_hours - hours_this_week
                    if remaining_hours > 0:
                        remaining_schedule[topic_name]['allocated_hours'] = remaining_hours
                    else:
                        del remaining_schedule[topic_name]
            
            # Создаем детальный план на неделю
            for topic_name, hours, topic_info in topics_for_week:
                week_plan['focusTopics'].append({
                    'name': topic_name,
                    'hours': hours,
                    'category': topic_info['category'],
                    'priority': topic_info['priority']
                })
                
                # Создаем персонализированные активности
                activities = self._create_topic_activities(
                    topic_name, hours, user_data, learning_strategy, difficulty_profile
                )
                week_plan['learningActivities'].extend(activities)
                
                # Добавляем рекомендованные ресурсы
                week_plan['resources'].extend(
                    self._get_topic_resources(topic_name, user_data.learningStyle)
                )
            
            week_plan['totalHours'] = current_week_hours
            
            # Добавляем пробные тесты и повторение
            if current_week % 3 == 0:
                week_plan['practiceTests'].append({
                    'type': 'diagnostic',
                    'topics': [t[0] for t in topics_for_week],
                    'duration': 2
                })
            
            if current_week == total_weeks - 1:
                week_plan['practiceTests'].append({
                    'type': 'final_review',
                    'topics': 'all_covered',
                    'duration': 3
                })
            
            weekly_plans.append(week_plan)
            current_week += 1
        
        return weekly_plans

    def create_focused_weekly_plan(self, schedule: Dict[str, Dict], user_data: UserData) -> List[Dict[str, Any]]:
        """Создает сфокусированный недельный план для продвинутых учеников"""
        if user_data.currentScore <= 70:
            return self.create_personalized_weekly_plan(schedule, user_data)
        
        exam_date = datetime.fromisoformat(user_data.examDate.replace('Z', '+00:00'))
        current_date = datetime.now()
        total_weeks = max(4, (exam_date - current_date).days // 7)
        weekly_hours = user_data.availableHoursPerWeek
        
        learning_strategy = self.learning_strategies[user_data.learningStyle]
        difficulty_profile = self.difficulty_profiles[user_data.preferredDifficulty]
        
        weekly_plans = []
        remaining_schedule = schedule.copy()
        current_week = 1
        
        while remaining_schedule and current_week <= total_weeks:
            week_plan = {
                'weekNumber': current_week,
                'focusTopics': [],
                'totalHours': 0,
                'learningActivities': [],
                'goals': self._get_advanced_weekly_goals(current_week, total_weeks, user_data),
                'practiceTests': [],
                'resources': [],
                'intensity': 'high' if user_data.currentScore > 80 else 'medium'
            }
            
            current_week_hours = 0
            
            # Для продвинутых: меньше тем, но более глубокое изучение
            max_topics_per_week = 2 if user_data.currentScore > 80 else 3
            
            topics_for_week = []
            for topic_name, topic_info in list(remaining_schedule.items()):
                if (current_week_hours >= weekly_hours or 
                    len(topics_for_week) >= max_topics_per_week):
                    break
                    
                deps = topic_info.get('dependencies', [])
                if not all(dep not in remaining_schedule for dep in deps):
                    continue
                
                topic_hours = topic_info['allocated_hours']
                # Для сложных тем выделяем больше времени за раз
                if topic_info.get('complexity', 0) >= 4:
                    hours_this_week = min(topic_hours, 10, weekly_hours - current_week_hours)
                else:
                    hours_this_week = min(topic_hours, 6, weekly_hours - current_week_hours)
                
                if hours_this_week >= 3:  # Минимум 3 часа на тему для продвинутых
                    topics_for_week.append((topic_name, hours_this_week, topic_info))
                    current_week_hours += hours_this_week
                    
                    remaining_hours = topic_hours - hours_this_week
                    if remaining_hours > 0:
                        remaining_schedule[topic_name]['allocated_hours'] = remaining_hours
                    else:
                        del remaining_schedule[topic_name]
            
            # Создаем углубленный план на неделю
            for topic_name, hours, topic_info in topics_for_week:
                week_plan['focusTopics'].append({
                    'name': topic_name,
                    'hours': hours,
                    'category': topic_info['category'],
                    'priority': topic_info['priority'],
                    'complexity': topic_info.get('complexity', 3)
                })
                
                # Более продвинутые активности
                activities = self._create_advanced_topic_activities(
                    topic_name, hours, user_data, learning_strategy, difficulty_profile
                )
                week_plan['learningActivities'].extend(activities)
                
                week_plan['resources'].extend(
                    self._get_advanced_topic_resources(topic_name, user_data.learningStyle)
                )
            
            week_plan['totalHours'] = current_week_hours
            
            # Более частые пробные тесты для продвинутых
            if current_week % 2 == 0:
                week_plan['practiceTests'].append({
                    'type': 'advanced_diagnostic',
                    'topics': [t[0] for t in topics_for_week],
                    'duration': 3,
                    'difficulty': 'high'
                })
            
            if current_week == total_weeks - 2:
                week_plan['practiceTests'].append({
                    'type': 'exam_simulation',
                    'topics': 'full_exam',
                    'duration': 4,
                    'difficulty': 'exam_level'
                })
            
            weekly_plans.append(week_plan)
            current_week += 1
        
        return weekly_plans

    def _create_topic_activities(self, topic_name: str, hours: int, user_data: UserData, 
                               strategy: Dict, profile: Dict) -> List[Dict]:
        """Создает персонализированные учебные активности"""
        activities = []
        
        # Распределение времени теория/практика
        theory_ratio = profile['theory_practice_ratio']
        theory_hours = max(1, int(hours * theory_ratio))
        practice_hours = hours - theory_hours
        
        # Теоретические активности
        theory_methods = strategy['methods']
        theory_resources = strategy['resources']
        
        activities.append({
            'type': 'theory',
            'duration': theory_hours,
            'methods': theory_methods[:2],  # Берем 2 основных метода
            'resources': theory_resources[:2],
            'description': f'Изучение теории: {topic_name}'
        })
        
        # Практические активности
        practice_methods = strategy['practice']
        activities.append({
            'type': 'practice',
            'duration': practice_hours,
            'methods': practice_methods,
            'exercises': f'Практические задания по {topic_name}',
            'difficulty': user_data.preferredDifficulty.value
        })
        
        return activities

    def _create_advanced_topic_activities(self, topic_name: str, hours: int, user_data: UserData, 
                                        strategy: Dict, profile: Dict) -> List[Dict]:
        """Создает продвинутые учебные активности"""
        activities = []
        
        # Для продвинутых: меньше теории, больше сложной практики
        theory_ratio = 0.15  # 15% теории, 85% практики
        theory_hours = max(1, int(hours * theory_ratio))
        practice_hours = hours - theory_hours
        
        # Продвинутая теория
        activities.append({
            'type': 'advanced_theory',
            'duration': theory_hours,
            'methods': ['глубокий анализ', 'сравнение методов', 'доказательства'],
            'resources': ['научные статьи', 'олимпиадные материалы', 'углубленные учебники'],
            'description': f'Углубленное изучение: {topic_name}'
        })
        
        # Сложная практика
        activities.append({
            'type': 'challenging_practice',
            'duration': practice_hours,
            'methods': ['нестандартные задачи', 'доказательства', 'оптимизация решений'],
            'exercises': f'Сложные задания по {topic_name}',
            'difficulty': 'high',
            'sources': ['олимпиадные задачи', 'задачи с параметрами', 'комбинированные задания']
        })
        
        return activities

    def _get_adaptive_weekly_goals(self, week: int, total_weeks: int, user_data: UserData) -> List[str]:
        """Адаптивные цели недели"""
        progress = week / total_weeks
        current_level = user_data.currentScore
        target_level = user_data.targetScore
        
        expected_progress = current_level + (target_level - current_level) * progress
        
        if progress <= 0.2:
            return [
                "Освоение фундаментальных понятий",
                "Развитие базовых навыков решения",
                "Понимание основных методов и подходов"
            ]
        elif progress <= 0.5:
            return [
                f"Достижение уровня {int(expected_progress)} баллов",
                "Систематизация знаний по ключевым темам",
                "Развитие скорости решения типовых задач"
            ]
        elif progress <= 0.8:
            return [
                "Решение задач повышенной сложности",
                "Оптимизация стратегии решения",
                "Улучшение точности и внимательности"
            ]
        else:
            return [
                "Экзаменационная тренировка",
                "Тайм-менеджмент на экзамене",
                "Психологическая подготовка"
            ]

    def _get_advanced_weekly_goals(self, week: int, total_weeks: int, user_data: UserData) -> List[str]:
        """Цели недели для продвинутых учеников"""
        progress = week / total_weeks
        current_level = user_data.currentScore
        target_level = user_data.targetScore
        
        expected_progress = current_level + (target_level - current_level) * progress
        
        if progress <= 0.3:
            return [
                "Углубление знаний по ключевым темам",
                "Освоение продвинутых методов решения",
                "Развитие математической интуиции"
            ]
        elif progress <= 0.6:
            return [
                f"Достижение уровня {int(expected_progress)}+ баллов",
                "Решение задач олимпиадного уровня",
                "Совершенствование техники доказательств"
            ]
        elif progress <= 0.8:
            return [
                "Стабильное решение сложных задач",
                "Оптимизация стратегии экзамена",
                "Развитие креативного мышления"
            ]
        else:
            return [
                "Экспертная подготовка к ЕГЭ",
                "Тактика решения нестандартных задач",
                "Психологическая устойчивость на экзамене"
            ]

    def _get_topic_resources(self, topic_name: str, learning_style: LearningStyle) -> List[str]:
        """Персонализированные ресурсы для темы"""
        base_resources = {
            'common': [
                "Сборник ФИПИ 2024",
                "Типовые экзаменационные варианты",
                "EGE Trainer - онлайн тренажер"
            ],
            'visual': [
                "Интерактивные видеуроки",
                "Анимированные объяснения",
                "Графические схемы и диаграммы"
            ],
            'auditory': [
                "Аудиолекции по теме",
                "Подкасты с разбором задач",
                "Обсуждения в учебных группах"
            ],
            'kinesthetic': [
                "Интерактивные симуляции",
                "Практические эксперименты",
                "Физические модели и макеты"
            ],
            'reading_writing': [
                "Детальные конспекты",
                "Письменные упражнения",
                "Аналитические задания"
            ]
        }
        
        resources = base_resources['common'] + base_resources[learning_style.value]
        
        # Специфические ресурсы для тем
        topic_specific = {
            'Геометрия': ['3D-визуализатор', 'Геометрический конструктор'],
            'Тригонометрия': ['Тригонометрический круг', 'Анимированные графики'],
            'Производная': ['Графический анализатор', 'Интерактивные пределы'],
            'Вероятность': ['Вероятностные симуляции', 'Статистические визуализации']
        }
        
        for key, additional_resources in topic_specific.items():
            if key.lower() in topic_name.lower():
                resources.extend(additional_resources)
        
        return resources

    def _get_advanced_topic_resources(self, topic_name: str, learning_style: LearningStyle) -> List[str]:
        """Ресурсы для продвинутых учеников"""
        base_advanced_resources = {
            'common': [
                "Сборник олимпиадных задач",
                "Углубленный курс математики",
                "Задачи с параметрами (продвинутый уровень)",
                "Методы доказательств в математике"
            ],
            'visual': [
                "Продвинутые визуализации",
                "Интерактивные 3D-модели сложных концепций",
                "Анимации доказательств"
            ],
            'auditory': [
                "Лекции ведущих математиков",
                "Обсуждения сложных задач",
                "Подкасты о математических методах"
            ],
            'kinesthetic': [
                "Сложные интерактивные симуляции",
                "Практика доказательств на доске",
                "Решение нестандартных задач"
            ],
            'reading_writing': [
                "Научные статьи по теме",
                "Ведение математического дневника",
                "Анализ сложных решений"
            ]
        }
        
        resources = base_advanced_resources['common'] + base_advanced_resources[learning_style.value]
        
        # Специфические продвинутые ресурсы
        advanced_topic_specific = {
            'Параметры': [
                'Методы исследования функций с параметрами',
                'Графические методы решения параметрических задач'
            ],
            'Стереометрия': [
                'Сложные пространственные конструкции',
                'Методы координат в пространстве'
            ],
            'Производная': [
                'Приложения производной в физике',
                'Оптимизационные задачи повышенной сложности'
            ]
        }
        
        for key, additional_resources in advanced_topic_specific.items():
            if key.lower() in topic_name.lower():
                resources.extend(additional_resources)
        
        return resources

    def _get_personalized_approach_v2(self, user_data: UserData) -> str:
        """Улучшенный персонализированный подход"""
        score_gap = user_data.targetScore - user_data.currentScore
        available_time = user_data.availableHoursPerWeek
        
        approaches = []
        
        if score_gap > 30:
            approaches.append("Интенсивная фокусировка на критических пробелах")
        elif score_gap > 15:
            approaches.append("Сбалансированное развитие с акцентом на слабые области")
        else:
            approaches.append("Совершенствование и углубление знаний")
        
        if available_time < 8:
            approaches.append("Максимально эффективное использование ограниченного времени")
        elif available_time > 15:
            approaches.append("Глубокое погружение с расширенной практикой")
        
        if user_data.learningStyle == LearningStyle.VISUAL:
            approaches.append("Визуальное обучение с графиками и диаграммами")
        elif user_data.learningStyle == LearningStyle.KINESTHETIC:
            approaches.append("Практико-ориентированный подход с интерактивными заданиями")
        
        return ". ".join(approaches)

    def _get_personalized_resources_v2(self, user_data: UserData) -> List[Dict[str, Any]]:
        """Улучшенная система рекомендации ресурсов"""
        resources = []
        
        # Базовые ресурсы
        resources.append({
            'category': 'official',
            'items': ['Сборник ФИПИ 2024', 'Типовые экзаменационные варианты', 'Демоверсия ЕГЭ']
        })
        
        # Ресурсы по стилю обучения
        style_resources = self.learning_strategies[user_data.learningStyle]['resources']
        resources.append({
            'category': 'learning_style',
            'items': style_resources
        })
        
        # Тематические ресурсы для слабых областей
        weak_areas_resources = []
        for area in user_data.weakAreas[:3]:
            if user_data.currentScore > 70:
                area_resources = self._get_advanced_topic_resources(area, user_data.learningStyle)
            else:
                area_resources = self._get_topic_resources(area, user_data.learningStyle)
            weak_areas_resources.extend(area_resources[:2])  # Берем по 2 лучших ресурса
        
        resources.append({
            'category': 'weak_areas_focus',
            'items': list(set(weak_areas_resources))  # Убираем дубликаты
        })
        
        # Дополнительные ресурсы
        additional = ['EGE Trainer - онлайн тренажер', 'Мобильное приложение для повторения']
        if user_data.targetScore > 80:
            additional.append('Задачи олимпиадного уровня')
        
        resources.append({
            'category': 'additional',
            'items': additional
        })
        
        return resources

    def _generate_smart_milestones_v2(self, user_data: UserData, total_weeks: int) -> List[Dict[str, Any]]:
        """Умные контрольные точки с адаптацией"""
        milestones = []
        score_gap = user_data.targetScore - user_data.currentScore
        
        # Динамическое распределение вех
        checkpoints = [0.25, 0.5, 0.75, 0.9]
        
        for i, checkpoint in enumerate(checkpoints):
            week = max(i + 2, int(total_weeks * checkpoint))
            target_score = user_data.currentScore + score_gap * checkpoint
            
            milestone_types = ['foundation', 'progress', 'mastery', 'excellence']
            
            milestones.append({
                'week': week,
                'targetScore': int(target_score),
                'description': self._get_milestone_description(milestone_types[i], target_score),
                'type': milestone_types[i],
                'keyTopics': self._get_milestone_topics(user_data, checkpoint)
            })
        
        return milestones

    def _get_milestone_description(self, milestone_type: str, target_score: float) -> str:
        """Описание для контрольной точки"""
        descriptions = {
            'foundation': f'Освоение базовых тем и достижение уровня {int(target_score)} баллов',
            'progress': f'Уверенное решение задач средней сложности на {int(target_score)} баллов',
            'mastery': f'Решение сложных задач и стабильный результат {int(target_score)} баллов',
            'excellence': f'Экзаменационная готовность на уровне {int(target_score)} баллов'
        }
        return descriptions.get(milestone_type, 'Контрольная точка')

    def _get_milestone_topics(self, user_data: UserData, progress: float) -> List[str]:
        """Ключевые темы для контрольной точки"""
        if progress <= 0.25:
            return ['Базовые навыки', 'Простые уравнения', 'Геометрия начального уровня']
        elif progress <= 0.5:
            return ['Функции', 'Тригонометрия', 'Текстовые задачи']
        elif progress <= 0.75:
            return ['Производная', 'Стереометрия', 'Теория вероятностей']
        else:
            return ['Задачи с параметрами', 'Сложные уравнения', 'Оптимизационные задачи']

    def _estimate_score_progression(self, user_data: UserData, total_weeks: int) -> List[Dict[str, Any]]:
        """Оценка прогресса баллов по неделям"""
        progression = []
        current_score = user_data.currentScore
        target_score = user_data.targetScore
        weekly_improvement = (target_score - current_score) / total_weeks
        
        for week in range(total_weeks + 1):
            estimated_score = current_score + (weekly_improvement * week)
            # Добавляем случайную вариацию для реалистичности
            variation = np.random.normal(0, 2)
            estimated_score = max(current_score, min(target_score, estimated_score + variation))
            
            progression.append({
                'week': week,
                'estimatedScore': round(estimated_score, 1),
                'confidence': max(0.5, 0.8 - (week * 0.02))  # Уверенность снижается со временем
            })
        
        return progression

    def _get_student_level(self, current_score: float) -> str:
        """Определяет уровень ученика"""
        if current_score >= 80:
            return "продвинутый"
        elif current_score >= 60:
            return "средний"
        elif current_score >= 40:
            return "начинающий"
        else:
            return "начальный"

    def _generate_plan_analytics(self, schedule: Dict, weekly_plan: List, user_data: UserData, 
                               learning_gaps: Dict) -> Dict[str, Any]:
        """Генерация аналитики по плану"""
        total_hours = sum(topic['allocated_hours'] for topic in schedule.values())
        critical_topics_coverage = len([t for t in learning_gaps['critical'] if t in schedule])
        
        return {
            'planEfficiency': self._calculate_plan_efficiency(schedule, user_data),
            'coverageMetrics': {
                'criticalGapsCovered': f"{critical_topics_coverage}/{len(learning_gaps['critical'])}",
                'totalTopicsCovered': len(schedule),
                'totalHoursAllocated': total_hours
            },
            'difficultyDistribution': self._analyze_difficulty_distribution(schedule),
            'riskAssessment': self._assess_plan_risks(schedule, user_data),
            'successProbability': self._calculate_success_probability(user_data)
        }

    def _calculate_plan_efficiency(self, schedule: Dict, user_data: UserData) -> float:
        """Расчет эффективности плана"""
        total_priority = sum(topic['priority'] for topic in schedule.values())
        max_possible_priority = len(schedule) * 300  # Максимальный теоретический приоритет
        
        efficiency = total_priority / max_possible_priority if max_possible_priority > 0 else 0
        return min(1.0, efficiency * 1.2)  # Нормализуем до 0-1

    def _calculate_success_probability(self, user_data: UserData) -> float:
        """Расчет вероятности успеха"""
        base_probability = 0.5
        
        # Фактор разницы баллов
        score_gap = user_data.targetScore - user_data.currentScore
        if score_gap <= 10:
            base_probability += 0.3
        elif score_gap <= 20:
            base_probability += 0.2
        elif score_gap <= 30:
            base_probability += 0.1
        
        # Фактор времени
        exam_date = datetime.fromisoformat(user_data.examDate.replace('Z', '+00:00'))
        days_until_exam = (exam_date - datetime.now()).days
        if days_until_exam >= 90:
            base_probability += 0.2
        elif days_until_exam >= 60:
            base_probability += 0.1
        
        # Фактор мотивации
        base_probability += (user_data.motivationLevel - 5) * 0.03
        
        return min(0.95, max(0.3, base_probability))

    def _analyze_difficulty_distribution(self, schedule: Dict) -> Dict[str, int]:
        """Анализ распределения сложности тем"""
        distribution = {'easy': 0, 'medium': 0, 'hard': 0}
        
        for topic_name in schedule.keys():
            # Находим тему в базе знаний
            for category in EGE_MATH_TOPICS.values():
                for topic in category:
                    if topic['name'] == topic_name:
                        if topic['complexity'] <= 2:
                            distribution['easy'] += 1
                        elif topic['complexity'] <= 4:
                            distribution['medium'] += 1
                        else:
                            distribution['hard'] += 1
                        break
        
        return distribution

    def _assess_plan_risks(self, schedule: Dict, user_data: UserData) -> List[str]:
        """Оценка рисков плана"""
        risks = []
        
        if len(schedule) > 20:
            risks.append("Высокая нагрузка: много тем для изучения")
        
        if user_data.availableHoursPerWeek < 8:
            risks.append("Недостаточно времени для качественной подготовки")
        
        # Проверяем наличие сложных тем для начинающих
        if user_data.currentScore < 50:
            hard_topics = [t for t in schedule if any(
                topic['name'] == t and topic['complexity'] >= 4 
                for category in EGE_MATH_TOPICS.values() for topic in category
            )]
            if hard_topics:
                risks.append("Сложные темы могут быть трудны для освоения")
        
        return risks

    def generate_advanced_study_plan(self, user_data: UserData) -> Dict[str, Any]:
        """Основная функция генерации расширенного учебного плана"""
        logger.info(f"Генерация плана для пользователя {user_data.userId} (уровень: {user_data.currentScore})")
        
        exam_date = datetime.fromisoformat(user_data.examDate.replace('Z', '+00:00'))
        current_date = datetime.now()
        total_weeks = max(4, (exam_date - current_date).days // 7)
        total_hours = total_weeks * user_data.availableHoursPerWeek
        
        # Анализ данных пользователя
        learning_gaps = self.analyze_learning_gaps(user_data)
        
        # Генерация оптимизированного расписания
        schedule = self.optimize_topic_selection(user_data)
        
        # Создание недельного плана
        if user_data.currentScore > 70:
            weekly_plan = self.create_focused_weekly_plan(schedule, user_data)
            plan_type = "advanced_focused"
        else:
            weekly_plan = self.create_personalized_weekly_plan(schedule, user_data)
            plan_type = "personalized"
        
        # Аналитика и метрики
        analytics = self._generate_plan_analytics(schedule, weekly_plan, user_data, learning_gaps)
        
        return {
            'planId': f"plan_{user_data.userId}_{int(datetime.now().timestamp())}",
            'durationWeeks': total_weeks,
            'totalStudyHours': total_hours,
            'weeklySchedule': weekly_plan,
            'topicDistribution': schedule,
            'studyFocus': {
                'priorityTopics': learning_gaps['critical'][:5],
                'strongAreas': user_data.strongAreas,
                'learningGaps': learning_gaps,
                'recommendedApproach': self._get_personalized_approach_v2(user_data),
                'learningStrategy': self.learning_strategies[user_data.learningStyle],
                'planType': plan_type,
                'studentLevel': self._get_student_level(user_data.currentScore)
            },
            'resources': self._get_personalized_resources_v2(user_data),
            'milestones': self._generate_smart_milestones_v2(user_data, total_weeks),
            'analytics': analytics,
            'totalTopics': len(schedule),
            'averageHoursPerWeek': user_data.availableHoursPerWeek,
            'estimatedScoreProgress': self._estimate_score_progression(user_data, total_weeks)
        }

# Инициализация улучшенного генератора
advanced_generator = AdaptiveStudyPlanGenerator()

# API Endpoints
@app.post("/generate-plan", response_model=StudyPlanResponse)
async def generate_plan(user_data: UserData):
    """Генерирует расширенный персонализированный учебный план для ЕГЭ"""
    try:
        logger.info(f"🎯 Генерация улучшенного плана для пользователя {user_data.userId}")
        logger.info(f"📊 Данные: {user_data.currentScore} → {user_data.targetScore} баллов")
        logger.info(f"🎓 Стиль обучения: {user_data.learningStyle}")
        
        start_time = datetime.now()
        
        plan = advanced_generator.generate_advanced_study_plan(user_data)
        
        # Генерация рекомендаций
        recommendations = generate_smart_recommendations(user_data, plan)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        response = StudyPlanResponse(
            success=True,
            plan=plan,
            recommendations=recommendations,
            confidence=plan['analytics']['successProbability'],
            generatedBy="advanced_ml_system_v2",
            planId=plan['planId'],
            analytics={
                'processingTime': processing_time,
                'planComplexity': 'high',
                'personalizationLevel': 'advanced'
            }
        )
        
        logger.info(f"✅ План успешно сгенерирован: {plan['durationWeeks']} недель, "
                   f"{plan['totalTopics']} тем, уверенность: {response.confidence:.2f}")
        
        return response
        
    except Exception as e:
        logger.error(f"💥 Ошибка при генерации плана: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Ошибка генерации плана: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "Advanced EGE ML Generator v2",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/topics")
async def get_topics():
    """Возвращает все доступные темы"""
    return {
        "topics": EGE_MATH_TOPICS,
        "total_categories": len(EGE_MATH_TOPICS),
        "total_topics": sum(len(topics) for topics in EGE_MATH_TOPICS.values())
    }

def generate_smart_recommendations(user_data: UserData, plan: Dict) -> List[str]:
    """Генерация умных рекомендаций"""
    recommendations = []
    
    # Рекомендации по времени
    if user_data.availableHoursPerWeek < 10:
        recommendations.append("Увеличьте weekly study time до 10+ часов для лучших результатов")
    
    # Рекомендации по слабым областям
    if len(user_data.weakAreas) > 5:
        recommendations.append("Сфокусируйтесь на 3-5 самых критичных темах сначала")
    
    # Рекомендации по стилю обучения
    if user_data.learningStyle == LearningStyle.READING_WRITING:
        recommendations.append("Используйте ведение конспектов для лучшего запоминания")
    elif user_data.learningStyle == LearningStyle.VISUAL:
        recommendations.append("Создавайте графики и диаграммы для визуализации сложных концепций")
    
    # Общие рекомендации
    recommendations.extend([
        "Регулярно повторяйте пройденный материал",
        "Практикуйтесь в решении задач на время",
        "Анализируйте ошибки после каждого теста"
    ])
    
    return recommendations[:5]  # Возвращаем 5 самых важных рекомендаций

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")