"use client"

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter } from '@prisma/client'
import { Editor } from '@/components/editor'
import { Preview } from '@/components/preview'
interface ChapterDescriptionFormProps{
    initialData:Chapter,
    courseId:string
    chapterId:string
}
export const ChapterDescriptionForm = ({initialData,courseId,chapterId}:ChapterDescriptionFormProps) => {
  const formSchema = z.object({
  description:z.string().min(1)
})
  const [isEditing,setEditing] = useState(false)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues:{description:''}
  })
  const {isSubmitting, isValid} = form.formState
const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
      toggleEdit()
      toast.success('Chapter updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
}
  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
          Chapter Description
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(initialData.description?(<Pencil className='h-4 w-4 mr-2 cursor-pointer'/>):(<Plus className='h-4 w-4 mr-2 cursor-pointer'/>))}
          </Button>
        </div>
        {!isEditing ? 
          (initialData.description?
            (<div className='text-sm mt-2 text-justify p-2'><Preview value={initialData.description}/></div>)
            :
            (<p className='text-sm italic mt-2'>No description</p>))
          :
          (
          <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 mt-8'
        >
           <FormField
            control={form.control}
            name='description'
            
            render={({field})=>(
              <FormItem>
                <FormControl>
                  <Editor {...field}/>  
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
           />
           <div className='flex items-center gap-x-2'>
           <Button type='submit' disabled={!isValid || isSubmitting}>Save</Button>
           </div>
        </form>
      </Form>
        )}
    </div>
  )
} 