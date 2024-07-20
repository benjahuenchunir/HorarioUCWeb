import { createError, defineEventHandler, getRouterParam } from 'h3'
import cheerio from 'cheerio';
import type { Database } from '../../../types/database.types.js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const sigla = getRouterParam(event, 'sigla')

    if (!sigla) {
        throw createError({ statusCode: 400, statusMessage: 'La sigla no puede estar vacía' })
    }

    const url = `https://buscacursos.uc.cl/?cxml_semestre=2024-2&cxml_sigla=${sigla}&cxml_nrc=&cxml_nombre=&cxml_categoria=TODOS&cxml_area_fg=TODOS&cxml_formato_cur=TODOS&cxml_profesor=&cxml_campus=TODOS&cxml_unidad_academica=TODOS&cxml_horario_tipo_busqueda=si_tenga&cxml_horario_tipo_busqueda_actividad=TODOS#resultados`

    // Fetch the data from the URL
    const response = await fetch(url)
    const data = await response.text()

    const course = parseHtml(data)

    if (!course) {
        throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado' })
    }
    const { secciones, id, ...courseDataWithoutSecciones } = course;

    const client = await serverSupabaseClient<Database>(event)
    const { data: courseData, error } = await client
        .from('cursos')
        .insert(courseDataWithoutSecciones)
        .select()
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }

    course.id = courseData.id;
    const { data: sectionsData, error: sectionsError } = await client
        .from('secciones')
        .insert(course.secciones.map(section => ({ ...section, id_curso: course.id })))
        .select();

    if (sectionsError) {
        throw createError({ statusCode: 500, statusMessage: sectionsError.message })
    }

    const mappedSections: Seccion[] = sectionsData.map((section: any) => {
        const { horario, ...sectionWithoutHorario } = section
        return {
            ...sectionWithoutHorario,
            horario: JSON.parse(horario)
        }
    })

    course.secciones = mappedSections

    return course
})

function parseHtml(data: string): Curso | undefined {
    const $ = cheerio.load(data);

    const table = $('table[width="100%"][cellpadding="3"][cellspacing="1"][border="0"]');
    if (!table) return;

    const rows = table.find('tr.resultadosRowImpar, tr.resultadosRowPar');
    if (!rows) return;

    const firstRowCells = $(rows[0]).find('td');
    const sigla = firstRowCells.eq(1).text().trim();
    if (!sigla) return;
    const permite_retiro = firstRowCells.eq(2).text().trim() === "SI";
    const aprob_especial = firstRowCells.eq(5).text().trim() === "SI";
    const area = firstRowCells.eq(6).text().trim();
    const nombre = firstRowCells.eq(9).text().trim();
    const creditos = Number(firstRowCells.eq(12).text().trim());

    const sections: Seccion[] = [];

    rows.each((_, row) => {
        const cells = $(row).find('td');
        const nrc = parseInt(cells.eq(0).text().trim());
        const en_ingles = cells.eq(3).text().trim() === "SI";
        const section = parseInt(cells.eq(4).text().trim());
        const formato = cells.eq(7).text().trim();
        const teacher = cells.eq(10).text().trim();
        const campus = cells.eq(11).text().trim();
        const schedules = cells.eq(16).find('table').find('tr');
        const schedule_data: Horario = {
            AYU: {},
            LAB: {},
            TAL: {},
            CLAS: {},
            PRA: {},
            LIB: {},
            SUP: {},
            TER: {},
            TES: {},
        };

        schedules.each((_, schedule) => {
            const schedule_cells = $(schedule).find('td');
            const tipo = schedule_cells.eq(1).text().trim();
            const horario = schedule_cells.eq(0).text().trim();
            const [dias, modulos_] = horario.split(":");
            if (dias === "" || modulos_ === "") {
                return;
            }
            dias.split("-").forEach(dia => {
                const modulos = modulos_.split(",").map(Number);
                if (!schedule_data[tipo]) schedule_data[tipo] = {};
                if (!schedule_data[tipo][dia]) schedule_data[tipo][dia] = [];
                schedule_data[tipo][dia].push(...modulos);
            });
        });

        sections.push({
            nrc,
            en_ingles: en_ingles,
            seccion: section,
            formato,
            profesor: teacher,
            campus,
            horario: schedule_data,
            id_curso: -1
        });
    });

    const course: Curso = {
        id: -1,
        sigla: sigla,
        nombre: nombre,
        permite_retiro: permite_retiro,
        aprob_especial: aprob_especial,
        area: area,
        creditos: creditos,
        descripcion: "", // TODO: Add description
        secciones: sections,
    };

    return course;
}