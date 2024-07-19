import { getChapter } from "@/actions/getChapter"
import { Banner } from "@/components/banner"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { VideoPlayer } from "./_components/VideoPlayer"

const SingleChapterPage = async ({params}:{params:{courseId:string, chapterId:string}}) => {
    const {userId} = auth()
    if(!userId){
        redirect('/')
    }
    const {chapter,course,muxData,attachments,nextChapter,userProgress,purchase} = await getChapter({userId,chapterId:params.chapterId,courseId:params.courseId }) 
    if(!chapter || !course){
        return redirect('/')
    }
    const isLocked = !chapter.isFree && (!purchase && course.price!==0)
    const completeOnEnd = (!!purchase || course.price === 0) && !userProgress?.isCompleted;
    return (
      <div>
        {userProgress?.isCompleted && (
          <Banner
            variant="success"
            label="You have already completed this chapter"
          />
        )}
        {isLocked && (
          <Banner
            variant="warning"
            label="This chapter is locked for premium users only"
          />
        )}
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
            <div className="p-4">
                <VideoPlayer 
                chapterId={params.chapterId}
                title={chapter.title}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                playbackId={muxData?.playbackId}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
                 />
            </div>
        </div>
      </div>
    );
}

export default SingleChapterPage