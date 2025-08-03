
import React from 'react';
import { Course } from '../types';
import Button from './Button';

interface CourseCardProps {
  course: Course;
}

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
  </svg>
);

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-brand-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-start">
          <div>
             <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                course.level === 'Beginner' ? 'bg-green-200 text-green-800' :
                course.level === 'Intermediate' ? 'bg-blue-200 text-blue-800' :
                'bg-red-200 text-red-800'
             }`}>{course.level}</span>
          </div>
          <div className="flex items-center space-x-1 text-yellow-400">
            <StarIcon className="w-5 h-5" />
            <span className="font-bold text-brand-light">{course.coach.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-brand-light mb-2 flex-grow">{course.title}</h3>
        <p className="text-sm text-gray-400 mb-4">by {course.coach.name}</p>
        
        <div className="mt-auto">
            <div className="flex justify-between items-center text-brand-light mb-4">
              <span className="font-bold text-2xl">${course.price}</span>
              <span className="text-sm text-gray-400">{course.duration}</span>
            </div>
            <Button fullWidth>Enroll Now</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
