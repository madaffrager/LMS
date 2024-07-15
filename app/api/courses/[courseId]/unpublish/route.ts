import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId } = params;
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!course) {
      return new NextResponse(
        'Not Found, course with ID ' + courseId + ' is missing!',
        { status: 404 },
      );
    }
    const unPublishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: false },
    });
    return NextResponse.json(unPublishedCourse);
  } catch (err) {
    console.log('[COURSE_UNPUBLISH]: ', err);
    return new NextResponse('Internal Error in [COURSE_UNPUBLISH]', {
      status: 500,
    });
  }
}
