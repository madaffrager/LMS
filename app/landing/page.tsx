import { db } from "@/lib/db"
import Navbar from "../(dashboard)/_components/Navbar";
import Sidebar from "../(dashboard)/_components/sidebar";
import { CoursesList } from "@/components/coursesList";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CourseCard } from "@/components/courseCard";
import Categories from "../(dashboard)/(routes)/search/_components/categories";

const LandingPage = async() => {
const courses = await db.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
    where: {
      isPublished: true,
    },
  })
    const categories = await db.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        <div className="p-6">
          <Categories items={categories} />
        </div>
        <div className="flex items-center justify-center w-full">
          <Carousel>
            <CarouselContent>
              {courses.map((item) => (
                <CarouselItem>
                  <CourseCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    imageUrl={item.imageUrl}
                    chaptersLength={item._count.chapters}
                    price={item.price}
                    progress={0}
                    category={item.category?.name}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>
    </div>
  );
}

export default LandingPage