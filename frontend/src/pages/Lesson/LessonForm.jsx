import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LessonForm = ({ editMode = false }) => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        video_url: '',
        notes: '',
        order: 0
    });
    const [loading, setLoading] = useState(editMode);

    useEffect(() => {
        if (editMode) {
            const fetchLesson = async () => {
                try {
                    const token = localStorage.getItem('access_token');
                    
                    const response = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lessons/${lessonId}`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                   
                    setFormData({
                        title: response?.data.title || '',
                        video_url: response?.data.video_url || '',
                        notes: response?.data.notes || '',
                        order: response?.data.order || 0
                    });
                } catch (error) {
                    setError('Error fetching lesson:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchLesson();
        }
    }, [editMode, lessonId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editMode) {
                await axios.put(`http://127.0.0.1:8000/api/lessons/${lessonId}`, formData, config);
            } else {
                await axios.post(`http://127.0.0.1:8000/api/courses/${courseId}/lessons`, formData, config);
            }
            navigate(`/courses/${courseId}/lessons`);
        } catch (error) {
            setError('Error saving lesson:', error);
        }
    };

   if (loading) {
        return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {editMode ? 'Edit Lesson' : 'Add New Lesson'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="mt-1 block w-full text-gray-800 dark:text-white p-1 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder='Enter The Lesson Title'
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">Video URL</label>
                    <input
                        type="url"
                        value={formData.video_url}
                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                        className="mt-1 block w-full rounded-md text-gray-800 p-1 dark:text-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder='Enter The Lesson Video Link url'
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={4}
                        className="mt-1 block w-full rounded-md text-gray-800 p-1 dark:text-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder='Enter The Lesson Notes'
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-white">Order</label>
                    <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full rounded-md text-gray-800 p-1 dark:text-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-800 p-1 dark:text-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        {editMode ? 'Update Lesson' : 'Create Lesson'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LessonForm;