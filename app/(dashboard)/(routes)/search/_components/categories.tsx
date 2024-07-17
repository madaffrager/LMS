'use client'

import { Category } from "@prisma/client";
import {
  FcLike,
  FcMultipleDevices,
  FcStatistics,
  FcGlobe,
  FcGraduationCap,
  FcSalesPerformance,
  FcBusiness,
  FcMusic,
  FcScatterPlot,
  FcSportsMode,
  FcParallelTasks,
  FcIdea,
} from 'react-icons/fc';
import { IconType } from "react-icons";
import CategoryItem from "./categoryItem";
interface CategoriesProps{
    items:Category[]
}
const iconMap: Record<Category['name'], IconType> = {
  'Health & Fitness': FcLike,
  'Programming': FcMultipleDevices,
  'Marketing': FcStatistics,
  'Language Learning': FcGlobe,
  'Teaching & Academics': FcGraduationCap,
  'Finance & Accounting': FcSalesPerformance,
  'Business': FcBusiness,
  'Music': FcMusic,
  'Data Science': FcScatterPlot,
  'Personal Development': FcSportsMode,
  'IT & Software': FcParallelTasks,
  'Design': FcIdea,
};
const Categories = ({items}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto no-scrollbar pb-2">
      {items.map((item) => {
        return (
          <CategoryItem
            key={item.id}
            label={item.name}
            icon={iconMap[item.name]}
            value={item.id}
          />
        );
      })}
    </div>
  );
};

export default Categories;