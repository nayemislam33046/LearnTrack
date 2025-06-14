import { useEffect, useState } from 'react';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import CourseModal from './CourseModal';
import CourseButton from './CourseButton';
import { Link } from 'react-router-dom';
import EnrollButton from './EnrollButton';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'))

  const fetchCourses = async () => {
    try {
        const token = localStorage.getItem("access_token")
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/courses",{
        headers:{Authorization:`Bearer ${token}`}
      });
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, [user.role]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem("access_token")
        const response = await axios.delete(`http://127.0.0.1:8000/api/courses/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      console.log(response)
        fetchCourses();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        
          <h1 className="sm:text-3xl text-xl font-semibold dark:text-white text-gray-900">
            {user.role === 'admin' ? 'All Courses' : 'My Courses'}
          </h1>
       
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <CourseButton names="Add Course" className={"inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"} setShowModal={setShowModal} setCurrentCourse={setCurrentCourse}/>
        </div>
      </div>

      <div className="mt-8 flex flex-col dark:bg-slate-900 bg-gray-50">
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
                      Description
                    </th>

                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark dark:text-gray-400">
                      Details
                    </th>

                    {user.role !== 'admin' && user.role !== 'instructor' &&(
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Purchase</span>
                    </th>
                    )}

                    {user.role === 'admin' && (
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-dark dark:text-gray-400">
                        Instructor
                      </th>
                    )}
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:bg-gray-900 bg-white">
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={user.role === 'admin' ? 4 : 3} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    courses?.map((course) => (
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

                        {user.role !== 'admin' && user.role !== 'instructor' &&(
                        <td className="px-3 py-4 text-sm text-dark dark:text-white max-w-xs truncate">
                           <EnrollButton courseId={course.id}/>
                        </td>

                        )}

                        {user.role === 'admin' && (
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-dark dark:text-white">
                            {course.instructor?.name || 'N/A'}
                          </td>
                        )}
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

      <CourseModal
        show={showModal}
        onClose={() => setShowModal(false)}
        course={currentCourse}
        onSuccess={fetchCourses}
        role={user.role}
      />
    </div>
  );
}