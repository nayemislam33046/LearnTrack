import React from 'react'
import { useLocation } from 'react-router-dom'
import EnrollButton from '../Courses/EnrollButton';
const CourseDetails = () => {
    const location = useLocation()
    const { course } = location.state || {};
  return (
    <div className='m-5'>
        <p className='text-slate-800 dark:text-white text-4xl my-2'>{course.title}</p>
        <p className='text-slate-800 dark:text-white'>{course.description}</p>
        <div className='mt-5'>
            <EnrollButton courseId={course.id}/>
        </div>
    </div>
  )
}

export default CourseDetails