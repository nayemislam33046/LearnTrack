import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dark:bg-gray-800 dark:text-white pt-12 pb-6 bg-white text-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About SkillSync */}
          <div className="space-y-4">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-indigo-400 mr-2" />
              <span className="text-xl font-bold">LearnTrack Pro</span>
            </div>
            <p className="text-dark dark:text-gray-300">
              Empowering learners with high-quality online courses to advance their careers and personal growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses/development" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses/design" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  Design
                </Link>
              </li>
              <li>
                <Link to="/courses/business" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  Business
                </Link>
              </li>
              <li>
                <Link to="/courses/marketing" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  Marketing
                </Link>
              </li>
              <li>
                <Link to="/courses/it" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  IT & Software
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" />
                <span className="text-dark dark:text-gray-300">
                  123 Learning St, Education City<br />
                  CA 90210, United States
                </span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-indigo-400 mr-2" />
                <a href="tel:+11234567890" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                  +1 (123) 456-7890
                </a>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-indigo-400 mr-2" />
                <a href="mailto:info@skillsync.com" className="text-dark dark:text-gray-300 hover:text-gray-600 dark:hover:text-amber-500 transition-colors">
                  info@learntrack.com
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-700 dark:text-white text-sm">
              &copy; {currentYear} LearnTrack Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-amber-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-amber-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-amber-500 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;