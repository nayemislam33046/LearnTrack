import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RoleRedirect = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserAndRedirect = () => {
            try {
                setLoading(true);
                const userData = localStorage.getItem('user');
                
                if (!userData) {
                    navigate('/login');
                    return;
                }

                const user = JSON.parse(userData);
                
                switch(user.role) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'instructor':
                        navigate('/instructor/dashboard');
                        break;
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    default:
                        navigate('/login');
                }
            } catch (err) {
                setError('Redirect error:', err);
                setError('Failed to determine user role');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkUserAndRedirect();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return null;
};

export default RoleRedirect;