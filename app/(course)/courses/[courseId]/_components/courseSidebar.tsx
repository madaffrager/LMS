import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation"
import { CourseSidebarItem } from "./courseSidebarItem"

interface CourseSidebarProps{
    course:Course & {chapters:(Chapter & {userProgress:UserProgress[]|null })[]},
    progressCount:number
}

export const CourseSidebar = async({course,progressCount}:CourseSidebarProps) => {
    const {userId} = auth()
    if(!userId){
        return redirect('/')
    }
    const purchase = await db.purchase.findUnique({where:{userId_courseId:{userId,courseId:course.id}}})
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto no-scrollbar shadow-sm">
        <div className="p-8 flex flex-col border-b">
            <h1 className="font-semibold">{course.title}</h1>
        </div>
        <div className="flex flex-col w-full">
            {course.chapters.map((item)=>(
            <CourseSidebarItem
             key={item.id}
             id={item.id}
             label={item.title}
             isCompleted={!!item.userProgress?.[0]?.isCompleted}
             courseId={course.id}
             isLocked={!item.isFree && !purchase}
            />))}
        </div>
    </div>
  )
}

