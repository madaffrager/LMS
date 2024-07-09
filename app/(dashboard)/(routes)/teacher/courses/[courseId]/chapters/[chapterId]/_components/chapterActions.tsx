"use client"

import { ConfirmModal } from "@/components/modals/confirmModal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface ChapterActionsProps{
    isPublished:boolean,
    courseId:string
    chapterId:string
    disabled:boolean
}
const ChapterActions = ({disabled,isPublished,courseId,chapterId}:ChapterActionsProps)=>{
    const [isLoading,setLoading] = useState(false)
    const router= useRouter()
    const onClick = async () => {
       try{
        setLoading(true)
        if(isPublished){
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                    toast.success('Chapter unpublished!')
                    
        }
        else{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                    toast.success('Chapter Published!')
        }
        router.refresh()
       }catch{
        toast.error('Something went wrong!')
       }finally{
        setLoading(false)
       } 
    }
    const onDelete = async()=>{
       try{
        setLoading(true)
        await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
        toast.success('Chapter deleted!')
        router.push(`/teacher/courses/${courseId}`)
       }catch{
        toast.error('Something went wrong!')
       }finally{
        setLoading(false)
       }
    }
    return (<div className="flex items-center gap-x-2">
        
                <ConfirmModal onConfirm={() => { } } >
                    <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant='outline'
            size='sm'
        >
            {isPublished? 'Unpublish' : 'Publish'}
        </Button>
                </ConfirmModal>

        <ConfirmModal onConfirm={onDelete} >
            <Button size='sm' variant='destructive' disabled={isLoading}>
            <Trash className="h-4 w-4"/>
        </Button>
        </ConfirmModal>
        

    </div>)
}
export default ChapterActions