import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {db} from '@/lib/db'
export async function PATCH(req:Request, {params}:{params:{courseId:string,chapterId:string}}){
     try{
        const {userId} = auth()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        const {courseId, chapterId} = params
        const {isPublished, ...values} = await req.json()
        const ownCourse = db.course.findUnique({where:{id:courseId,userId}})
        if(!ownCourse){
            return new NextResponse('Unauthorized',{status:401})
        }
        const chapter = await db.chapter.update({where:{id:chapterId, courseId:courseId},data:{...values}},)
        return NextResponse.json(chapter)
     }catch(err){
        console.log('[COURSE_CHAPTERID]: ',err)
        return new NextResponse("Internal   Error in [COURSE_CHAPTERID]", { status: 500 })
     }
}