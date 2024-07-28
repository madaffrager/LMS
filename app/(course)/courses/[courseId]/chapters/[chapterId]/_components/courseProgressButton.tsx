'use client'

import { Button } from "@/components/ui/button"
import axios from "axios"
import { CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface CourseProgressProps{
    chapterId:string
    courseId:string
    nextChapterId?:string
    isCompleted?:boolean
}
export const CourseProgressButton = ({chapterId,courseId,nextChapterId,isCompleted}: CourseProgressProps) => {
    const Icon = isCompleted? XCircle:CheckCircle
    const router= useRouter()
    const [isLoading,setLoading] = useState(false)
    const onClick = async () =>{
        try{
           setLoading(true)
           await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
            isCompleted: !isCompleted 
           })
           if(!isCompleted && nextChapterId){
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
           }
           toast.success('Progress updated!')
           router.refresh()
        }catch{
            toast.error('Something went wrong!')
        }finally{
            setLoading(false)
        }
    }
  return <Button
         onClick={onClick}
         disabled={isLoading}
         type="button"
         variant={isCompleted?'outline':'success'}
         className="w-full md:w-auto"
         >{isCompleted? 'Not completed' : 'Mark as completed'}
            <Icon className="h-4 w-4 ml-2"/>
         </Button>;
};

