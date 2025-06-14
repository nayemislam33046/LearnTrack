// src/pages/student/EnrolledCourses.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/my-courses',{
        headers: {
          'Authorization':`Bearer ${token}`
        }
      });
        setCourses(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) return  <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 dark:text-white">My Courses</h2>
        
        {courses.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg">
                <div className="h-40 bg-gray-200 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No thumbnail
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium dark:text-white text-gray-900">{course.title}</h3>
                  
                  <div>
                    <Link to={`/student/courses/${course.id}/progress`} className='text-blue-500'>See Progression</Link>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/student/courses/${course.id}/learn`}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}