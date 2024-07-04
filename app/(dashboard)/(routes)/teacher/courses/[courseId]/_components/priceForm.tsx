"use client"

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
 import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'
import { formatPrice } from '@/lib/format'
interface PriceFormProps{
    initialData:Course,
    courseId:string
}
export const PriceForm = ({initialData,courseId}:PriceFormProps) => {
  const formSchema = z.object({
  price:z.coerce.number( )
})
  const [isEditing,setEditing] = useState(false)
  const toggleEdit = ()=>setEditing((current)=>!current)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues:{price:initialData.price||undefined}
  })
  const {isSubmitting, isValid} = form.formState
const onSubmit = async(values: z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}`,values)
      toggleEdit()
      toast.success('Price updated!')
      router.refresh()
    }catch{
      toast.error('Something went wrong!')
    }
}
  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
          Course Price (MAD)
          <Button onClick={toggleEdit} variant='ghost'>
            {isEditing ? (<>Cancel</>):(initialData.price?(<Pencil className='h-4 w-4 mr-2 cursor-pointer'/>):(<Plus className='h-4 w-4 mr-2 cursor-pointer'/>))}
          </Button>
        </div>
        {!isEditing ? (initialData.price?(<p className='text-sm mt-2 text-justify p-2'>{formatPrice(initialData.price)}</p>):(<p className='text-sm italic mt-2'>FREE</p>)):(
          <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 mt-8'
        >
           <FormField
            control={form.control}
            name='price'
            
            render={({field})=>(
              <FormItem>
                <FormControl>
                  <Input type='number' step='0.01' disabled={isSubmitting} placeholder='e.g : 9.99' {...field}/>  
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