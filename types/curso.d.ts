declare interface Curso {
  id: number;
  sigla: string;
  nombre: string;
  permite_retiro: boolean;
  aprob_especial: boolean;
  area: string;
  creditos: number;
  descripcion: string;
  secciones: Seccion[];
}
  
declare interface Seccion {
  campus: string;
  en_ingles: boolean;
  formato: string;
  horario: Horario;
  id_curso: number;
  nrc: number;
  profesor: string;
  seccion: number;
}

declare interface Horario {
  AYU: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  CLAS: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  LAB: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  LIB: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  PRA: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  SUP: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  TAL: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  TER: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
  TES: {
    L?: number[];
    M?: number[];
    X?: number[];
    J?: number[];
    V?: number[];
    S?: number[];
    D?: number[];
  };
}

interface SectionWithCurso {
  campus: string;
  en_ingles: boolean;
  formato: string;
  horario: Horario;
  id_curso: number;
  nrcs: number[];  // To store multiple section numbers
  profesores: string[];
  secciones: number[];
  curso: Curso;  // Reference to the original curso
}
