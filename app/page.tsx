"use client"
import ScheduleTable from '@/components/ScheduleTable';
import { useEffect, useState } from 'react';

export default function Index() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  console.log("Im rendering")

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch('/api/scrape_course', {
        method: 'POST',
        body: JSON.stringify({
          courseId: 'MAT1630',
        })
      });
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="h-16 bg-white-500 flex items-center justify-between px-4 z-10">
        <button onClick={toggleSidebar} className="text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isSidebarOpen && (
        <div className="h-screen w-64 bg-gray-800 fixed top-16 left-0">
          <p>Sidebar content...</p>
        </div>
      )}
      <div className="h-screen w-full flex justify-center items-center">
        <div>
          <ScheduleTable/>
        </div>
      </div>
    </>
  );
}