import React, { useState, useEffect } from 'react';
import { User, Page, Coach, Course, Session } from '../types';
import { Card } from './common/Card';
import { BookOpenIcon, StarIcon, CalendarIcon } from './icons/Icons';
import { Button } from './common/Button';
import { getCoachCourses, getUserSessions } from '../services/firestoreService';
import { Loading } from './common/Loading';

interface CoachDashboardProps {
  user: Coach;
  setPage: <T,>(page: Page, data?: T) => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ user, setPage }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedCourses, fetchedSessions] = await Promise.all([
          getCoachCourses(user.id),
          getUserSessions(user.id)
        ]);
        setCourses(fetchedCourses);
        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Error fetching coach dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);
  
  if(loading) return <Loading message="Loading your dashboard..." />;

  const upcomingSessions = sessions.filter(s => new Date(s.startTime) > new Date() && s.status === 'upcoming');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">Welcome back, Coach {user.name.split(' ')[0]}!</h1>
        <p className="mt-1 text-lg text-light-text-secondary dark:text-dark-text-secondary">Here's what's happening today.</p>
      </div>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Total Courses</h3>
                <p className="text-4xl font-bold text-brand-primary mt-2">{courses.length}</p>
            </Card>
             <Card className="p-6">
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Upcoming Sessions</h3>
                <p className="text-4xl font-bold text-brand-primary mt-2">{upcomingSessions.length}</p>
            </Card>
             <Card className="p-6">
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Your Rating</h3>
                 <div className="flex items-center mt-2">
                    <StarIcon className="w-8 h-8 text-yellow-400 mr-2"/>
                    <p className="text-4xl font-bold text-brand-primary">{user.rating}</p>
                </div>
            </Card>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Your Courses</h2>
          <Button variant="ghost" onClick={() => alert('Create new course - TBD')}>Create New &rarr;</Button>
        </div>
        {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <Card key={course.id} onClick={() => setPage(Page.COURSE_VIEW, { course })} className="p-4 flex flex-col">
                        <div className="flex-grow">
                             <span className="text-sm font-semibold text-brand-secondary">{course.level}</span>
                             <h3 className="font-bold text-lg mt-1 text-light-text-primary dark:text-dark-text-primary">{course.title}</h3>
                             <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">{course.lessons.length} lessons</p>
                        </div>
                        <Button variant="secondary" className="w-full mt-4">Manage Course</Button>
                    </Card>
                ))}
            </div>
        ) : (
            <Card className="p-8 text-center text-light-text-secondary dark:text-dark-text-secondary">
                <p>You haven't created any courses yet.</p>
                <Button className="mt-4">Create Your First Course</Button>
            </Card>
        )}
      </section>

      <section>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Your Schedule</h2>
          <Button variant="ghost" onClick={() => setPage(Page.SCHEDULE)}>View Full Schedule &rarr;</Button>
        </div>
        <Card className="p-4">
            {upcomingSessions.length > 0 ? (
                 <ul className="divide-y divide-light-border dark:divide-dark-border">
                    {upcomingSessions.slice(0, 3).map(session => (
                        <li key={session.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <img src={session.studentAvatar} alt={session.studentName} className="w-10 h-10 rounded-full object-cover"/>
                               <div>
                                   <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">Session with {session.studentName}</p>
                                   <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    {new Date(session.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                   </p>
                               </div>
                            </div>
                            <Button variant="secondary" size-sm="true" onClick={() => setPage(Page.SESSION_VIEW, {session})}>Join</Button>
                        </li>
                    ))}
                 </ul>
            ) : (
                <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-4">No upcoming sessions.</p>
            )}
        </Card>
      </section>
    </div>
  );
};
