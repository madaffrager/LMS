"use client"

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
 import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
interface TitleFormProps{
    initialData:{title:string},
    courseId:string
}
export const TitleForm = ({initialData,courseId}:TitleFormProps) => {
  const formSchema = z.object({
  title:z.string().min(1,{message:'Title is required '}).refine((value)=>value!==initialData.title,{ message:
                "The title must be different",
            })
})
  const [isEditing,setEditing] = useState(false)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues:{title:''}
  })
  const {isSubmitting, isValid} = form.formState
const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}`,values)
      toggleEdit()
      toast.success('Title updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
}
  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
          Course Title
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(<Pencil className='h-4 w-4 mr-2 cursor-pointer'/>)}
          </Button>
        </div>
        {!isEditing ? (<p className='text-sm mt-2'>{initialData.title}</p>):(
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
                  <Input disabled={isSubmitting} placeholder='e.g : Advanced Machine Learning' {...field}/>  
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