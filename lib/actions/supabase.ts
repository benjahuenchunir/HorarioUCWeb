"use server";
import { Database, Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "../supabase/server";
import { error } from "console";

async function insertCourse(course: Tables<"cursos">) {
    const { id, ...courseWithoutId } = course;
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('cursos')
        .insert([courseWithoutId])
        .select('id');

    if (error) {
        console.error('Error inserting course:', error);
        return null;
    }

    return data[0].id;
}

async function insertSections(sections: Tables<"secciones">[]) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from('secciones')
        .insert(sections);

    if (error) {
        console.error('Error inserting sections:', error);
        return error;
    }
}


export async function insertCourseAndSections(course: Tables<"cursos">, sections: Tables<"secciones">[]) {
    const courseId = await insertCourse(course);
      
    if (!courseId) {
      console.error('Error inserting course');
      return null;
    }
  
    const sectionsWithCourseId = sections.map((section) => ({
      ...section,
      id_curso: courseId,
    }));
  
    const error = await insertSections(sectionsWithCourseId);
    
    if (error) {
      console.error('Error inserting sections' + error.message);
    }
  }

export async function getAllCourses() {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("cursos")
		.select("*, secciones(*)")
		.order("sigla");

	if (error) {
		console.error('Error fetching product by id:', error.message);
		return null;
	}
	return data;
}

export async function getCourseById(id: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("cursos")
        .select("*, secciones(*)")
        .eq("sigla", id)
        .single();
    
    if (error) {
        console.error('Error fetching product by id:', error.message);
        return null;
    }
    return data;
}