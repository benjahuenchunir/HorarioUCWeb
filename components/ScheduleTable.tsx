import { GroupedSection } from '@/types/model';
import { useEffect, useState } from 'react';

export function ScheduleTable ({currentCombination} : {currentCombination: GroupedSection[]}) {
  const initialSchedule = Array(9).fill().map(() => Array(5).fill(''));
  const [schedule, setSchedule] = useState(initialSchedule);

  useEffect(() => {
    updateSchedule(currentCombination);
  }, [currentCombination]);

  const clearSchedule = () => {
    setSchedule(initialSchedule);
  };

  const addCourse = (courseObject, sigla: string, section: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule];
      for (const [courseType, days] of Object.entries(courseObject)) {
        for (const [day, modules] of Object.entries(days)) {
          for (let module of modules) {
            if (module < 5){
              module -= 1; // Make the module index zero-based if it's in the morning
            }
            const courseLabel = `${sigla}-${section}`;
            if (!newSchedule[module][dayToIndex(day)]) {
              newSchedule[module][dayToIndex(day)] = [{ label: courseLabel, type: courseType }];
            } else if (!newSchedule[module][dayToIndex(day)].some(course => course.label === courseLabel)) {
              // Only add a new label if it doesn't already exist in the schedule
              newSchedule[module][dayToIndex(day)].push({ label: courseLabel, type: courseType });
            }
          }
        }
      }
      return newSchedule;
    });
  };
  
  const updateSchedule = (groupedSections: GroupedSection[]) => {
    clearSchedule();
    
    if (!groupedSections) {
      return;
    }

    groupedSections.forEach(groupedSection => {
      console.log(groupedSection);
      addCourse(groupedSection.horario, groupedSection.sigla, groupedSection.sections.map(section => section.seccion).join(','));
    });
  };

  const dayToIndex = (day) => {
    const daysOfWeek = ['L', 'M', 'W', 'J', 'V'];
    return daysOfWeek.indexOf(day);
  };

  const courseTypeToColor = (courseType) => {
    const colors = {
      'CLAS': '#FBC575',
      'LAB': '#B3D4F5',
      'AYU': '#99CC99',
      'TAL': '#C7C2F8',
    };
    return colors[courseType] || 'white';
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  const timesOfDay = ["8:20", "9:40", "11:00", "12:20", "Almuerzo", "14:50", "16:10", "17:30", "18:50",];

  return (
  <table className="border-collapse border-2 border-gray-500 w-full table-fixed">
    <tbody>
      {timesOfDay.map((time, timeIndex) => (
        <tr key={timeIndex} className={timeIndex === 4 ? 'bg-gray-300' : ''}>
          <td className="border-2 border-gray-500 w-1/6">{time}</td>
          {daysOfWeek.map((day, dayIndex) => (
            <td key={dayIndex} style={{ backgroundColor: timeIndex === 4 ? '#D3D3D3' : courseTypeToColor(schedule[timeIndex][dayIndex][0]?.type) }} className={`border-2 border-gray-500 w-1/6`}>
              {Array.isArray(schedule[timeIndex][dayIndex]) ? schedule[timeIndex][dayIndex].map((course, i) => <p key={i}>{course.label}</p>) : schedule[timeIndex][dayIndex]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
}
