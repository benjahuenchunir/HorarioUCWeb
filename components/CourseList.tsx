import { Course, GroupedSection } from "@/types/model";
import { Button } from "./ui/button";

export function CourseList({ courses, onDelete, combinations, currentCombinationIndex}: { courses: Course[], onDelete: (course: Course) => void , combinations: GroupedSection[][], currentCombinationIndex: number}) {

    if (courses.length === 0) {
        return <div className="text-center text-gray-500">No se han añadido cursos</div>;
    }

    const currentCombination = combinations[currentCombinationIndex];

    return (
        <div className="mt-4">
            {courses.map((course, index) => {
                const section = currentCombination.find(section => section.sigla === course.sigla);
                return (
                    <div key={index} className="flex justify-between items-center bg-gray-100 p-4 my-2 rounded-md shadow-sm">
                        <span className="text-gray-500">{course.sigla}</span>
                        <span className="font-semibold text-gray-700">{course.nombre}</span>
                        <span className="text-gray-500">{section?.sections.map(section => section.seccion).join(',')}</span>
                        <Button variant="destructive" onClick={() => onDelete(course)}>X</Button>
                    </div>
                );
            })}
        </div>
    );
}