import { getChapter } from "@/actions/getChapter"
import { Banner } from "@/components/banner"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { VideoPlayer } from "./_components/VideoPlayer"
import { CourseEnrollButton } from "./_components/courseEnrollButton"
import { Separator } from "@/components/ui/separator"
import { Preview } from "@/components/preview"
import { File } from "lucide-react"
import { CourseProgressButton } from "./_components/courseProgressButton"
import { YoutubePlayer } from "./_components/YoutubePlayer"

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
          <Banner variant="warning" label="This chapter is locked" />
        )}
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          <div className="p-4">
            {chapter.videoUrl?.includes('youtube') ? (
              <YoutubePlayer url={chapter.videoUrl}/>
            ) : (
              <VideoPlayer
                chapterId={params.chapterId}
                title={chapter.title}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                playbackId={muxData?.playbackId}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
              />
            )}
          </div>
          <div>
            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
              {purchase || course.price === 0 ? (
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton
                  courseId={params.courseId}
                  price={course.price!}
                />
              )}
            </div>
            <Separator />
            <Preview value={chapter.description!} />
            {!!attachments.length && (
              <>
                <Separator />
                <h2 className="text-xl font-semibold mt-4 mb-2">
                  Course Attachments
                </h2>
                <div className="p-4">
                  {attachments.map((attachment) => (
                    <a
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                    >
                      <File />
                      <p className="line-clamp-1">{attachment.name}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
}

export default SingleChapterPage