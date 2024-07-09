import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {db} from '@/lib/db'
import Mux from '@mux/mux-node';
import { PlaybackIDs } from "@mux/mux-node/resources/video/playback-ids.mjs";

const Video = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'],
  tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

export async function DELETE(req:Request,{params}:{params:{chapterId:string, courseId:string}}){
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
       const chapter =  await db.chapter.findUnique({where:{id:chapterId,courseId:courseId}})
       if(!chapter){
                return new NextResponse("Chapter not found", { status: 404 })
       }
       if(chapter.videoUrl){
         const existingMuxData = await db.muxData.findFirst({where:{chapterId:chapterId}})
         if(existingMuxData){
            await Video.video.assets.delete(existingMuxData.assetId);
            await db.muxData.delete({where:{id:existingMuxData.id}})
         }
        }
       const deletedChapter = await db.chapter.delete({where:{id:chapterId}}) 
       const publishedChaptersInCourse = await db.chapter.findMany({where:{courseId:courseId, isPublished:true }})
       if(!publishedChaptersInCourse.length){
            await db.course.update({where:{id:courseId},data:{isPublished:false}})
       }
       return NextResponse.json(deletedChapter)
    }catch(err){
        console.log('[COURSE_CHAPTERID]: ',err)
        return new NextResponse("Internal   Error in [COURSE_CHAPTERID]", { status: 500 })
     }
}
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
        if(chapter.videoUrl){
            const existingMuxData = await db.muxData.findFirst({where:{chapterId:chapterId}})
            if(existingMuxData){
                await Video.delete(existingMuxData.assetId)
                await db.muxData.delete({where:{id:existingMuxData.id, }})
            }
            const asset = await Video.video.assets.create({input : [{url:chapter.videoUrl}],playback_policy: ['public'],test:false})
            await db.muxData.create({data:{chapterId:chapterId, assetId:asset.id,playbackId:asset.playback_ids?.[0]?.id}})
        }
        return NextResponse.json(chapter)
     }catch(err){
        console.log('[COURSE_CHAPTERID]: ',err)
        return new NextResponse("Internal   Error in [COURSE_CHAPTERID]", { status: 500 })
     }
}
