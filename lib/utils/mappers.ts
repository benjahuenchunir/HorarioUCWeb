import { CourseDTO } from "@/types/dto";
import { Course, GroupedSection, Section } from "@/types/model";
import { Tables } from "@/types/supabase";

export function mapToCourseModel(data: CourseDTO): Course {
    const groupedSections: Record<string, GroupedSection> = data.secciones.reduce((acc: Record<string, GroupedSection>, sectionDto: Tables<"secciones">) => {
      const horario = JSON.stringify(sectionDto.horario);
      const section: Section = { ...sectionDto, horario: sectionDto.horario };
      if (!acc[horario]) {
        acc[horario] = { horario: sectionDto.horario, sections: [section] };
      } else {
        acc[horario].sections.push(section);
      }
  
      return acc;
    }, {});
  
    return {
      id: data.id,
      aprob_especial: data.aprob_especial,
      area: data.area,
      creditos: data.creditos,
      descripcion: data.descripcion,
      nombre: data.nombre,
      permite_retiro: data.permite_retiro,
      sigla: data.sigla,
      secciones: Object.values(groupedSections),
    };
}