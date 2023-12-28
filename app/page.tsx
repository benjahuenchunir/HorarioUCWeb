"use client"
import { ScheduleTable } from '@/components/ScheduleTable';
import { useState, useEffect, useRef, use } from 'react';
import { getCourseBySigla } from '@/lib/actions';
import { Course } from '@/types/model';
import { generateCombinations } from '@/lib/utils';
import { DEFAULT_TOPES_FILTER } from '@/lib/utils/constants';
import { CourseList } from '@/components/CourseList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCourseSiglas } from '@/lib/actions/supabase';
import { SectionInfoList } from '@/components/SectionInfoList';
import { toast } from '@/components/ui/use-toast';

export default function Index() {
  const [suggestions, setSuggestions] = useState([]);
  const [sigla, setCourseId] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [topesFilter, setTopesFilter] = useState(DEFAULT_TOPES_FILTER);
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(0);
  const [combinations, setCombinations] = useState([]);

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);
  
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip saving on initial render
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      // Save courses to localStorage whenever they change
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }, [courses]);

  useEffect(() => {
    const fetchCourseSiglas = async () => {
      let courseSiglas = localStorage.getItem('courseSiglas');
      if (!courseSiglas) {
        console.log('Fetching course siglas');
        courseSiglas = await getCourseSiglas();
        localStorage.setItem('courseSiglas', JSON.stringify(courseSiglas));
      } else {
        console.log('Using cached course siglas');
        courseSiglas = JSON.parse(courseSiglas);
      }
      setSuggestions(courseSiglas);
      setFilteredSuggestions(courseSiglas);
    };

    fetchCourseSiglas();
  }, []);

  useEffect(() => {
    const newCombinations = generateCombinations(courses, topesFilter);
    setCombinations(newCombinations);
    setCurrentCombinationIndex(0);
  }, [courses, topesFilter]);

  const increaseCombinationIndex = () => {
    if (currentCombinationIndex < combinations.length - 1) {
      setCurrentCombinationIndex(currentCombinationIndex + 1);
    }
  };

  const decreaseCombinationIndex = () => {
    if (currentCombinationIndex > 0) {
      setCurrentCombinationIndex(currentCombinationIndex - 1);
    }
  };

  useEffect(() => {
    console.log(generateCombinations(courses, topesFilter));
  }, [courses, topesFilter]);

  const fetchData = async () => {
    console.log("courses", courses)
    if (courses.find(course => course.sigla === sigla.toUpperCase())) {
      toast({
        variant: "destructive",
        title: "El curso ya esta en la lista",
      });
      return;
    }
    const course = await getCourseBySigla(sigla.toUpperCase());
    if (course) {
      setCourses([...courses, course])
      setCourseId('');
      handleInputChange({ target: { value: '' } });
      console.log("courses", courses)
    } else {
      toast({
        variant: "destructive",
        title: "No se encontró el curso",
      });
    }
  }

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCourseId(value);

    setFilteredSuggestions(suggestions.filter((option) => option.includes(value)));
  };

  const handleFilterChange = (attr) => {
    setTopesFilter((prevFilter) => ({
      ...prevFilter,
      [attr]: !prevFilter[attr],
    }));
  };

  const deleteCourse = (courseToDelete) => {
    setCourses(courses.filter(course => course !== courseToDelete));
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
            <h2 className="text-xl font-bold text-white">Topes permitidos</h2>
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
                    <label style={{ color: DEFAULT_TOPES_FILTER[attr] ? 'white' : 'red' }}>
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
      <div className="py-10 px-10">
        <div className={`h-screen flex justify-center`}>
          <div>
            <div className="flex justify-normal space-x-3">

              <Input list="courses" onChange={handleInputChange} value={sigla} type="text" placeholder="Sigla" />
              <Button onClick={fetchData}>Agregar</Button>
            </div>
            <datalist id="courses">
              {filteredSuggestions.map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
            <CourseList courses={courses} onDelete={deleteCourse} combinations={combinations} currentCombinationIndex={currentCombinationIndex} />
            <p>Cantidad de combinaciones: {combinations.length == 1 && combinations[0]
              ? `0`
              : combinations.length}</p>
            <div className="flex justify-between py-5">
              <Button onClick={decreaseCombinationIndex} variant="outline">Anterior</Button>
              <span>
                {combinations.length == 1 && combinations[0]
                  ? 'No hay combinaciones'
                  : `Combinacion actual: ${currentCombinationIndex + 1}`}
              </span>
              <Button onClick={increaseCombinationIndex} variant="outline" >Siguiente</Button>
            </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <ScheduleTable currentCombination={combinations[currentCombinationIndex]} />
                </div>
                <div className="flex-1">
                  <SectionInfoList groupedSections={combinations[currentCombinationIndex]} />
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}