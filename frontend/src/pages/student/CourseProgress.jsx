import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function CourseProgress() {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/my-courses/${courseId}/progress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setProgress(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  if (loading) return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!progress) return <div className="text-center py-8">No progress data available</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Course Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{progress.course.title}</h1>
          <p className="text-indigo-100">{progress.course.description}</p>
        </div>

        {/* Progress Summary */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold">Your Progress</h2>
              <div className="flex items-center mt-2">
                <div className="w-full md:w-64 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-emerald-500 h-4 rounded-full" 
                    style={{ width: `${progress.completion_percentage}%` }}
                  ></div>
                </div>
                <span className="ml-4 font-medium">
                  {Math.round(progress.completion_percentage)}% Complete
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Lessons</p>
                <p className="text-xl font-bold">{progress.total_lessons}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-xl font-bold text-emerald-600">{progress.completed_lessons}</p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="divide-y divide-gray-200">
          <h3 className="px-6 py-4 font-medium text-gray-900">Lessons</h3>
          {progress.lessons.map(lesson => (
            <div key={lesson.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                  lesson.is_completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {lesson.is_completed ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{lesson.order}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/student/courses/${courseId}/lessons/${lesson.id}`}
                    className="block font-medium text-indigo-600 hover:text-indigo-500 truncate"
                  >
                    {lesson.title}
                  </Link>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span>{formatTime(lesson.duration)}</span>
                    {lesson.is_completed && (
                      <span className="ml-4 flex items-center">
                        <svg className="h-4 w-4 text-emerald-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed on {new Date(lesson.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Link
                    to={`/student/courses/${courseId}/lessons/${lesson.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {lesson.is_completed ? 'Review' : 'Start'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="px-6 py-4 border-t">
          <Link 
            to="/student/progress" 
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            &larr; Back to all courses
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to format seconds into HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}