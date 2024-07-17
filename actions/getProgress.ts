import { db } from "@/lib/db"

export const getProgress =  async(userId:string,courseId:string):Promise<number>=>{
    try{
        const publishedChapters = await db.chapter.findMany({where:{courseId:courseId,isPublished:true},select:{id:true}})
        const publishedChaptersIds = publishedChapters.map((chapter)=>chapter.id)
        const validCompletedChapters = await db.userProgress.count({where:{isCompleted:true,userId:userId, chapterId:{in:publishedChaptersIds}}})
        const completePercent = (validCompletedChapters / publishedChaptersIds.length)*100
        return completePercent 
    }catch(error){
        console.log('[GET_PROGRESS] ',error)
        return 0
    }
}