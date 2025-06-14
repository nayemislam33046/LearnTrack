// src/pages/student/CourseLessons.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function CourseLessons() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
       const [courseResponse, lessonsResponse] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/courses/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }),
        axios.get(`http://127.0.0.1:8000/api/my-courses/${id}/lessons`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
      ]);
        setCourse(courseResponse?.data);
        setLessons(lessonsResponse.data.data.lessons);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

if (loading) {
        return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    }
      if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {course.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {course.description}
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Lessons</h4>
            <div className="space-y-4">
              {lessons?.map((lesson) => (
                <div key={lesson.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                      {lesson.order}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900">{lesson.title}</h5>
                      <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                      {lesson.duration && (
                        <p className="text-xs text-gray-400 mt-1">
                          Duration: {lesson.duration} minutes
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/student/courses/${course.id}/lessons/${lesson.id}`}
                      className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}