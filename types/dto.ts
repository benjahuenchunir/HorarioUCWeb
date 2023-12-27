import { createSupabaseServerClient } from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";

const supabase = createSupabaseServerClient();
const query = supabase.from("cursos").select("*, secciones(*)").eq("sigla", "example").single();

export type CourseDTO = QueryData<typeof query>;