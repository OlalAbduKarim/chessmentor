import React from 'react';
import { Session } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { VideoIcon } from './icons/Icons';

interface SessionViewProps {
  session: Session;
  onBack: () => void;
}

export const SessionView: React.FC<SessionViewProps> = ({ session, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Button onClick={onBack} className="mb-6">
        &larr; Back to Schedule
      </Button>
      <Card className="p-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                Session with {session.studentName} & {session.coachName}
            </h1>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mt-2">
                {new Date(session.startTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
            </p>
        </div>

        <div className="aspect-video bg-dark-bg rounded-lg mt-8 flex flex-col items-center justify-center">
          <VideoIcon className="w-24 h-24 text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-dark-text-primary">Video Call Area</h2>
          <p className="text-dark-text-secondary">The video call will start here.</p>
          <Button className="mt-6" size-lg="true">
            Join Call
          </Button>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">Session Details</h3>
            <div className="flex justify-around text-center">
                <div>
                    <img src={session.studentAvatar} alt={session.studentName} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-light-border dark:border-dark-border" />
                    <p className="mt-2 font-bold text-light-text-primary dark:text-dark-text-primary">{session.studentName}</p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Student</p>
                </div>
                 <div>
                    <img src={session.coachAvatar} alt={session.coachName} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-light-border dark:border-dark-border" />
                    <p className="mt-2 font-bold text-light-text-primary dark:text-dark-text-primary">{session.coachName}</p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Coach</p>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};
