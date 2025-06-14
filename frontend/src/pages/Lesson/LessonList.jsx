import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
const LessonList = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { course } = location.state || {};
    const { courseId } = useParams();

useEffect(() => {
  
}, [course]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/lessons`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLessons(response.data);
            } catch (error) {
                setError('Error fetching lessons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [courseId]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/lessons/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLessons(prevLessons => prevLessons.filter(lesson => lesson.id !== id));
        } catch (error) {
            setError('Error deleting lesson:', error);
        }
    };

    // Convert watch/youtu.be URL to embed format
    const convertYoutubeUrlToEmbed = (url) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
        const match = url?.match(regex);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

if (loading) {
        return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    }
    return (
        <div className="container mx-auto px-4 py-8">
                <div className='my-9'>
                    <p className='dark:text-yellow-500 text-gray-700 text-xl sm:text-4xl text-yellow font-bold'><span className='text-green-500'>Title:</span> {course?.title}</p>
                    <p className='text-md sm:text-lg mt-2 dark:text-white'><span className='dark:text-amber-600'>Description:</span> {course?.description}</p>
                </div>
        
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-bold text-dark dark:text-white">Course Lessons</h2>
                <Link 
                    to={`/courses/${courseId}/lessons/new`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Lesson
                </Link>
            </div>

            <div className="space-y-4">
                {lessons.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No lessons found for this course.</p>
                        <Link 
                            to={`/courses/${courseId}/lessons/new`}
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create First Lesson
                        </Link>
                    </div>
                ) : (
                    lessons?.map(lesson => {
                        const embedUrl = convertYoutubeUrlToEmbed(lesson.video_url);
                        return (
                            <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-xl text-dark dark:text-white">{lesson.title}</h3>
                                        <p className="dark:text-white text-gray-600 mt-1">{lesson.notes}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/courses/${courseId}/lessons/${lesson.id}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(lesson.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

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
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LessonList;
