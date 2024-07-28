"use client"

import { ConfirmModal } from "@/components/modals/confirmModal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface CourseActionsProps{
    isPublished:boolean,
    courseId:string
    disabled:boolean
}
const CourseActions = ({
  disabled,
  isPublished,
  courseId,
}: CourseActionsProps) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/unpublish`,
        );
        toast.success('Course unpublished!');
      } else {
        await axios.patch(
          `/api/courses/${courseId}/publish`,
        );
        toast.success('Course Published!');
      }
      router.refresh();
    } catch {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted!');
      router.refresh()
    } catch {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onClick}>
        <Button disabled={disabled || isLoading} variant="outline" size="sm">
          {isPublished ? 'Unpublish' : 'Publish'}
        </Button>
      </ConfirmModal>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" variant="destructive" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
export default CourseActions;