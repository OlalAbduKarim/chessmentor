import React, { useState, useEffect } from 'react';
import { Coach, CourseLevel } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { SearchIcon, StarIcon } from './icons/Icons';
import { getCoaches } from '../services/firestoreService';
import { Loading } from './common/Loading';

interface CoachCardProps {
  coach: Coach;
  onClick: () => void;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach, onClick }) => (
  <Card onClick={onClick} className="flex flex-col">
    <div className="p-5 flex-grow">
      <div className="flex items-center gap-4">
        <img src={coach.avatarUrl} alt={coach.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">{coach.name}</h3>
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <StarIcon className="w-4 h-4" />
            <span>{coach.rating} FIDE</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary h-20 overflow-hidden text-ellipsis">
        {coach.bio}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {coach.specialties.slice(0, 3).map(spec => (
          <span key={spec} className="bg-gray-200 dark:bg-dark-border text-xs font-medium px-2 py-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary">{spec}</span>
        ))}
      </div>
    </div>
    <div className="p-4 bg-gray-50 dark:bg-dark-bg border-t border-light-border dark:border-dark-border flex justify-between items-center">
        <span className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">${coach.hourlyRate}<span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary">/hr</span></span>
        <Button variant="secondary" size-sm="true">View Profile</Button>
    </div>
  </Card>
);

interface ExplorePageProps {
    onSelectCoach: (coach: Coach) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectCoach }) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    const fetchAndSetCoaches = async () => {
      setLoading(true);
      try {
        const fetchedCoaches = await getCoaches();
        setCoaches(fetchedCoaches);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetCoaches();
  }, []);

  const filteredCoaches = coaches.filter(coach => {
    return (
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (language === '' || coach.languages.includes(language))
      // Level filter is a placeholder as it requires more complex logic based on courses
    );
  });
  
  const allLanguages = Array.from(new Set(coaches.flatMap(c => c.languages)));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">Find Your Mentor</h1>
        <p className="mt-2 text-lg text-light-text-secondary dark:text-dark-text-secondary">Search for world-class coaches to elevate your game.</p>
      </header>

      <div className="sticky top-16 z-10 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm py-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by coach name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full py-2 px-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface focus:ring-brand-primary focus:border-brand-primary">
            <option value="">All Languages</option>
            {allLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)} className="w-full py-2 px-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface focus:ring-brand-primary focus:border-brand-primary">
            <option value="">All Levels</option>
            {Object.values(CourseLevel).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      
      {loading ? (
        <Loading message="Finding top coaches..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCoaches.map(coach => (
            <CoachCard key={coach.id} coach={coach} onClick={() => onSelectCoach(coach)} />
          ))}
        </div>
      )}
    </div>
  );
};
