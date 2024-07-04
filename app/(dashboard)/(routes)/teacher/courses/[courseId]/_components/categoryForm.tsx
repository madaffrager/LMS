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
import { Course } from '@prisma/client'
import { Combobox } from '@/components/ui/combobox'
interface CategoryFormProps{
    initialData:Course,
    courseId:string,
    options:{label : string, value : string}[]
}
export const CategoryForm = ({initialData,courseId,options}:CategoryFormProps) => {
  const formSchema = z.object({
  categoryId:z.string().min(1)
})
  const [isEditing,setEditing] = useState(false)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues:{categoryId:initialData.categoryId || ''}
  })
  const {isSubmitting, isValid} = form.formState
  const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}`,values)
      toggleEdit()
      toast.success('Category updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
  } 
  const selectedOption = options.find(category=>category.value===initialData.categoryId)
  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
          Course Category
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(initialData.categoryId?(<Pencil className='h-4 w-4 mr-2 cursor-pointer'/>):(<Plus className='h-4 w-4 mr-2 cursor-pointer'/>))}
          </Button>
        </div>
        {!isEditing ? ((initialData.categoryId && initialData.categoryId!=='')?(<p className='text-sm mt-2'>{selectedOption?.label}</p>):(<p className='text-sm italic mt-2'>No category assigned!</p>)):(
          <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 mt-8'
        >
           <FormField
            control={form.control}
            name='categoryId'
            
            render={({field})=>(
              <FormItem>
                <FormControl>
                    <Combobox options={[...options]} onChange={field.onChange} value={field.value}/>
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