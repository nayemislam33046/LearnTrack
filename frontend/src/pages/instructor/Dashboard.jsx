// src/pages/instructor/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import CourseModal from '../Courses/CourseModal';
import CourseButton from '../Courses/CourseButton';

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [currentCourse, setCurrentCourse] = useState(null);
  
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const [statsResponse, coursesResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/instructors/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://127.0.0.1:8000/api/instructors/recent-courses', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setStats(statsResponse?.data);
      setRecentCourses(coursesResponse?.data);
    } catch (error) {
      setError('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.role]);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
          const token = localStorage.getItem("access_token")
  
          const response = await axios.delete(`http://127.0.0.1:8000/api/courses/${id}`,{
          headers:{Authorization:`Bearer ${token}`}
        });
         
        if (response) {
          window.location.reload();
        }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to delete course');
        }
      }
    };

  if (loading) return  <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="sm:text-3xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
          <CourseButton names="Add Course" className={"inline-flex items-center sm:px-4 px-2 sm:py-2 p-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"} setShowModal={setShowModal} setCurrentCourse={setCurrentCourse}/>
        </div>
        
        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold dark:text-white text-gray-900">{stats.totalStudents}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold dark:text-white text-gray-900">{stats.totalCourses}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Enrollments</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold dark:text-white text-gray-900">{stats.totalEnrollments || 0}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Courses */}
        <div className="mt-8 flex flex-col">
           <h1 className="text-xl mb-2 font-bold text-gray-900 dark:text-white">Recent Course</h1>
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 dark:bg-slate-900">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-dark dark:text-gray-400 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark dark:text-gray-400">
                      Descriptions
                    </th>

                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark dark:text-gray-400">
                      Details
                    </th>
                   
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:bg-gray-900 bg-white">
                  {recentCourses.length === 0 ? (
                    <tr>
                      <td colSpan={user.role === 'admin' ? 4 : 3} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    recentCourses?.map((course) => (
                      <tr key={course.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 text-dark dark:text-white">
                          {course.title}
                        </td>
                        <td className="px-3 py-4 text-sm text-dark dark:text-white max-w-xs truncate">
                          {course.description}
                        </td>

                         <td className="px-3 py-4 text-sm text-dark dark:text-white max-w-xs truncate">
                          <Link to={`/courses/${course.id}/lessons`} state={{course}}>
                          View
                          </Link>
                        </td>
                        
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => {
                              setCurrentCourse(course);
                              setShowModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      </div>
      <CourseModal
              show={showModal}
              onClose={() => setShowModal(false)}
              course={currentCourse}
              onSuccess={fetchData}
              role={user.role}
            />
    </div>
  );
}