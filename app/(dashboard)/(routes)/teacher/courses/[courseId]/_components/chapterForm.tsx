"use client"

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { ChaptersList } from './chaptersList'
import { Loader2, PlusCircle } from 'lucide-react'

interface ChapterFormProps{
    initialData:Course & {chapters:Chapter[]},
    courseId:string
}
export const ChapterForm = ({initialData,courseId}:ChapterFormProps) => {
  const formSchema = z.object({
    title:z.string().min(1),
  })
  const [isCreating,setCreating] = useState(false)
  const [isUpdating,setUpdating] = useState(false)
  const toggleCreating = ()=>{
    setCreating((current)=>!current)
  }
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues: {title:''}
  })
  const {isSubmitting, isValid} = form.formState
const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.post(`/api/courses/${courseId}/chapters`,values)
      toast.success('Chapter created!')
      toggleCreating()
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
}
const onReorder = async(updateData:{id:string, position:number}[])=>{
  try{
    setUpdating(true)
    await axios.put(`/api/courses/${courseId}/chapters/reorder`,
    {list:updateData})
    toast.success('Chapters reordered !')
    router.refresh()
  }
  catch{
    toast.error('Something went wrong!')
  }
  finally{
    setUpdating(false)
  }
}
const onEdit = (id:string)=>{
  router.push(`/teacher/courses/${courseId}/chapters/${id}`)
}
  return (
    <div className='relative mt-6 bg-slate-100 rounded-md p-4'>
      {isUpdating && (<div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
        <Loader2 className='animate-spin h-6 w-6 text-sky-700'/>
      </div>)}
        <div className='font-medium flex items-center justify-between'>
          Course chapters
          <Button onClick={toggleCreating} variant='ghost'>
            {isCreating ? <>Cancel</>:<PlusCircle className='h-4 w-4 mr-2 cursor-pointer'/>}
          </Button>
        </div>
        {!isCreating ? 
          (
            initialData.chapters.length?
            (<div>
             <ChaptersList
             onEdit={onEdit}
             onReorder={onReorder}
             items={initialData.chapters || []}
             /> 
             <div className='text-xs text-muted-foreground mt-4'>Drag and drop to reorder chapters</div>
            </div>)
            :
            (<p className='text-sm italic mt-2'>No Chapters</p>)
          )
          :
          (
          <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 mt-8'
        >
           <FormField
            control={form.control}
            name='title'
            
            render={({field})=>(
              <FormItem>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder='e.g : Introduction to the course' {...field}/>  
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
           />
           <Button type='submit' disabled={!isValid || isSubmitting}>Create</Button>
        </form>
      </Form>
        )}
    </div>
  )
} 