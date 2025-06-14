import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function EnrollButton({ courseId }) {
  const { userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false); // ✅

  useEffect(() => {
    if (userData?.enrollments) {
      const alreadyEnrolled = userData?.enrollments.some(
        (enrollment) => enrollment.course_id === parseInt(courseId)
      );
      setEnrolled(alreadyEnrolled);
    }
  }, [userData, courseId]);

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await axios.post('http://127.0.0.1:8000/api/enroll', 
        { course_id: courseId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
        
      setUserData(response.data);
      setEnrolled(true); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading || enrolled}
        className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? 'Enrolling...' : enrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
