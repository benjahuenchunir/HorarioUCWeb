<template>
  <div class="container">
    <form class="flex" @submit.prevent="fetchCursoData">
      <input type="text" v-model="searchQuery" @input="makeUpperCase" placeholder="Ingresa una sigla"
        class="search-bar" />
      <button type="submit">Agregar</button>
    </form>
    <div>
      <div v-for="course in courses" :key="course.id">
        <div class="flex justify-between">
          <p> {{ course.sigla }} </p>
          <p> {{ course.secciones.length }} secciones</p>
          <button @click="removeCourse(course)">Eliminar</button>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <button @click="previousCombination">←</button>
      <p v-if="combinations.length === 0">No hay combinaciones</p>
      <p v-else>Combinación {{ currentCombinationIndex + 1 }} de {{ combinations.length }}</p>
      <button @click="nextCombination">→</button>
    </div>
    <div class="grid">
      <!-- Empty top-left corner -->
      <div class="grid-item time-header" style="grid-column: 1 / span 1; grid-row: 1;">&nbsp;</div>
      <!-- Days of the week -->
      <div class="grid-item time-header" v-for="(day, index) in days" :key="day"
        :style="{ 'grid-column': index + 2, 'grid-row': 1 }">{{ day }}</div>
      <!-- Time slots -->
      <div class="grid-item time-slot" v-for="(time, index) in times" :key="time"
        :style="{ 'grid-column': 1, 'grid-row': index + 2 }">{{ time }}</div>
      <!-- Adjusted for 7*11 grid with headers, dynamically calculate position -->
      <div class="grid-item" v-for="n in 70" :key="`item-${n}`" :style="calculatePosition(n)">
        <!-- Content based on filteredItems or other logic -->
      </div>
      <!-- <div v-for="(cell, index) in gridCells" :key="index" class="grid-item" :style="{ , ...calculatePosition(index) }">
        {{ cell.sigla }}
      </div> -->
      <div v-for="(cell, serializedKey) in gridCells" :key="serializedKey" class="grid-item"
        :style="{ 'grid-column': deserialize(serializedKey).x + 1, 'grid-row': deserialize(serializedKey).y + 1, backgroundColor: cell.color }">
        {{ cell.text }}
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

function calculateCombinations(cursos: Curso[]): SectionWithCurso[][] {
  const combinedSections = combineSections(cursos);
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

function combineSections(cursos: Curso[]): SectionWithCurso[] {
  const combinedSections: SectionWithCurso[] = [];

  for (const curso of cursos) {
    const horarioMap: Map<string, SectionWithCurso> = new Map();

    for (const seccion of curso.secciones) {
      const horarioKey = JSON.stringify(seccion.horario);

      if (!horarioMap.has(horarioKey)) {
        horarioMap.set(horarioKey, {
          ...seccion,
          nrcs: [seccion.nrc],
          secciones: [seccion.seccion],
          curso
        });
      } else {
        const existing = horarioMap.get(horarioKey)!;
        existing.nrcs.push(seccion.nrc);
        existing.secciones.push(seccion.seccion);
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
      fetch(`http://localhost:3000/api/curso/${sigla}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data: Curso) => {
          console.log(data);
          this.onCourseReceived(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    },
    nextCombination() {
      if (this.currentCombinationIndex === this.combinations.length - 1) return;
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
      this.courses.push(curso);
      this.currentCombinationIndex = 0;
      this.combinations = calculateCombinations(this.courses);
      if (this.combinations.length === 0) {
        alert('No hay combinaciones válidas');
      }
      this.updateCombination()
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
    },
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px;
  /* Adjusted for larger grid */
  margin: auto;
  padding: 20px;
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
  grid-template-rows: auto repeat(10, 1fr);
  /* 1 row for days + 11 for times */
  gap: 2px;
  border: 1px solid black;
  /* Display grid lines */
}

.grid-item {
  padding: 10px;
  background-color: #f0f0f0;
  text-align: center;
  border: 1px solid #ddd;
  /* Display grid lines */
}

.time-header,
.time-slot {
  background-color: #e0e0e0;
  /* Different background for headers */
}
</style>