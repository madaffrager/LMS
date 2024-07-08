import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {db} from '@/lib/db'
import { Chapter } from "@prisma/client"
export async function POST(req:Request, {params} : {params:{courseId:string}}){
     try{
        const {userId} = auth()
        const {title} = await req.json()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        const courseOwner =  await db.course.findUnique({where:{id:params.courseId,userId:userId}})
        if(!courseOwner){
            return new NextResponse('unauthorized',{status:401})
        }
        const lastChapter = await db.chapter.findFirst({where:{
            courseId:params.courseId
        },orderBy:{position:"desc"}},
        )
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        const chapter = await db.chapter.create({data:{title,courseId:params.courseId,position:newPosition}})
        return NextResponse.json(chapter)
     }catch(err){
        console.log('[CHAPTERS]: ',err)
        return new NextResponse("Internal Error in [CHAPTERS] ", { status: 500 })
     }
}