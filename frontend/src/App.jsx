import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from './components/auth/ProtectedRoute';

import MainLayout from './Layouts/MainLayout';
import AuthLayout from './Layouts/AuthLayout';
import RoleRedirect from './components/auth/RoleRedirect';
import LessonForm from './pages/Lesson/LessonForm';
import LessonList from './pages/Lesson/LessonList';
import CourseList from './pages/student/CourseList';
import EnrolledCourses from './pages/student/EnrolledCourses';
import CourseLessons from './pages/student/CourseLessons';
import LessonPlayer from './pages/student/LessonPlayer';
import CourseProgress from './pages/student/CourseProgress';
import UserProgressOverview from './pages/student/ProgressTracker';

// Lazy-loaded components for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Unauthorized = lazy(() => import('./pages/error/Unauthorized'));
const NotFound = lazy(() => import('./pages/error/NotFound'));

// Admin routes
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminEnrollments = lazy(() => import('./pages/admin/Enrollments'));

// Instructor routes
const InstructorDashboard = lazy(() => import('./pages/instructor/Dashboard'));
const InstructorCourses = lazy(() => import('./pages/instructor/Courses'));
const InstructorStudents = lazy(() => import('./pages/instructor/Students'));
const InstructorEnrollments = lazy(() => import('./pages/instructor/Enrollments'));

// // Student routes
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StudentCourseDetails = lazy(() => import('./pages/student/CourseDetails'));

function App() {
    return (
        <>
                <Routes>
                    {/* Auth routes - public access */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Error routes */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />

                    {/* Protected routes with MainLayout */}
                    <Route element={<MainLayout />}>
                        {/* Admin nested routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/courses" element={<AdminCourses />} />
                            <Route path="/admin/enrollments" element={<AdminEnrollments />} /> 
                        </Route>

                        {/* Instructor nested routes */}
                        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
                            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                            <Route path="/instructor/courses" element={<InstructorCourses />} />
                            <Route path="/instructor/students" element={<InstructorStudents />} />
                            <Route path="/instructor/enrollments" element={<InstructorEnrollments />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['admin', 'instructor']} />}>
                            <Route path="/courses/:courseId/lessons" element={<LessonList />} />
                            <Route path="/courses/:courseId/lessons/new" element={<LessonForm />} />
                            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonForm editMode={true} />} />
                        </Route>

                        {/* Student nested routes */}
                        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                            <Route path="/student/dashboard" element={<StudentDashboard />} />

                            {/* Enrollment routes */}
                            <Route path="/courses" element={<CourseList />} />
                            <Route path="/student/courses" element={<EnrolledCourses />} />
                            <Route path="/student/courses/:id/learn" element={<CourseLessons />} />
                            <Route path="/student/courses/:courseId/lessons/:lessonId" element={<LessonPlayer />} />
                            <Route path="/student/courses/:courseId/progress" element={<CourseProgress />} />
                            <Route path="/student/progress/:userId" element={<UserProgressOverview />} />
                            <Route path="/student/courses/:id" element={<StudentCourseDetails />} />
                        </Route>
                    </Route>

                    {/* Home redirect based on role */}
                    <Route path="/" element={<RoleRedirect />} />
                </Routes>
        </>
    );
}

export default App;