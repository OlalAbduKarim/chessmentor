
import React from 'react';
import { User } from '../types';
import Header from './Header';

interface LearnerDashboardProps {
  user: User;
  onBrowseCourses: () => void;
  onLogout: () => void;
}

const DashboardCard: React.FC<{ title: string; description: string; onClick: () => void, icon: string }> = ({ title, description, onClick, icon }) => (
    <div 
        onClick={onClick}
        className="bg-brand-secondary p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center space-x-4"
    >
        <span className="text-4xl">{icon}</span>
        <div>
            <h3 className="text-xl font-bold text-brand-light">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
);

const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ user, onBrowseCourses, onLogout }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header user={user} onLogoutClick={onLogout} />
      <main className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-brand-light mb-8">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="My Courses" description="Continue your learning journey" onClick={() => {}} icon="📚" />
            <DashboardCard title="Browse Courses" description="Find new experts to learn from" onClick={onBrowseCourses} icon="🔍" />
            <DashboardCard title="Practice Room" description="Hone your skills with puzzles & AI" onClick={() => {}} icon="🧠" />
            <DashboardCard title="Achievements" description="View your progress and certificates" onClick={() => {}} icon="🏆" />
            <DashboardCard title="Messages" description="Connect with your coaches" onClick={() => {}} icon="💬" />
            <DashboardCard title="Profile" description="Manage your account and settings" onClick={() => {}} icon="👤" />
        </div>
      </main>
    </div>
  );
};

export default LearnerDashboard;
