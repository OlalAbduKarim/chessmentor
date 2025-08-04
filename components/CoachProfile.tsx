import React, { useState, useEffect, useContext } from 'react';
import { Coach, Course, Page, AppContextType } from '../types';
import { Card } from './common/Card';
import { StarIcon, BookOpenIcon } from './icons/Icons';
import { Button } from './common/Button';
import { getCoachCourses, getCoachProfile } from '../services/firestoreService';
import { Loading } from './common/Loading';
import { BookSessionModal } from './BookSessionModal';
import { AppContext } from '../App';

interface CoachProfileProps {
  coach?: Coach;
  coachId?: string;
  onBack: () => void;
  onViewCourse: (course: Course) => void;
  setPage: AppContextType['setPage'];
}

export const CoachProfile: React.FC<CoachProfileProps> = ({ coach: initialCoach, coachId, onBack, onViewCourse, setPage }) => {
  const [coach, setCoach] = useState<Coach | null>(initialCoach || null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const appContext = useContext(AppContext);
  const student = appContext?.user;


  useEffect(() => {
    const fetchCoachData = async () => {
      setLoading(true);
      try {
        let currentCoach = initialCoach;
        if (!currentCoach && coachId) {
          const fetchedCoach = await getCoachProfile(coachId);
          currentCoach = fetchedCoach;
          setCoach(fetchedCoach);
        }
        
        if (currentCoach) {
          const coachCourses = await getCoachCourses(currentCoach.id);
          setCourses(coachCourses);
        }
      } catch (error) {
        console.error("Failed to fetch coach data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [coachId, initialCoach]);

  if (loading) return <Loading message="Loading coach profile..." />;
  if (!coach) return <div className="text-center py-10">Coach not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Button onClick={onBack} className="mb-6">
        &larr; Back to Explore
      </Button>
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img src={coach.avatarUrl} alt={coach.name} className="w-32 h-32 rounded-full mx-auto sm:mx-0 object-cover" />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">{coach.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-light-text-secondary dark:text-dark-text-secondary">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">{coach.rating} FIDE</span>
              <span>&bull;</span>
              <span>{coach.experience} years experience</span>
            </div>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              {coach.languages.map(lang => (
                <span key={lang} className="bg-gray-200 dark:bg-dark-border text-xs font-medium px-2.5 py-0.5 rounded-full text-light-text-secondary dark:text-dark-text-secondary">{lang}</span>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-auto text-center sm:text-right">
             <Button onClick={() => setIsBooking(true)} className="w-full sm:w-auto">Book Private Session</Button>
             <p className="text-lg font-semibold mt-2 text-light-text-primary dark:text-dark-text-primary">${coach.hourlyRate}/hr</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold border-b border-light-border dark:border-dark-border pb-2 mb-4 text-light-text-primary dark:text-dark-text-primary">About Me</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">{coach.bio}</p>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">Specialties</h3>
            <div className="flex flex-wrap gap-2">
                {coach.specialties.map(spec => (
                    <span key={spec} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">{spec}</span>
                ))}
            </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold border-b border-light-border dark:border-dark-border pb-2 mb-4 text-light-text-primary dark:text-dark-text-primary">Courses</h2>
          {courses.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {courses.map(course => (
                 <Card key={course.id} className="p-4" onClick={() => onViewCourse(course)}>
                   <div className="flex items-start gap-4">
                      <div className="bg-brand-secondary/10 p-2 rounded-lg">
                         <BookOpenIcon className="w-6 h-6 text-brand-secondary"/>
                      </div>
                      <div>
                        <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">{course.title}</h4>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{course.level}</p>
                        <span className="text-base font-bold text-brand-secondary mt-2 inline-block">${course.price}</span>
                      </div>
                   </div>
                 </Card>
               ))}
             </div>
          ) : (
            <p className="text-light-text-secondary dark:text-dark-text-secondary">No courses available from this coach yet.</p>
          )}
        </div>
      </Card>
       {isBooking && student && (
        <BookSessionModal
          coach={coach}
          student={student}
          onClose={() => setIsBooking(false)}
          onBookingConfirmed={() => {
            setIsBooking(false);
            setPage(Page.SCHEDULE);
          }}
        />
      )}
    </div>
  );
};
