import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {db} from '@/lib/db'
import Mux from "@mux/mux-node";

const Video = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'],
  tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } },
) {
   try {
     const { userId } = auth();
     if (!userId) {
       return new NextResponse('Unauthorized', { status: 401 });
     }
     const { courseId } = params;
     const course = await db.course.findUnique({where:{id:courseId, userId},include:{chapters:{include:{muxData:true}}}})
     if(!course){
      return new NextResponse('Course with id '+courseId+' was Not Found', {status:404})
     }
     for(let chapter of course.chapters){
        if(chapter.muxData?.assetId){
            await Video.video.assets.delete(chapter.muxData?.assetId);
        }
     }
     const deletedCourse = await db.course.delete({where:{id:courseId, userId}})
     return NextResponse.json(deletedCourse)
   } catch (err) {
     console.log('[COURSEID_DELETE]: ', err);
     return new NextResponse('Internal Error in [COURSEID_DELETE]', {
       status: 500,
     });
   }
}

export async function PATCH(req:Request, {params}:{params:{courseId:string}}){
     try{
        const {userId} = auth()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        const {courseId} = params
        const values = await req.json()
        const course = await db.course.update({where:{id:courseId, userId},data:{...values}},)
        return NextResponse.json(course)
     }catch(err){
        console.log('[COURSEID_PATCH]: ',err)
        return new NextResponse('Internal Error in [COURSEID_PATCH]', {
          status: 500,
        });
     }
}