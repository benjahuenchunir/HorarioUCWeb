<template>
  <div class=" flex flex-col justify-around" id="main-container">
    <form class="flex" @submit.prevent="fetchCursoData">
      <input type="text" v-model="searchQuery" @input="makeUpperCase" placeholder="Ingresa una sigla"
        class="flex-1 p-2 border-2 border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500" />
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md">
        Agregar
      </button>
    </form>
    <div class="p-4">
      <div v-for="course in courses" :key="course.id" class="mb-4 last:mb-0">
        <div class="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow">
          <p class="font-semibold text-lg text-gray-700"> {{ course.sigla }} </p>
          <p class="text-sm text-gray-600"> {{ course.secciones.length }} secciones</p>
          <select v-model="selectedSections[course.sigla]" @change="resetCombinations">
            <option value="">Cualquiera</option>
            <option v-for="seccion in course.secciones" :key="seccion.seccion" :value="seccion.seccion">
              {{ seccion.seccion }}
            </option>
          </select>
          <button @click="removeCourse(course)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Eliminar
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-4 ">
      <div class="container" id="schedule-container">
        <div class="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
          <button @click="previousCombination" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            ←
          </button>
          <p v-if="combinations.length === 0" class="text-gray-800">No hay combinaciones</p>
          <p v-else class="text-gray-800">Combinación {{ currentCombinationIndex + 1 }} de {{ combinations.length }}</p>
          <button @click="nextCombination" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            →
          </button>
        </div>
        <div class="grid">
          <!-- Empty top-left corner -->
          <div class="grid-item time-header" style="grid-column: 1 / span 1; grid-row: 1;">&nbsp;</div>
          <!-- Days of the week -->
          <div class="grid-item time-header" v-for="(day, index) in days" :key="day"
            :style="{ 'grid-column': index + 2, 'grid-row': 1 }">{{ day }}</div>
          <!-- Time slots -->
          <div class="time-slot" v-for="(time, index) in times" :key="time"
            :style="{ 'grid-column': 1, 'grid-row': index + 2 }" :class="{'lunch-item': index === 4, 'grid-item': index !== 4}">{{ time }}</div>
          <!-- Adjusted for 7*11 grid with headers, dynamically calculate position -->
          <div v-for="n in 70" :key="`item-${n}`" :class="{'lunch-item': n >= 29 && n <= 35, 'grid-item': !(n >= 29 && n <= 35)}" :style="calculatePosition(n)">
          </div>
          <!-- Loop through gridCells to display the classes -->
          <div v-for="(cell, serializedKey) in gridCells" :key="serializedKey" :title="cell.text" class="grid-item"
            :style="{ 'grid-column': deserialize(serializedKey).x + 1, 'grid-row': deserialize(serializedKey).y + 1, backgroundColor: cell.color }">
            {{ cell.text }}
          </div>
        </div>
      </div class="container">
      <div id="sections-info-container">
        <div v-for="section, index in combinations[currentCombinationIndex]" :key="index" class="mb-4 last:mb-0">
        <div class="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow w-full">
          <p class="font-semibold text-lg text-gray-700 whitespace-pre-line"> {{ section.curso.sigla }} </p>
          <p class="font-semibold text-lg text-gray-700 whitespace-pre-line"> {{ section.curso.nombre }} </p>
          <p class="text-sm text-gray-600 whitespace-pre-line"> {{ section.secciones.join("\n") }}</p>
          <p class="text-sm text-gray-600 whitespace-pre-line"> {{ section.nrcs.join("\n") }}</p>
          <p class="text-sm text-gray-600 whitespace-pre-line"> {{ section.profesores.join("\n") }}</p>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

function extractClasModules(horario: Horario): Set<string> {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const modules = new Set<string>();

  if (horario.CLAS) {
    for (const day of days) {
      if (horario.CLAS[day]) {
        for (const module of horario.CLAS[day]!) {
          modules.add(`${day}${module}`);
        }
      }
    }
  }

  return modules;
}

