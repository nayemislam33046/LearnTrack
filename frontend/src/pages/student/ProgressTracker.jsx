import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProgressOverview = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState(null);
    console.log(errors)
    const { userId } = useParams();

    useEffect(() => {
        const fetchProgressOverview = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/progress-overview`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourses(response.data);
            } catch (error) {
                setError(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressOverview();
    }, [userId]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    }

    if (!courses.length) {
        return <div className="text-center text-red-500 dark:text-red-400">No progress data found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                Progress Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.course_id}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            {course.course_title}
                        </h3>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 mb-2 overflow-hidden">
                            <div
                                className="bg-green-600 dark:bg-green-400 h-full text-xs font-medium text-white text-center leading-5"
                                style={{ width: `${course.percentage}%` }}
                            >
                                {course.percentage}%
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {course.completed} of {course.total} lessons completed
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserProgressOverview;
