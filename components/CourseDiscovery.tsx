import React, { useState, useMemo, useCallback } from 'react';
import { Course, CourseLevel, User, UserRole } from '../types';
import { MOCK_COURSES } from '../constants';
import { AISuggestion, getCourseSuggestions } from '../services/geminiService';
import CourseCard from './CourseCard';
import Header from './Header';
import Button from './Button';

interface CourseDiscoveryProps {
  user: User;
  onBack: () => void;
  onLogoutClick: () => void;
}

const CourseDiscovery: React.FC<CourseDiscoveryProps> = ({ user, onBack, onLogoutClick }) => {
  const [filters, setFilters] = useState<{ level: CourseLevel | 'all'; price: number }>({
    level: 'all',
    price: 100,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleFilterChange = <K extends keyof typeof filters,>(key: K, value: (typeof filters)[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => {
      const levelMatch = filters.level === 'all' || course.level === filters.level;
      const priceMatch = course.price <= filters.price;
      const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.coach.name.toLowerCase().includes(searchTerm.toLowerCase());
      return levelMatch && priceMatch && searchMatch;
    });
  }, [filters, searchTerm]);

  const handleGetAiSuggestions = useCallback(async () => {
    if (!user.level) return; // Should not happen for a Learner
    setIsLoadingAi(true);
    setAiSuggestions([]);
    const suggestions = await getCourseSuggestions(user.level);
    setAiSuggestions(suggestions);
    setIsLoadingAi(false);
  }, [user.level]);

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header user={user} onLogoutClick={onLogoutClick} onDashboardClick={onBack} />
      <main className="container mx-auto p-4 md:p-8">
        <Button onClick={onBack} variant="secondary" className="mb-6">
        &larr; Back to Dashboard
        </Button>

        <div className="bg-brand-primary p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-brand-light mb-2">Find Your Perfect Course</h2>
            <p className="text-gray-400 mb-6">Filter by level, price, or search to find your next lesson.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Search by title or coach..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-brand-secondary border border-gray-600 rounded-md text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <select 
                  value={filters.level}
                  onChange={e => handleFilterChange('level', e.target.value as CourseLevel | 'all')}
                  className="w-full px-4 py-2 bg-brand-secondary border border-gray-600 rounded-md text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <option value="all">All Levels</option>
                  {Object.values(CourseLevel).map(level => <option key={level} value={level}>{level}</option>)}
                </select>
                <div>
                  <label className="text-gray-400 block mb-1">Max Price: ${filters.price}</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={filters.price}
                    onChange={e => handleFilterChange('price', parseInt(e.target.value))}
                    className="w-full h-2 bg-brand-secondary rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
                </div>
            </div>
        </div>
        
        {user.role === UserRole.LEARNER && user.level && (
            <div className="bg-brand-secondary p-6 rounded-lg shadow-md mb-8 text-center">
                <h3 className="text-xl font-semibold text-brand-light mb-2">Need Inspiration?</h3>
                <p className="text-gray-400 mb-4">
                    Get AI-powered course suggestions based on your <span className="font-bold text-brand-accent">{user.level}</span> level.
                </p>
                <Button onClick={handleGetAiSuggestions} disabled={isLoadingAi}>
                    {isLoadingAi ? 'Thinking...' : 'Get AI Suggestions'}
                </Button>
                {aiSuggestions.length > 0 && (
                    <div className="mt-6 text-left grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiSuggestions.map((s, i) => (
                            <div key={i} className="bg-brand-primary p-4 rounded-lg border border-brand-accent/50">
                                <h4 className="font-bold text-brand-light">{s.title}</h4>
                                <p className="text-sm text-gray-300">{s.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {filteredCourses.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <h3 className="text-2xl font-bold">No Courses Found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseDiscovery;