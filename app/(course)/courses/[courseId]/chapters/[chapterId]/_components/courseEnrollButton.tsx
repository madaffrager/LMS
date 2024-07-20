'use client'

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
interface CourseEnrollButtonProps{
    courseId:string
    price:number
}
export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading,setLoading] = useState(false)
  const onClick = async()=>{
    try {
      setLoading(true)
      const response = await axios.post(`/api/courses/${courseId}/checkout`)
      window.location.assign(response.data.url)
    } catch {
      toast.error('Something went wrong! ')
    }finally{
      setLoading(false)
    }
  }
  return price > 0 &&
     (
    <Button onClick={onClick} disabled={isLoading} size="sm" className="w-full md:w-auto">
      Enroll Now For {formatPrice(price)}
    </Button>
  );
};

