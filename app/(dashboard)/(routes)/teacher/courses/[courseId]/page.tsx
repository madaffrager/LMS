import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import {TitleForm} from "./_components/titleForm";
import { DescriptionForm } from "./_components/descriptionForm";
import { ImageForm } from "./_components/imageForm";
import { CategoryForm } from "./_components/categoryForm";
import { PriceForm } from "./_components/priceForm";
import { AttachmentForm } from "./_components/attachmentForm";
import { ChapterForm } from "./_components/chapterForm";
import { Banner } from "@/components/banner";
import CourseActions from "./_components/courseActions";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
    if (!userId) {
      return redirect("/");
    }
  const course = await db.course.findUnique({
    where: { id: params.courseId, userId },
    include:{
      attachments:{
        orderBy:{
          createdAt:'desc'
        }
      },
      chapters:{
        orderBy:{
          position:'asc'
        } 
      }
    }
  });
  if (!course) {
      return redirect("/");
    }
  const categories = await db.category.findMany({orderBy:{name:'asc'}})
      

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.chapters.some(chapter=>chapter.isPublished)
  ];
  const totalFields =  requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText =  `${completedFields}/${totalFields}`
  const isComplete = requiredFields.every(Boolean )
  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished, it will not be visible to the  students" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2 ">
            <h1 className="text-2xl font-medium ">Course Setup</h1>
            <span className="text-sm text-slate-7 00">
              Complete all fields : {completionText}
            </span>
          </div>
          <CourseActions
            isPublished={course.isPublished}
            courseId={params.courseId}
            disabled={!isComplete}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2 ">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources and Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePage;
