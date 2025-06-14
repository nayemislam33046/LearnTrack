// src/pages/student/CourseList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import EnrollButton from '../Courses/EnrollButton';


export default function CourseList() {
  const { usersData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('access_token')
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/courses',{
          headers:{Authorization:`Bearer ${token}`}
        });
        setCourses(response?.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return  <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="dark:bg-gray-800 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-8">Available Courses</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <div key={course.id} className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg">
              <div className="h-48 bg-gray-200 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                    alt={course?.title}
                    className="w-full h-full object-cover "
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No thumbnail
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium dark:text-white text-gray-900">{course.title}</h3>
                  
                  <Link to={`/student/courses/${course.id}`} className='dark:text-white text-gray-900' state={{course}}>View</Link>

                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{course.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {course.lessons_count} lessons
                  </span>
                  <div>
                    {usersData?.enrolledIn?.(course) ? (
                      <Link
                        to={`/student/courses/${course.id}/learn`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <EnrollButton courseId={course.id} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}