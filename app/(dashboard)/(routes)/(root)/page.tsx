import { getDashboardCourses } from "@/actions/getDashboardCourses";
import { CoursesList } from "@/components/coursesList";
import { RedirectToSignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/infoCard";

export default async function Dashboard() {
  const {userId} = auth()
  if(!userId){
    redirect('/sign-in')
  }
  const {completedCourses,coursesInProgress} = await getDashboardCourses(userId)
  return (
    <div>
      <SignedIn>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon={Clock}
              label="In Progress"
              numberOfItems={coursesInProgress.length}
              variant="default"
            />
            <InfoCard
              variant="success"
              icon={CheckCircle}
              label="Completed"
              numberOfItems={completedCourses.length}
            />
          </div>
          <CoursesList items={[...completedCourses, ...coursesInProgress]} />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