function validSchedule(sections: SectionWithCurso[]): boolean {
  const moduleSet = new Set<string>();

  for (const section of sections) {
    const clasModules = extractClasModules(section.horario);

    for (const module of clasModules) {
      if (moduleSet.has(module)) {
        console.log('Overlapping modules:', module);
        return false;
      }
      moduleSet.add(module);
    }
  }

  return true;
}

function calculateCombinations(cursos: Curso[], selectedSections: { [key: string]: number | string }): SectionWithCurso[][] {
  const combinedSections = combineSections(cursos, selectedSections);
  const cursoIds = new Set(cursos.map(curso => curso.id));
  const result: SectionWithCurso[][] = [];

  function helper(path: SectionWithCurso[], index: number): void {
    if (index === combinedSections.length) {
      const usedCursoIds = new Set(path.map(section => section.id_curso));
      if (usedCursoIds.size === cursoIds.size && validSchedule(path)) {
        result.push([...path]);
      }
      return;
    }

    const section = combinedSections[index];
    if (!path.some(p => p.id_curso === section.id_curso)) {
      path.push(section);
      helper(path, index + 1);
      path.pop();
    }
    helper(path, index + 1);
  }

  helper([], 0);
  return result;
}

function combineSections(cursos: Curso[], selectedSections: { [key: string]: number | string }): SectionWithCurso[] {
  const combinedSections: SectionWithCurso[] = [];

  for (const curso of cursos) {
    const horarioMap: Map<string, SectionWithCurso> = new Map();

    // Filter sections if selectedNrcs is provided and not empty
    const hasSelectedSections = selectedSections && selectedSections[curso.sigla] !== '';

      // Find the selected section for the current course, if any
      const selectedSection = curso.secciones.find(seccion => 
        selectedSections && selectedSections[curso.sigla] === seccion.seccion
      );

      // Determine sections to process based on whether a section is selected
      // and if it shares the same schedule as the selected section
      const sectionsToProcess = hasSelectedSections && selectedSection
        ? curso.secciones.filter(seccion => 
            seccion.seccion === selectedSections[curso.sigla] || 
            JSON.stringify(seccion.horario) === JSON.stringify(selectedSection.horario)
          )
        : curso.secciones;

    for (const seccion of sectionsToProcess) {
      const horarioKey = JSON.stringify(seccion.horario);

      if (!horarioMap.has(horarioKey)) {
        horarioMap.set(horarioKey, {
          ...seccion,
          nrcs: [seccion.nrc],
          secciones: [seccion.seccion],
          curso,
          profesores: [seccion.profesor]
        });
      } else {
        const existing = horarioMap.get(horarioKey)!;
        existing.nrcs.push(seccion.nrc);
        existing.secciones.push(seccion.seccion);
        existing.profesores.push(seccion.profesor);
      }
    }

    combinedSections.push(...horarioMap.values());
  }

  return combinedSections;
}

const dayToNumber: { [key: string]: number } = {
  L: 1,
  M: 2,
  W: 3,
  J: 4,
  V: 5,
  S: 6,
  D: 7,
};

const classTypeColors: { [key: string]: string } = {
  AYU: "#99CC99",
  CLAS: "#FBC575",
  LAB: "#B3D4F5",
  TAL: "#C7C2F8",
  PRA: "#CCCC99",
  TES: "#B2EFEF",
  TER: "#FFCCFF",
  LIB: "#FF9999",
  SUP: "#FF9999",
};

export default {
  data() {
    return {
      searchQuery: '',
      items: [],
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      times: this.generateTimes(),
      currentCombinationIndex: 0,
      courses: [] as Curso[],
      combinations: [] as SectionWithCurso[][],
      gridCells: {} as { [key: string]: { text: string, color: string } },
      selectedSections: {} as { [key: string]: number | string },
    }
  },
  methods: {
    generateTimes() {
      let times = [];
      let time = new Date(0, 0, 0, 8, 20); // Starting at 8:20
      for (let i = 0; i < 10; i++) { // Generate 10 time slots
        let hours = time.getHours().toString().padStart(2, '0');
        let minutes = time.getMinutes().toString().padStart(2, '0');
        if (hours === '13' && minutes === '40') {
          times.push("Almuerzo");
          // Set time to 14:50 for the next iteration
          time = new Date(0, 0, 0, 14, 50);
        } else {
          times.push(`${hours}:${minutes}`);
          // Jump 80 minutes for the next iteration
          time = new Date(time.getTime() + 80 * 60000);
        }
      }
      return times;
    },
    calculatePosition(n: number) {
      // Calculate row and column based on n
      const row = Math.floor((n - 1) / 7) + 2; // Adjust row to start after headers
      const column = ((n - 1) % 7) + 2; // Adjust column to start after time slots
      return { 'grid-column': column, 'grid-row': row };
    },
    makeUpperCase() {
      this.searchQuery = this.searchQuery.toUpperCase();
    },
    fetchCursoData() {
      const sigla = this.searchQuery; // Use the searchQuery as the parameter for your API call
      if (!sigla || this.courses.some(curso => curso.sigla === sigla)) {
        return;
      }
      fetch(`http://localhost:3000/api/curso/${sigla}`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              // If the response status is 404, attempt to fetch from the scrape endpoint
              console.log("Course not found, attempting to scrape...");
              return fetch(`http://localhost:3000/api/scrape/${sigla}`)
                .then(scrapeResponse => {
                  if (!scrapeResponse.ok) {
                    throw new Error('Scrape network response was not ok');
                  }
                  return scrapeResponse.json();
                });
            } else {
              throw new Error('Network response was not ok');
            }
          }
          return response.json();
        })
        .then((data: Curso) => {
          console.log(data);
          this.onCourseReceived(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    nextCombination() {
      if (this.currentCombinationIndex >= this.combinations.length - 1) return;
      this.currentCombinationIndex++;
      this.updateCombination()
    },
    previousCombination() {
      if (this.currentCombinationIndex === 0) return;
      this.currentCombinationIndex--;
      this.updateCombination()
    },
    onCourseReceived(curso: Curso) {
      this.searchQuery = '';
      this.selectedSections[curso.sigla] = '';
      this.courses.push(curso);
      this.resetCombinations();
      if (this.combinations.length === 0) {
        alert('No hay combinaciones válidas');
      }
    },
    resetCombinations() {
      this.currentCombinationIndex = 0;
      this.combinations = calculateCombinations(this.courses, this.selectedSections);
      this.updateCombination();
    },
    updateCombination() {
      this.gridCells = {};
      for (const section of this.combinations[this.currentCombinationIndex]) {
        Object.entries(section.horario).forEach(([classType, days]) => {
          const color = classTypeColors[classType];
          Object.entries(days).forEach(([day, modules]) => {
            modules.forEach((moduleNumber) => {
              this.updateGridCellWithLabel(day, moduleNumber, `${section.curso.sigla}-${section.secciones.join(',')}`, color);
            });
          });
        });
      }
    },
    updateGridCellWithLabel(day: string, moduleNumber: number, text: string, color: string) {
      this.gridCells[`${dayToNumber[day]},${moduleNumber}`] = { text, color };
    },
    deserialize(key: string): { x: number; y: number } {
      const [x, y] = key.split(',').map(Number);
      return { x, y: y > 4 ? y + 1 : y };
    },
    removeCourse(course: Curso) {
      const index = this.courses.indexOf(course);
      if (index > -1) {
        this.courses.splice(index, 1);
      }
      delete this.selectedSections[course.sigla];
      this.resetCombinations();
    },
  }
}
</script>

<style scoped>

#main-container {
  padding: 20px;
}

#schedule-container {
  max-width: 64rem;
  width: 100%;
}

#sections-info-container {
  width: 80%;
}

.search-bar {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  /* 7 columns + 1 for time */
  grid-template-rows: auto repeat(4, 1fr) 0.5fr repeat(5, 1fr);
  /* 1 row for days, 3 regular rows, 1 smaller row for the 4th, then 6 more regular rows */
  gap: 2px;
  border: 1px solid black;
  /* Display grid lines */
}

.grid-item {
  padding: 10px;
  background-color: #f0f0f0;
  text-align: center;
  border: 1px solid #ddd;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.lunch-item {
  padding: 0px;
  background-color: #afafaf;
  text-align: center;
  border: 1px solid #ddd;
}

.time-header,
.time-slot {
  background-color: #e0e0e0;
}
</style>