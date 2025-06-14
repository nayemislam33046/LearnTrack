// src/pages/student/LessonPlayer.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/my-courses/${courseId}/lessons/${lessonId}`,
          {
            headers:{Authorization:`Bearer ${localStorage.getItem('access_token')}`}
          }
        );
        setLesson(response.data.data);
  
        const courseResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}`,{
            headers:{Authorization:`Bearer ${localStorage.getItem('access_token')}`}
          });
        setCourse(courseResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

 const markAsCompleted = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/my-courses/${courseId}/lessons/${lessonId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      navigate(`/student/courses/${courseId}/learn`);
    } catch (err) {
       setError(error?.response?.data?.message);
    }
  };


if (loading) {
        return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    }
      if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  // Convert watch/youtu.be URL to embed format
    const convertYoutubeUrlToEmbed = (url) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
        const match = url?.match(regex);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };
 const embedUrl = convertYoutubeUrlToEmbed(lesson.video_url);
  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Link
            to={`/student/courses/${courseId}/learn`}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            &larr; Back to lessons
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {course?.title} - {lesson.title}
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="aspect-w-16 aspect-h-9 mb-6">
              {embedUrl ? (
                  <div className="mt-4 aspect-video max-w-xl">
                      <iframe
                          src={embedUrl}
                          className="w-full h-full rounded"
                          allowFullScreen
                          title={lesson.title}
                      />
                  </div>
              ) : (
                  <p className="text-red-500 mt-2">Invalid or unsupported video URL.</p>
              )}
            </div>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            
            <div className="mt-6">
              <button
                onClick={markAsCompleted}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}