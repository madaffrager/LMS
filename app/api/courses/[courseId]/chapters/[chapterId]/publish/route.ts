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
        const chapter = await db.chapter.findUnique({where:{courseId:courseId,id:chapterId}})
        const muxData = await db.muxData.findUnique({where:{chapterId:chapterId}})
        if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl){
            return new NextResponse('Missing required fields in chapter',{status:400})
        }
        const publishedChapter = await db.chapter.update({where:{id:chapterId, courseId:courseId},data:{isPublished:true}})
        return NextResponse.json(publishedChapter)
     }catch(err){
        console.log('[CHAPTER_PUBLISH]: ',err)
        return new NextResponse("Internal Error in [CHAPTER_PUBLISH]", { status: 500 })
     }
}