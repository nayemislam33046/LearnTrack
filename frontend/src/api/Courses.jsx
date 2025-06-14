import axios from 'axios';

const token = localStorage.getItem('access_token'); // Or your token storage method
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers:{Authorization:`Bearer ${token}`}
});

// Add request interceptor to inject token
api.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default {
  // Get all courses (admin) or instructor's courses
  async getCourses() {
    return await api.get('/courses');
  },

  // Create new course
  async createCourse(courseData) {
    return await api.post('/courses', courseData);
  },

  // Update course
  async updateCourse(id, courseData) {
    return await api.put(`/courses/${id}`, courseData);
  },

  // Delete course
  async deleteCourse(id) {
    return await api.delete(`/courses/${id}`);
  }
};