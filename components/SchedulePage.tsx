import React, { useState, useEffect } from 'react';
import { User, Page, Session, UserRole } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { getUserSessions } from '../services/firestoreService';
import { Loading } from './common/Loading';
import { CalendarIcon } from './icons/Icons';

interface SchedulePageProps {
  user: User;
  setPage: <T,>(page: Page, data?: T) => void;
}

const SessionCard: React.FC<{ session: Session; userRole: UserRole; onView: () => void; }> = ({ session, userRole, onView }) => {
  const isPast = new Date(session.startTime) < new Date();
  const opponent = userRole === UserRole.STUDENT ? 
    { name: session.coachName, avatar: session.coachAvatar, role: 'Coach' } :
    { name: session.studentName, avatar: session.studentAvatar, role: 'Student' };

  return (
    <Card className={`p-4 ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={opponent.avatar} alt={opponent.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              Session with {opponent.name} <span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary">({opponent.role})</span>
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2 mt-1">
              <CalendarIcon className="w-4 h-4"/>
              {new Date(session.startTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>
        </div>
        <Button variant={isPast ? "secondary" : "primary"} onClick={onView}>
          {isPast ? 'View Details' : 'Join Session'}
        </Button>
      </div>
    </Card>
  );
};


export const SchedulePage: React.FC<SchedulePageProps> = ({ user, setPage }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const userSessions = await getUserSessions(user.id);
        setSessions(userSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user.id]);

  if (loading) {
    return <Loading message="Loading your schedule..." />;
  }
  
  const now = new Date();
  const upcomingSessions = sessions.filter(s => new Date(s.startTime) >= now).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const pastSessions = sessions.filter(s => new Date(s.startTime) < now).sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">My Schedule</h1>
        <p className="mt-1 text-lg text-light-text-secondary dark:text-dark-text-secondary">
            View your upcoming and past coaching sessions.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary">Upcoming Sessions</h2>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.map(session => (
              <SessionCard key={session.id} session={session} userRole={user.role} onView={() => setPage(Page.SESSION_VIEW, { session })} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-light-text-secondary dark:text-dark-text-secondary">
            You have no upcoming sessions.
             <Button variant="primary" className="mt-4" onClick={() => setPage(Page.EXPLORE)}>Find a Coach</Button>
          </Card>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary">Past Sessions</h2>
         {pastSessions.length > 0 ? (
          <div className="space-y-4">
            {pastSessions.map(session => (
               <SessionCard key={session.id} session={session} userRole={user.role} onView={() => setPage(Page.SESSION_VIEW, { session })} />
            ))}
          </div>
        ) : (
           <Card className="p-8 text-center text-light-text-secondary dark:text-dark-text-secondary">
            You have no past sessions.
          </Card>
        )}
      </section>
    </div>
  );
};
