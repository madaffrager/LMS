"use client"

import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Pencil, Plus, Video } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, MuxData } from '@prisma/client'
import MuxPlayer from '@mux/mux-player-react'
import { FileUpload } from '@/components/fileUpload'
interface ChapterVideoFormProps{
    initialData:Chapter & {muxData?:MuxData | null},
    courseId:string,
    chapterId:string
}
export const ChapterVideoForm = ({initialData, courseId, chapterId}:ChapterVideoFormProps) => {
  const formSchema = z.object({
  videoUrl:z.string().min(1)
  })
  const [isEditing,setEditing] = useState(false)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
      toggleEdit()
      toast.success('Chapter video updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
  }
  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
          Chapter Video
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(initialData.videoUrl?(<Pencil className='h-4 w-4 mr-2 cursor-pointer'/>):(<Plus className='h-4 w-4 mr-2 cursor-pointer'/>))}
          </Button>
        </div>
        {!isEditing ? (
          initialData.videoUrl?
          (<div className='relative aspect-video mt-2'>
            <MuxPlayer playbackId={initialData.muxData?.playbackId || ""}/>
          </div>)
          :
          (<div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'><Video className='h-10 w-10 text-slate-500'/></div>))
          :
          (
          <div>
            <FileUpload onChange={(url)=>{
            if(url){
              onSubmit({videoUrl:url})
            }
          }} endpoint='chapterVideo' />
          <div className='text-xs text-muted-foreground mt-4'>Upload the video of the chapter</div>
          </div>
        )}
        {initialData.videoUrl && !isEditing && <div className='text-xs text-muted-foreground mt-2'>Videos can take a few minutes to process, Refresh the page if the video does not appear.</div>}
    </div>
  )
} 