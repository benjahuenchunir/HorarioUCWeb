import { mapToCourseModel } from "../utils/mappers";
import { getCourseById, insertCourseAndSections } from "./supabase";

export async function getCourseBySigla(sigla: string) {
    let course = await getCourseById(sigla);

    if (!course) {
        console.log("Course does not exist in the database, scraping...");
        await fetch('/api/scrape_course', {
            method: 'POST',
            body: JSON.stringify({
                courseId: sigla,
            })
        }).then((response) => response.json())
        .then(({data}) => {
            if (data) {
                insertCourseAndSections(data[0], data[1]);
                course = mapToCourseModel({ ...data[0], secciones: data[1] });
            }
        })
        .catch((error) => console.error(error));
    }

    if (!course) {
        console.error("Course does not exist");
        return null;
    }

    return course;
}