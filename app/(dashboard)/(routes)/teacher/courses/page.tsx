import { DataTable } from "./_components/dataTable";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const CoursesPage = async () => {
  const {userId} = auth()
  if(!userId){
    return redirect('/')
  }
  const courses = await db.course.findMany({where:{userId},orderBy:{createdAt:"desc"}})
  if(!courses){
    return redirect('/')
  }
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage