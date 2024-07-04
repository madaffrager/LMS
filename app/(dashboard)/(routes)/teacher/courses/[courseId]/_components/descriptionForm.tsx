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
import { Textarea } from '@/components/ui/textarea'
interface DescriptionFormProps{
    initialData:{description:string},
    courseId:string
}
export const DescriptionForm = ({initialData,courseId}:DescriptionFormProps) => {
  const formSchema = z.object({
  description:z.string().min(1,{message:'Description is required '})
})
  const [isEditing,setEditing] = useState(false)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues:initialData
  })
  const {isSubmitting, isValid} = form.formState
const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}`,values)
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
          Course Description
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(<Pencil className='h-4 w-4 mr-2 cursor-pointer'/>)}
          </Button>
        </div>
        {!isEditing ? (initialData.description===''?(<p className='text-sm mt-2'>{initialData.description}</p>):(<p className='text-sm italic mt-2'>No description</p>)):(
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
                  <Textarea disabled={isSubmitting} placeholder='e.g : This course is about ...' {...field}/>  
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