export const DEFAULT_TOPES_FILTER = {
    cat_cat: false,
    cat_tal: false,
    cat_lab: false,
    cat_ayu: true,
    lab_tal: false,
    lab_lab: false,
    lab_ayu: true,
    tal_ayu: true,
    tal_tal: true,
    ayu_ayu: true,
  };

export const SIGLA_CATEDRA : string = "CLAS";
export const SIGLA_LAB : string = "LAB";
export const SIGLA_AYUDANTIA : string = "AYU";
export const SIGLA_TALLER : string = "TAL";
export const SIGLA_PRACTICA : string = "PRA"
export const SIGLA_TERRENO : string = "TER"
export const SIGLA_TESIS : string = "TES"
export const SIGLA_LIB : string = "LIB"
export const SIGLA_SUP : string = "SUP"
export const TIPOS_CLASES = [SIGLA_CATEDRA, SIGLA_LAB, SIGLA_AYUDANTIA, SIGLA_TALLER, SIGLA_PRACTICA, SIGLA_TERRENO, SIGLA_TESIS, SIGLA_LIB, SIGLA_SUP]

export const SHORT_FORM_TO_SIGLA = {
    "cat": SIGLA_CATEDRA,
    "lab": SIGLA_LAB,
    "ayu": SIGLA_AYUDANTIA,
    "tal": SIGLA_TALLER,
  }

export const COURSE_COLORS = {
    [SIGLA_CATEDRA]: "#FBC575",
    [SIGLA_LAB]: "#B3D4F5",
    [SIGLA_AYUDANTIA]: "#99CC99",
    [SIGLA_TALLER]: "#C7C2F8",
    [SIGLA_PRACTICA]: "#CCCC99",
    [SIGLA_TESIS]: "#B2EFEF",
    [SIGLA_TERRENO]: "#FFCCFF",
    [SIGLA_LIB]: "#FF9999",
    [SIGLA_SUP]: "#FF9999",
}

export const STRING_TO_BOOL : Record<string, boolean> = {
    'SI': true,
    'NO': false
};
