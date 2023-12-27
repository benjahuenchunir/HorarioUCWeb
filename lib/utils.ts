import { Course, GroupedSection } from "@/types/model";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DEFAULT_TOPES_FILTER, SHORT_FORM_TO_SIGLA } from "./utils/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCombinations(courses: Course[], topesFilter: typeof DEFAULT_TOPES_FILTER): GroupedSection[][] {  
  if (courses.length === 0) {
    return [[]];
  }

  const firstCourse = courses[0];
  const restCourses = courses.slice(1);

  const combinationsWithoutFirst = generateCombinations(restCourses, topesFilter);
  let allCombinations: GroupedSection[][] = [];

  firstCourse.secciones.forEach(groupedSection => {
    const combinationsWithFirst = combinationsWithoutFirst.map(combination => [groupedSection, ...combination]);
    allCombinations = [...allCombinations, ...combinationsWithFirst];
  });

  allCombinations = allCombinations.filter(combination => isCombinationValid(combination, topesFilter));

  return allCombinations;
}

function isCombinationValid(combination: GroupedSection[], topesFilter: typeof DEFAULT_TOPES_FILTER): boolean {
  for (const attr in topesFilter) {
    const [classType1, classType2] = attr.split('_');
    if (!topesFilter[attr] && !checkCourseConflicts(combination, SHORT_FORM_TO_SIGLA[classType1], SHORT_FORM_TO_SIGLA[classType2])) {
      return false;
    }
  }
  return true;
}

function checkCourseConflicts(combination: GroupedSection[], classType1: string, classType2: string): boolean {
  for (let i = 0; i < combination.length; i++) {
    const course = combination[i];
    for (const key in course.horario[classType1]) {
      const modules = course.horario[classType1][key];
      for (let j = 0; j < combination.length; j++) {
        if (i !== j) {
          const otherCourse = combination[j];
          if (key in otherCourse.horario[classType2] && modules.some(val => otherCourse.horario[classType2][key].includes(val))) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
