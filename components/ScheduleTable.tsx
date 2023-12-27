import { useState } from 'react';

const ScheduleTable = () => {
  const initialSchedule = Array(9).fill().map(() => Array(5).fill(''));

  const [schedule, setSchedule] = useState(initialSchedule);

  const addCourse = (day, time, course) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule];
      newSchedule[time][day] = course;
      return newSchedule;
    });
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  const timesOfDay = ["8:20", "9:40", "11:00", "12:20", "Almuerzo", "14:50", "16:10", "17:30", "18:50",];

  return (
    <table className="border-collapse border-2 border-gray-500 w-full table-fixed">
      <thead>
        <tr>
          <th className="border-2 border-gray-500 w-1/6"></th>
          {daysOfWeek.map((day, index) => (
            <th key={index} className="border-2 border-gray-500 w-1/6">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timesOfDay.map((time, timeIndex) => (
          <tr key={timeIndex} className={time === 'Almuerzo' ? 'bg-gray-200' : ''}>
            <td className="border-2 border-gray-500 w-1/6">{time}</td>
            {daysOfWeek.map((day, dayIndex) => (
              <td key={dayIndex} className="border-2 border-gray-500 w-1/6">{schedule[timeIndex][dayIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScheduleTable;