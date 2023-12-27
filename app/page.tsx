"use client"
import ScheduleTable from '@/components/ScheduleTable';
import { getCourseById } from '@/lib/actions/supabase';
import { useState } from 'react';
import { insertCourseAndSections } from '@/lib/actions/supabase';

export default function Index() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [courseId, setCourseId] = useState('');
  const options = ["MAT1630", "MAT1620"]

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const fetchData = async () => {
    console.log("fetching data for course", courseId);
    const course = await getCourseById(courseId);

    if (!course) {
      console.log("course does not exist");
      await fetch('/api/scrape_course', {
        method: 'POST',
        body: JSON.stringify({
          courseId,
        })
      }).then((response) => response.json())
      .then(({data}) => insertCourseAndSections(data[0], data[1]))
      .catch((error) => console.error(error));

    } else {
      console.log("course already exists");
      console.log(course);
    }
  };

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
          <input list="courses" onChange={handleInputChange} value={courseId} />
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