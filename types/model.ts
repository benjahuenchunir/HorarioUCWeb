export interface GroupedSection {
    horario: JSON;
    sections: Section[];
}

export interface Course{
    id: number;
    aprob_especial: boolean;
    area: string | null;
    creditos: number;
    descripcion: string;
    nombre: string;
    permite_retiro: boolean;
    sigla: string;
    secciones: GroupedSection[];
}

export interface Section{
    campus: string;
    en_ingles: boolean;
    formato: string;
    id_curso: number;
    nrc: number;
    profesor: string;
    seccion: number;
}