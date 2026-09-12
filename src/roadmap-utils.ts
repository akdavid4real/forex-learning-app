import type { CourseModule, LearningProgress } from './services/forex-api';

export function isLessonComplete(progress: LearningProgress, lessonId: string) {
  return progress.lessons.some((item) => item.lesson_id === lessonId && Boolean(item.completed_at));
}

export function isModuleUnlocked(module: CourseModule, progress: LearningProgress) {
  return module.position === 1 || progress.modules.some((item) => item.module_id === module.id);
}

export function getModuleCompletion(module: CourseModule, progress: LearningProgress) {
  const lessons = module.lessons ?? [];
  if (!lessons.length) return 0;
  const completed = lessons.filter((lesson) => isLessonComplete(progress, lesson.id)).length;
  return Math.round((completed / lessons.length) * 100);
}

export function getNextLesson(modules: CourseModule[], progress: LearningProgress) {
  for (const module of modules) {
    if (!isModuleUnlocked(module, progress)) continue;
    for (const lesson of module.lessons ?? []) {
      if (!isLessonComplete(progress, lesson.id)) return lesson;
    }
  }
  return modules.flatMap((module) => module.lessons ?? [])[0] ?? null;
}
