import React, { useState } from 'react';
import { Course, Lesson } from '../types';
import { Card } from './common/Card';
import { ChessBoardIcon, VideoIcon } from './icons/Icons';
import { Button } from './common/Button';
import { AIAssistant } from './AIAssistant';

interface CourseViewProps {
  course: Course;
  onBack: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({ course, onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(course.lessons[0]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Button onClick={onBack} className="mb-6">
        &larr; Back to Coach Profile
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: lesson content */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <VideoIcon className="h-16 w-16 text-gray-500" />
               <p className="absolute text-white">Video Player Placeholder</p>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">{selectedLesson.title}</h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">{selectedLesson.description}</p>
              <div className="bg-gray-100 dark:bg-dark-bg p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-3 flex items-center">
                  <ChessBoardIcon className="h-5 w-5 mr-2" />
                  Interactive Board
                </h3>
                <div className="aspect-square bg-white border border-light-border dark:border-dark-border rounded-md flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">{selectedLesson.pgn || "Interactive board placeholder"}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: lesson list */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-4 border-b border-light-border dark:border-dark-border">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">{course.title}</h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{course.level}</p>
            </div>
            <ul className="divide-y divide-light-border dark:divide-dark-border max-h-[60vh] overflow-y-auto">
              {course.lessons.map((lesson, index) => (
                <li
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-4 flex items-start gap-4 cursor-pointer transition-colors ${selectedLesson.id === lesson.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                >
                  <span className="text-xl font-bold text-light-text-secondary dark:text-dark-text-secondary">{index + 1}</span>
                  <div>
                    <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary">{lesson.title}</h4>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Video & PGN</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <AIAssistant lessonTitle={selectedLesson.title} />
    </div>
  );
};
