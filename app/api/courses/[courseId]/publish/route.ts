import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {db} from '@/lib/db'
export async function PATCH(req:Request, {params}:{params:{courseId:string}}){
     try{
        const {userId} = auth()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        const {courseId} = params
        const course = await db.course.findUnique({
          where: { id: courseId, userId },
          include: { chapters: { include: { muxData: true } } },
        });
        if (!course) {
          return new NextResponse(
            'Not Found, course with ID ' + courseId + ' is missing!',
            { status: 404 },
          );
        }
        const hasPublishedChapter = course?.chapters.some((chapter)=>chapter.isPublished)
        if(!course.title || !course.description  || !hasPublishedChapter || !course.imageUrl || !course.categoryId){
                   return new NextResponse(
                     'Missing required fields for course ' +
                       courseId +
                       ' in [COURSE_PUBLISH]',
                     { status: 401 },
                   );
        }
        const publishedCourse = await db.course.update({where:{id:courseId, userId},data:{isPublished:true}})
        return NextResponse.json(publishedCourse)
     }catch(err){
        console.log('[COURSE_PUBLISH]: ', err);
        return new NextResponse('Internal Error in [COURSE_PUBLISH]', {
          status: 500,
        });
     }
}