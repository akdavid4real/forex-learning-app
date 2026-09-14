import type { CourseRoadmap, LearningProgress, UserProfile } from './services/forex-api';

export const demoProfile: UserProfile = {
  id: 'demo-user', display_name: 'Demo Learner', avatar_url: null, xp: 35, current_streak: 2, longest_streak: 4, access_status: 'active',
};

export const demoCourse: CourseRoadmap = {
  id: 'demo-forex-foundations',
  slug: 'forex-foundations',
  title: 'Forex Foundations',
  description: 'Build a practical understanding of currency markets, risk and disciplined trading.',
  modules: [
    {
      id: 'demo-module-1', course_id: 'demo-forex-foundations', title: 'Market Foundations', position: 1,
      description: 'Understand pairs, pips, lots and how the market is quoted.',
      lessons: [
        { id: 'demo-lesson-1', module_id: 'demo-module-1', title: 'How currency pairs work', position: 1, estimated_minutes: 6 },
        { id: 'demo-lesson-2', module_id: 'demo-module-1', title: 'Pips, lots and spread', position: 2, estimated_minutes: 8 },
      ],
      quizzes: [{ id: 'demo-quiz-1', module_id: 'demo-module-1', title: 'Market Foundations Check', passing_score: 70, xp_reward: 20 }],
    },
    {
      id: 'demo-module-2', course_id: 'demo-forex-foundations', title: 'Risk Before Reward', position: 2,
      description: 'Learn position sizing, stop loss and risk-to-reward discipline.',
      lessons: [{ id: 'demo-lesson-3', module_id: 'demo-module-2', title: 'Risk management essentials', position: 1, estimated_minutes: 9 }],
      quizzes: [{ id: 'demo-quiz-2', module_id: 'demo-module-2', title: 'Risk Check', passing_score: 75, xp_reward: 25 }],
    },
  ],
};

export const demoProgress: LearningProgress = {
  lessons: [], modules: [{ module_id: 'demo-module-1', unlocked_at: new Date().toISOString(), completed_at: null }], quizzes: [],
};
