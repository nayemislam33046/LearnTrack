import { PlusIcon } from '@heroicons/react/16/solid';
import React from 'react'

const CourseButton = ({setCurrentCourse, setShowModal, className, names}) => {
    const handleClick = () => {
        setCurrentCourse(null); 
        setShowModal(true);   
    };
    
    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                className={className}
            >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              {names}
            </button>
        </div>
    )
}

export default CourseButton