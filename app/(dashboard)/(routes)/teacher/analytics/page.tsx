import { getAnalytics } from '@/actions/getAnalytics'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DataCard } from './_components/dataCard'
import { CourseChart } from './_components/courseChart';

const AnalyticsPage = async () => {
  const {userId} = auth()
  if(!userId){
    redirect('/')
  }
  const {data,totalRevenue,totalSales} = await getAnalytics(userId)

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Sales" value={totalSales} />
        <DataCard
          label="Total Revenue"
          value={totalRevenue}
          shouldFormat={true}
        />
        <CourseChart data={data} />
      </div>
    </div>
  );
}

export default AnalyticsPage