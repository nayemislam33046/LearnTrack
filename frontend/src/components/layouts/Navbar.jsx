import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
          
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="text-sm sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
              LearnTrack Pro
            </Link>

           <div>
             <span className="sm:hidden">
              <ThemeToggle />
             </span>

            {/* Hamburger menu - visible only on small screens */}
            <button 
              onClick={onToggleSidebar}
              className="md:hidden text-gray-700 dark:text-gray-300 ml-2 "
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
           </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span className="hidden sm:block"><ThemeToggle /></span>
            {user ? (
              <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {user.name} ({user.role})
                </p>
                <button
                  onClick={handleLogout}
                  className="px-2 sm:px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
