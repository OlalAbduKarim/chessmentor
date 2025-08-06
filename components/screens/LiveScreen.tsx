
import React from 'react';
import { Card } from '../ui/Card';
import { Clapperboard } from 'lucide-react';

export const LiveScreen: React.FC = () => {
  return (
    <div className="text-center">
      <Card className="p-8">
        <Clapperboard size={48} className="mx-auto text-primary" />
        <h1 className="text-2xl font-bold mt-4">Live Sessions</h1>
        <p className="text-gray-600 mt-2">Live sessions, upcoming streams, and past recordings will appear here.</p>
      </Card>
    </div>
  );
};
