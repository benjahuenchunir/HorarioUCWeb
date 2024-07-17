```vue
<template>
  <div class="container">
    <input type="text" v-model="searchQuery" @input="makeUpperCase" placeholder="Ingresa una sigla" class="search-bar"/>
    <button @click="fetchCursoData">Agregar</button>
    <div class="grid">
      <!-- Empty top-left corner -->
      <div class="grid-item time-header" style="grid-column: 1 / span 1; grid-row: 1;">&nbsp;</div>
      <!-- Days of the week -->
      <div class="grid-item time-header" v-for="(day, index) in days" :key="day" :style="{ 'grid-column': index + 2, 'grid-row': 1 }">{{ day }}</div>
      <!-- Time slots -->
      <div class="grid-item time-slot" v-for="(time, index) in times" :key="time" :style="{ 'grid-column': 1, 'grid-row': index + 2 }">{{ time }}</div>
      <!-- Adjusted for 7*11 grid with headers, dynamically calculate position -->
      <div class="grid-item" v-for="n in 70" :key="`item-${n}`" :style="calculatePosition(n)"> 
        <!-- Content based on filteredItems or other logic -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">

export default {
  data() {
    return {
      searchQuery: '',
      items: [],
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      times: this.generateTimes(),
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
    calculatePosition(n) {
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
        .then((data : Curso) => {
          console.log(data);
          // Handle your data here
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  },
}
</script>

<style scoped>
.container {
  max-width: 1000px; /* Adjusted for larger grid */
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
  grid-template-columns: repeat(8, 1fr); /* 7 columns + 1 for time */
  grid-template-rows: auto repeat(10, 1fr); /* 1 row for days + 11 for times */
  gap: 2px;
  border: 1px solid black; /* Display grid lines */
}

.grid-item {
  padding: 10px;
  background-color: #f0f0f0;
  text-align: center;
  border: 1px solid #ddd; /* Display grid lines */
}

.time-header, .time-slot {
  background-color: #e0e0e0; /* Different background for headers */
}
</style>