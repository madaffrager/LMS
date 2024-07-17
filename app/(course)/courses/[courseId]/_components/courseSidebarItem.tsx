
'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock,CheckCircle, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked:boolean;
}

export const CourseSidebarItem = ({id, label, isCompleted, courseId,isLocked}:CourseSidebarItemProps) => {
    const pathname = usePathname()
    const router = useRouter() 
    const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
    const isActive  = pathname.includes(id)
    const onClick = () =>{
        router.push(`/courses/${courseId}/chapters/${id}`)
    }
  return (
    <Button
    onClick={onClick}
      type="button"
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-100 bg-slate-300/20',
        isActive &&
          'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700/20',
        isCompleted && 'text-emerald-700 hover:text-emerald-700',
        isCompleted && isActive && 'bg-emerald-200/20 ',
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={
            cn('text-slate-500',
            isActive &&
              'text-slate-700',
            isCompleted && 'text-emerald-700')
          }
        />
        {label}
      </div>
      <div className={cn('ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
      isActive && 'opacity-100',
      isCompleted && 'border-emerald-700')}></div>
    </Button>
  );
}
