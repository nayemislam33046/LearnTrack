import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowTrendingUpIcon,
  BookOpenIcon,
  GlobeAltIcon,
  HomeModernIcon,
  ListBulletIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar({ className = '', closeSidebar }) {
  const { user } = useAuth();

  const commonLinks = [
    { to: '/', text: 'Dashboard', icon: <HomeModernIcon className="w-5 h-5" /> },
  ];

  const adminLinks = [
    { to: '/admin/users', text: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
    { to: '/admin/courses', text: 'Courses', icon: <BookOpenIcon className="w-5 h-5" /> },
    { to: '/admin/enrollments', text: 'Enrollments', icon: <ListBulletIcon className="w-5 h-5" /> },
  ];

  const instructorLinks = [
    { to: '/instructor/courses', text: 'My Courses', icon: <BookOpenIcon className="w-5 h-5" /> },
    { to: '/instructor/students', text: 'My Students', icon: <UsersIcon className="w-5 h-5" /> },
    { to: '/instructor/enrollments', text: 'Enrollments', icon: <ListBulletIcon className="w-5 h-5" /> },
  ];

  const studentLinks = [
    { to: '/student/courses', text: 'My Courses', icon: <BookOpenIcon className="w-5 h-5" /> },
    { to: `/student/progress/${user?.id}`, text: 'My Progress', icon: <ArrowTrendingUpIcon className="w-5 h-5" /> },
    { to: '/courses', text: 'Browse Courses', icon: <GlobeAltIcon className="w-5 h-5" /> },
  ];

  const getRoleLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case 'admin': return adminLinks;
      case 'instructor': return instructorLinks;
      case 'student': return studentLinks;
      default: return [];
    }
  };

  const links = [...commonLinks, ...getRoleLinks()];

  return (
    <aside className={`z-50 md:static fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg ${className}`}>
      <div className="p-4">
        {/* Mobile Close Button */}
        {closeSidebar && (
          <div className="flex justify-end mb-4">
            <button onClick={closeSidebar}>
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        )}

        <nav className="mt-6">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg ${isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
