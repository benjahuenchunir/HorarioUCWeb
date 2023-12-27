import axios from 'axios';
import { JSDOM } from 'jsdom';
import { SIGLA_AYUDANTIA, SIGLA_CATEDRA, SIGLA_LAB, SIGLA_TALLER, STRING_TO_BOOL } from './constants';
import { Tables } from '@/types/supabase';

class Scraper {
    async findCourseInfo(courseId: string): Promise<[CourseDTO, SectionDTO[]] | null> {
        const url = `https://buscacursos.uc.cl/?cxml_semestre=2023-2&cxml_sigla=${courseId}&cxml_nrc=&cxml_nombre=&cxml_categoria=TODOS&cxml_area_fg=TODOS&cxml_formato_cur=TODOS&cxml_profesor=&cxml_campus=TODOS&cxml_unidad_academica=TODOS&cxml_horario_tipo_busqueda=si_tenga&cxml_horario_tipo_busqueda_actividad=TODOS#resultados`;
        const coursesDict = await this.parseUrl(url);
        return coursesDict[courseId] || null;
    }

    async parseUrl(url: string): Promise<Record<string, [CourseDTO, SectionDTO[]]>> {
        const courses: Record<string, [CourseDTO, SectionDTO[]]> = {};
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        const table = document.querySelector('table[width="100%"][cellpadding="3"][cellspacing="1"][border="0"]');
        const rows = table?.querySelectorAll('tr.resultadosRowImpar, tr.resultadosRowPar');

        if (!rows) {
            throw new Error('No courses found');
        }

        const rowsArray = Array.from(rows);
        for (const row of rowsArray) {
            const cells = row.querySelectorAll('td');
            const nrc = parseInt(cells[0].textContent?.trim() || '');
            const sigla = cells[1].textContent?.trim() || '';
            const en_ingles = STRING_TO_BOOL[cells[3].textContent?.trim() || ''];
            const sectionNumber = parseInt(cells[4].textContent?.trim() || '');
            const formato = cells[7].textContent?.trim() || '';
            const name = cells[9].textContent?.trim() || '';
            const teacher = cells[10].textContent?.trim() || '';
            const campus = cells[11].textContent?.trim() || '';
            const schedules = cells[16].querySelectorAll('tr');

            const catedra: Record<string, number[]> = {};
            const ayudantia: Record<string, number[]> = {};
            const lab: Record<string, number[]> = {};
            const taller: Record<string, number[]> = {};

            schedules.forEach((schedule) => {
                const scheduleCells = schedule.querySelectorAll('td');
                const tipo = scheduleCells[1].textContent?.trim() || '';
                const horario = scheduleCells[0].textContent?.trim() || '';
                const [dias, modulos_] = horario.split(':');

                if (dias === '' || modulos_ === '') {
                    return;
                }

                dias.split('-').forEach((dia) => {
                    const modulos = modulos_.split(',').map(Number);

                    switch (tipo) {
                        case SIGLA_CATEDRA:
                            catedra[dia] = (catedra[dia] || []).concat(modulos);
                            break;
                        case SIGLA_LAB:
                            lab[dia] = (lab[dia] || []).concat(modulos);
                            break;
                        case SIGLA_AYUDANTIA:
                            ayudantia[dia] = (ayudantia[dia] || []).concat(modulos);
                            break;
                        case SIGLA_TALLER:
                            taller[dia] = (taller[dia] || []).concat(modulos);
                            break;
                        default:
                            console.log(sigla);
                            console.log(tipo);
                    }
                });
            });

            if (!courses[sigla]) {
                const permite_retiro = STRING_TO_BOOL[cells[2].textContent?.trim() || ''];
                const aprob_especial = STRING_TO_BOOL[cells[5].textContent?.trim() || ''];
                const area = cells[6].textContent?.trim() || '';
                const creditos = parseInt(cells[12].textContent?.trim() || '');
                const ajax_url = 'https://buscacursos.uc.cl/' + cells[1].getAttribute('rel');
                const ajax_response = await axios.get(ajax_url);
                const tooltip_dom = new JSDOM(ajax_response.data);
                const tooltip = tooltip_dom.window.document.querySelector('div[style="height:116px;overflow:auto;"]');
    
                const course: Tables<"cursos"> = {
                    id: -1,
                    sigla,
                    nombre: name,
                    aprob_especial,
                    permite_retiro,
                    area,
                    creditos,
                    descripcion: tooltip?.textContent?.trim() || '',
                };
    
                courses[sigla] = [course, []];
            }
    
            const section: Tables<"secciones"> = {
                id_curso: -1,
                seccion: sectionNumber,
                nrc,
                profesor: teacher,
                campus,
                en_ingles,
                horario: JSON.stringify({
                    SIGLA_CATEDRA: catedra,
                    SIGLA_LAB: lab,
                    SIGLA_AYUDANTIA: ayudantia,
                    SIGLA_TALLER: taller,
                }),
                formato,
            };
            
            courses[sigla][1].push(section);
        };
        
        return courses;
    }
}

export default Scraper;