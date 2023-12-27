import { Course, GroupedSection } from "@/types/model";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCombinations(courses: Course[]): GroupedSection[][] {
  if (courses.length === 0) {
    return [[]];
  }

  const firstCourse = courses[0];
  const restCourses = courses.slice(1);

  const combinationsWithoutFirst = generateCombinations(restCourses);
  let allCombinations: GroupedSection[][] = [];

  firstCourse.secciones.forEach(groupedSection => {
    const combinationsWithFirst = combinationsWithoutFirst.map(combination => [groupedSection, ...combination]);
    allCombinations = [...allCombinations, ...combinationsWithFirst];
  });

  return allCombinations;
}