import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const progress = await db.userProgress.findUnique({where:{userId_chapterId:{userId, chapterId:params.chapterId}}})
    if (!progress) {
      await db.userProgress.create({
        data: { userId, chapterId: params.chapterId, isCompleted },
      });
    } else {
      await db.userProgress.update({
              where: {
                userId_chapterId: {
                  userId: userId,
                  chapterId: params.chapterId,
                },
              },
              data: { isCompleted: isCompleted },
            });
    }
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
