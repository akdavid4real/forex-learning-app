import type { CourseModule, LessonProgress } from './services/forex-api';

export function isLessonComplete(progress: LessonProgress[], lessonId: string) {
  return progress.some((item) => item.lesson_id === lessonId && Boolean(item.completed_at));
}

export function getModuleCompletion(module: CourseModule, progress: LessonProgress[]) {
  const lessons = module.lessons ?? [];
  if (!lessons.length) return 0;
  const completed = lessons.filter((lesson) => isLessonComplete(progress, lesson.id)).length;
  return Math.round((completed / lessons.length) * 100);
}

export function getNextLesson(modules: CourseModule[], progress: LessonProgress[]) {
  for (const module of modules) {
    if (module.unlocked === false) continue;
    for (const lesson of module.lessons ?? []) {
      if (!isLessonComplete(progress, lesson.id)) return lesson;
    }
  }
  return modules.flatMap((module) => module.lessons ?? [])[0] ?? null;
}
