"use client"

import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { File, Loader2, Pencil, Plus, X } from 'lucide-react'
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
  const [deletingId,setDeletingId] = useState<string|null>(null)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.post(`/api/courses/${courseId}/attachments`,values)
      toggleEdit()
      toast.success('Attachment updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
  }
  const onDelete = async(id:string)=>{
      try{
        setDeletingId(id)
        await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
          toast.success("Attachment deleted!")
          router.refresh()

      }catch{
          toast.error("Something went wrong!")
      }finally{
        setDeletingId(null)
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
          (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment)=>(
                <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'>
                  <File className='h-4 w-4 flex-shrink-0  mr-2 '/>
                  <p className='text-xs line-clamp-1'> {attachment.name }</p>
                  {deletingId ===attachment.id?(<div><Loader2 className='ml-auto h-4 w-4 animate-spin'/></div>):
                  (<Button onClick={()=>onDelete(attachment.id)} variant='destructive' className='ml-auto hover:opacity-75 transition'><X className='h-4 w-4'/></Button>)
                  }
                </div>
              ))}
            </div>
          
            ):
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