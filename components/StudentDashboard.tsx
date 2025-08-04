import React, { useState, useEffect } from 'react';
import { User, Page, Coach, Course, CourseLevel } from '../types';
import { Card } from './common/Card';
import { BookOpenIcon, ChessBoardIcon, StarIcon } from './icons/Icons';
import { Button } from './common/Button';
import { getCoaches, getCourses, getCoachProfile, getCoachMap } from '../services/firestoreService';
import { Loading } from './common/Loading';

interface StudentDashboardProps {
  user: User;
  setPage: <T,>(page: Page, data?: T) => void;
}

const CourseCard: React.FC<{ course: Course, coachName: string, onClick: () => void }> = ({ course, coachName, onClick }) => (
    <Card onClick={onClick} className="flex flex-col h-full">
        <div className="aspect-video bg-gray-700 flex items-center justify-center">
            <BookOpenIcon className="w-12 h-12 text-gray-400" />
        </div>
        <div className="p-4 flex-grow flex flex-col">
            <span className="text-sm font-semibold text-brand-primary">{course.level}</span>
            <h3 className="font-bold text-lg mt-1 text-light-text-primary dark:text-dark-text-primary">{course.title}</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1 flex-grow">{course.description.substring(0, 70)}...</p>
            <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">By {coachName}</p>
            </div>
        </div>
    </Card>
);

const CoachCard: React.FC<{ coach: Coach, onClick: () => void }> = ({ coach, onClick }) => (
    <Card onClick={onClick} className="p-4">
        <div className="flex items-center gap-4">
            <img src={coach.avatarUrl} alt={coach.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
                <h4 className="font-bold text-light-text-primary dark:text-dark-text-primary">{coach.name}</h4>
                <div className="flex items-center text-sm text-yellow-500">
                    <StarIcon className="w-4 h-4 mr-1" />
                    <span>{coach.rating}</span>
                </div>
            </div>
        </div>
    </Card>
);

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, setPage }) => {
  const [dashboardData, setDashboardData] = useState<{
    coaches: Coach[],
    courses: Course[],
    coachesMap: Map<string, string>
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coaches, courses, coachesMap] = await Promise.all([getCoaches(), getCourses(), getCoachMap()]);
        setDashboardData({ coaches, courses, coachesMap });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !dashboardData) {
    return <Loading message="Loading your dashboard..." />;
  }

  const { coaches, courses, coachesMap } = dashboardData;
  const mainCourse = courses[0] || null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="mt-1 text-lg text-light-text-secondary dark:text-dark-text-secondary">Ready for your next move?</p>
      </div>

      {mainCourse && (
        <section>
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Continue Your Path</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
              <Card onClick={() => setPage(Page.COURSE_VIEW, { course: mainCourse })} className="md:col-span-2">
                  <div className="md:flex">
                      <div className="md:w-1/3 aspect-video md:aspect-auto bg-gray-700 flex items-center justify-center">
                          <ChessBoardIcon className="w-16 h-16 text-gray-400"/>
                      </div>
                      <div className="p-6">
                          <span className="text-sm font-semibold text-brand-primary">{mainCourse.level}</span>
                          <h3 className="text-xl font-bold mt-2 text-light-text-primary dark:text-dark-text-primary">{mainCourse.title}</h3>
                          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">You're on lesson 1 of {mainCourse.lessons.length}: {mainCourse.lessons[0].title}.</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                              <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${(1/mainCourse.lessons.length)*100}%` }}></div>
                          </div>
                          <Button className="mt-6" variant="primary" onClick={(e) => { e.stopPropagation(); setPage(Page.COURSE_VIEW, { course: mainCourse });}}>Resume Lesson</Button>
                      </div>
                  </div>
              </Card>
              <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Your Achievements</h3>
                  <Card className="p-4 h-full flex items-center justify-center text-light-text-secondary dark:text-dark-text-secondary">
                    <p>Achievements Coming Soon!</p>
                  </Card>
              </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Suggested Coaches</h2>
          <Button variant="ghost" onClick={() => setPage(Page.EXPLORE)}>Explore All &rarr;</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.slice(0, 4).map(coach => (
            <CoachCard key={coach.id} coach={coach} onClick={() => setPage(Page.COACH_PROFILE, { coach })} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary">Explore New Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map(course => (
            <CourseCard
              key={course.id}
              course={course}
              coachName={coachesMap.get(course.coachId) || 'Unknown Coach'}
              onClick={() => setPage(Page.COURSE_VIEW, { course })}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
