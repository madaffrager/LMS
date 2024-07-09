"use client"

import * as z from 'zod'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/fileUpload'
interface ImageFormProps{
    initialData:Course,
    courseId:string
}
export const ImageForm = ({initialData,courseId}:ImageFormProps) => {
  const formSchema = z.object({
  imageUrl:z.string().min(1,{message:'Image is required '})
  })
  const [isEditing,setEditing] = useState(false)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}`,values)
      toggleEdit()
      toast.success('image updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
  }
  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
          Course Image
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(initialData.imageUrl?(<Pencil className='h-4 w-4 mr-2 cursor-pointer'/>):(<Plus className='h-4 w-4 mr-2 cursor-pointer'/>))}
          </Button>
        </div>
        {!isEditing ? (
          initialData.imageUrl?
          (<div className='relative aspect-video mt-2'>
            <Image className='object-cover rounded-md' src={initialData.imageUrl} alt={`Course image of ${initialData.title}`} fill/>
          </div>)
          :
          (<div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'><ImageIcon className='h-10 w-10 text-slate-500'/></div>))
          :
          (
          <div>
            <FileUpload onChange={(url)=>{
            if(url){
              onSubmit({imageUrl:url})
            }
          }} endpoint='courseImage' />
          <div className='text-xs text-muted-foreground mt-4'>16:9 aspect ratio recommended</div>
          </div>
        )}
    </div>
  )
} 