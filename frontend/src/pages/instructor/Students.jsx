import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token')

  useEffect(() => {
    setLoading(true)
    axios.get('http://127.0.0.1:8000/api/instructors/my-students',{
        headers:{Authorization:`Bearer ${token}`}
    })
      .then(response => {
        setStudents(response.data.students);
        setLoading(false)
      })
      .catch(error => {
        setError('Error fetching students:', error);
        setLoading(false)
      });
  }, []);

if (loading) return  <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

  return (
    <div className="p-4 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Students</h2>
      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Name</th>
              <th className="border-b py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="py-2">{student.name}</td>
                <td className="py-2">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyStudents;
