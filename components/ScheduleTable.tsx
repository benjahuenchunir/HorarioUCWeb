import { GroupedSection } from '@/types/model';
import { useEffect, useState } from 'react';
import { COURSE_COLORS } from '@/lib/utils/constants';

export function ScheduleTable ({currentCombination} : {currentCombination: GroupedSection[]}) {
  const initialSchedule = Array(10).fill().map(() => Array(6).fill(''));
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
    const daysOfWeek = ['L', 'M', 'W', 'J', 'V', 'S'];
    return daysOfWeek.indexOf(day);
  };

  const courseTypeToColor = (courseType) => {
    return COURSE_COLORS[courseType] || 'white';
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  const timesOfDay = ["8:20", "9:40", "11:00", "12:20", "Almuerzo", "14:50", "16:10", "17:30", "18:50", "20:10"];

  return (
  <table className="border-collapse border-2 border-gray-500 w-full table-fixed">
    <tbody>
      {timesOfDay.map((time, timeIndex) => (
        <tr key={timeIndex} className={timeIndex === 4 ? 'bg-gray-300' : ''}>
          <td className="border-2 border-gray-500 w-1/6">{time}</td>
          {daysOfWeek.map((day, dayIndex) => (
            <td key={dayIndex} className={`border-2 border-gray-500 w-1/6 h-full`}>
              {Array.isArray(schedule[timeIndex][dayIndex]) ? schedule[timeIndex][dayIndex].map((course, i) => (
                <p key={i} style={{ backgroundColor: courseTypeToColor(course.type), padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: `${100 / schedule[timeIndex][dayIndex].length}%`, boxSizing: 'border-box' }}>
                  {course.label}
                </p>
              )) : schedule[timeIndex][dayIndex]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
}
