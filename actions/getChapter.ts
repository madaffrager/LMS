import { db } from "@/lib/db"
import { Attachment, Chapter } from "@prisma/client"
import { redirect } from "next/navigation"

interface GetChapterProps {
    userId:string
    courseId:string
    chapterId:string
}
export const getChapter = async ({userId,courseId,chapterId}:GetChapterProps)=>{
    try {
        const purchase = await db.purchase.findUnique({where:{userId_courseId:{userId,courseId}}})
        const course = await db.course.findUnique({where:{id:courseId, isPublished:true},select:{price:true}})
        const chapter = await db.chapter.findUnique({where:{id:chapterId, isPublished:true}})
        if(!chapter || !course){
            throw new Error("Chapter or course can't be found")
        }
        let muxData = null
        let attachments:Attachment[] = []
        let nextChapter:Chapter | null = null
        if(purchase || course.price ===0){
            attachments = await db.attachment.findMany({where:{courseId:courseId}})
        }
        if (chapter.isFree || purchase || course.price === 0) {
          muxData = await db.muxData.findUnique({
            where: { chapterId: chapterId },
          });
          nextChapter = await db.chapter.findFirst({
            where: {
              id: chapterId,
              courseId: courseId,
              position: { gt: chapter.position },
              isPublished: true,
            },
            orderBy: { position: 'asc' },
          });
        }
        const userProgress = await db.userProgress.findUnique({where:{userId_chapterId:{userId,chapterId}}})
        return {chapter,course,muxData,attachments,nextChapter,userProgress,purchase}
    } catch (error) {
      console.log('[GET_CHAPTER] ', error);
      return {chapter:null,course:null,muxData:null,attachments:[],nextChapter:null,userProgress:null,purchase:null}
    }
}