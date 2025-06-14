import CoursesList from "../Courses/CoursesList";

export default function Courses() {
  return (
    <div className="py-6 bg-white dark:bg-gray-800">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <CoursesList role="instructor" />
      </div>
    </div>
  );
}