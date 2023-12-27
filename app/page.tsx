"use client"
import ScheduleTable from '@/components/ScheduleTable';
import { useState, useEffect } from 'react';
import { getCourseBySigla } from '@/lib/actions';
import { Course } from '@/types/model';
import { generateCombinations } from '@/lib/utils/utils';

export default function Index() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sigla, setCourseId] = useState<string>('');
  const options = ["MAT1630", "MAT1620"]
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    console.log(generateCombinations(courses));
  }, [courses]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const fetchData = async () => {
    console.log("courses", courses)
    if (courses.find(course => course.sigla === sigla)) {
      console.error("Course already added");
      return;
    }
    const course = await getCourseBySigla(sigla);
      if (course) {
        setCourses([...courses, course])
        console.log("courses", courses)
      } else {
        console.error("Course not found");
      }
    }

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCourseId(value);

    setSuggestions(options.filter((option) => option.includes(value)));
  };

  return (
    <>
      <div className="h-16 flex items-center justify-between px-4 z-10">
        <button onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isSidebarOpen && (
        <div className="h-full w-64 fixed top-16 left-0">
          <p>Sidebar content...</p>
        </div>
      )}
      <div className={`h-screen flex justify-center items-center ${isSidebarOpen ? 'ml-64 w-[calc(100%-64)]' : 'w-full'}`}>
        <div>
          <input list="courses" onChange={handleInputChange} value={sigla} />
          <button onClick={fetchData}>Fetch Course</button>
          <datalist id="courses">
            {options.map((option, index) => (
              <option key={index} value={option} />
            ))}
          </datalist>
          <ScheduleTable/>
        </div>
      </div>
    </>
  );
}