"use client"

import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Attachment, Course } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/fileUpload'
interface AttachmentFormProps{
    initialData:Course & {attachments:Attachment[]},
    courseId:string
}
export const AttachmentForm = ({initialData,courseId}:AttachmentFormProps) => {
  const formSchema = z.object({
  url:z.string().min(1)
  })
  const [isEditing,setEditing] = useState(false)
  const [deletingId,setDeletingId] = useState(null)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.post(`/api/courses/${courseId}/attachments`,values)
      toggleEdit()
      toast.success('Description updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
  }
  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
          Course Attachments
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(<Plus className='h-4 w-4 mr-2 cursor-pointer'/>)}
          </Button>
        </div>
        {!isEditing ?           
          initialData.attachments.length===0?(<p className='text-sm mt-2 text-slate-500 italic '>No attachments yet</p>):
          (<div></div>):
          (
          <div>
            <FileUpload onChange={(url)=>{
            if(url){
              onSubmit({url:url})
            }
          }} endpoint='courseAttachment' />
          <div className='text-xs text-muted-foreground mt-4'>Add all the needed resources to complete this courses</div>
          </div>
        )}
    </div>
  )
} 