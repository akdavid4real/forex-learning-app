import type { Course, Lesson, Quiz, UserProfile } from './services/forex-api';

export const demoCourse: Course = {
  id: 'demo-forex-foundations',
  slug: 'forex-foundations',
  title: 'Forex Foundations',
  description: 'A practical beginner path covering currency pairs, market structure, risk and execution basics.',
};

export const demoProfile: UserProfile = {
  id: 'demo-user',
  avatar_url: null,
  display_name: 'Forex Learner',
  current_streak: 1,
  longest_streak: 1,
  xp: 0,
};

export const demoLesson: Lesson = {
  id: 'demo-currency-pairs',
  module_id: 'demo-module-1',
  position: 1,
  title: 'Understanding Currency Pairs',
  estimated_minutes: 8,
  content: {
    summary: 'Learn how base and quote currencies work, what a pair price means, and how to read a simple forex quote.',
  },
};

export const demoQuiz: Quiz = {
  id: 'demo-quiz-1',
  title: 'Currency Pairs Check',
  passing_score: 70,
  quiz_questions: [
    {
      id: 'q1',
      position: 1,
      prompt: 'In EUR/USD, which currency is the base currency?',
      answers: ['EUR', 'USD', 'Both', 'Neither'],
      explanation: 'The first currency listed in a pair is the base currency.',
    },
  ],
};
