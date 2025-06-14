import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AuthLayout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Side - Branding/Image */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">LearnTrack Pro</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Master new skills with our online courses. Learn anytime, anywhere.
          </p>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Why Join LearnTrack Pro?</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert-led courses
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Progress tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white text-gray-800">
            {location.pathname.includes('login') ? 'Welcome Back' : 'Get Started'}
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Auth Form Content */}
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm">
          <Outlet />
        </div>

        {/* Mobile Footer */}
        <div className="mt-8 text-center md:hidden">
          <p className="text-sm dark:text-gray-400 text-gray-600">
            © {new Date().getFullYear()} SkillSync. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}