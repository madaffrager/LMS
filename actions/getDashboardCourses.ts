import { db } from '@/lib/db';
import { Category, Chapter, Course } from '@prisma/client';
import { getProgress } from './getProgress';

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string,
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: { userId: userId },
      select: {
        course: {
          include: {
            category: true,
            chapters: { where: { isPublished: true } },
          },
        },
      },
    });

    const freeCourses = await db.course.findMany({
      where: {
        isPublished: true,
        OR: [{ price: null }, { price: 0 }],
      },
      include: {
        category: true,
        chapters: { where: { isPublished: true } },
      },
    });

    const purchasedCoursesList = purchasedCourses.map(
      (purchase) => purchase.course,
    );

    const courses = [...purchasedCoursesList, ...freeCourses];

    // Add progress to each course
    const coursesWithProgress = (await Promise.all(
      courses.map(async (course) => {
        const progress = await getProgress(userId, course.id);
        return { ...course, progress };
      }),
    )) as CourseWithProgressWithCategory[];
    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100,
    );
    const coursesInProgress = coursesWithProgress.filter(
      (course) => (course.progress??0)< 100,
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
