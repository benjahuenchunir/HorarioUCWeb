"use client"
import ScheduleTable from '@/components/ScheduleTable';
import { useState, useEffect } from 'react';
import { getCourseBySigla } from '@/lib/actions';
import { Course } from '@/types/model';
import { generateCombinations } from '@/lib/utils';

const defaultTopesFilter = {
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

export default function Index() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sigla, setCourseId] = useState<string>('');
  const options = ["MAT1630", "MAT1620"]
  const [courses, setCourses] = useState<Course[]>([]);
  const [topesFilter, setTopesFilter] = useState(defaultTopesFilter);


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

  const handleFilterChange = (attr) => {
    setTopesFilter((prevFilter) => ({
      ...prevFilter,
      [attr]: !prevFilter[attr],
    }));
  };

  const [open, setOpen] = useState(false)
  return (
    <div className="flex">
      <div
        className={` ${open ? "w-40" : "w-60 "
          } flex flex-col h-screen p-3 bg-gray-800 shadow duration-300`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Dashboard</h2>
            <button onClick={() => setOpen(!open)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              {Object.entries(topesFilter).map(([attr, isChecked]) => {
                const fullForm = attr.split('_').map((part) => ({
                  cat: 'Catedra',
                  lab: 'Lab',
                  tal: 'Taller',
                  ayu: 'Ayudantia',
                }[part])).join(' + ');
                return (
                  <li key={attr}>
                    <label style={{ color: defaultTopesFilter[attr] ? 'white' : 'red' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleFilterChange(attr)}
                      />
                      {fullForm}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-12">

        <div className={`h-screen flex justify-center items-center ${isSidebarOpen ? 'ml-64 w-[calc(100%-64)]' : 'w-full'}`}>
          <div>
            <input list="courses" onChange={handleInputChange} value={sigla} />
            <button onClick={fetchData}>Fetch Course</button>
            <datalist id="courses">
              {options.map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
            <ScheduleTable />
          </div>
        </div>
      </div>
    </div>
  );
}