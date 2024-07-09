import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {db} from '@/lib/db'
export async function PATCH(req:Request, {params}:{params:{courseId:string, chapterId:string}}){
     try{
        const {userId} = auth()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        const {courseId, chapterId} = params
        const ownCourse = await db.course.findUnique({where:{id:courseId,userId}})
        if(!ownCourse){
            return new NextResponse('Unauthorized',{status:401})
        }
        const unpublishedChapter = await db.chapter.update({where:{id:chapterId, courseId:courseId,isPublished:true},data:{isPublished:false}})
        const publishedChaptersInCourse = await db.chapter.findMany({where:{courseId:courseId,isPublished:true}})
        if(!publishedChaptersInCourse){
            await db.course.update({where:{id:courseId},data:{isPublished:false}})
        }
        return NextResponse.json(unpublishedChapter)
     }catch(err){
        console.log('[CHAPTER_UNPUBLISH]: ',err)
        return new NextResponse("Internal Error in [CHAPTER_UNPUBLISH]", { status: 500 })
     }
}