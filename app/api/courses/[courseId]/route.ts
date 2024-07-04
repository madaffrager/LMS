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
        const values = await req.json()
        const course = await db.course.update({where:{id:courseId, userId},data:{...values}},)
        return NextResponse.json(course)
     }catch(err){
        console.log('[COURSEID]: ',err)
        return new NextResponse("Internal Error in [COURSEID]", { status: 500 })
     }
}