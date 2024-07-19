
'use client'

import { cn } from '@/lib/utils';
import MuxPlayer from '@mux/mux-player-react';
import { Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

interface VideoPlayerProps{
    chapterId:string
    title:string
    courseId:string
    nextChapterId?:string
    playbackId?:string|null
    isLocked:boolean
    completeOnEnd:boolean
}
export const VideoPlayer = ({chapterId,title,courseId,nextChapterId,playbackId,isLocked,completeOnEnd}: VideoPlayerProps) => {
  const [isReady,setReady] = useState(false)
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer className={cn(!isReady && 'hidden')} playbackId={playbackId!} onCanPlay={()=>setReady(true)} onEnded={()=>{}} autoPlay/>
      )}
    </div>
  );
};