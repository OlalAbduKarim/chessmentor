import React, { useState } from 'react';
import { Coach, User, Session } from '../types';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { bookSession } from '../services/firestoreService';
import { LoadingSpinner } from './icons/Icons';

interface BookSessionModalProps {
  coach: Coach;
  student: User;
  onClose: () => void;
  onBookingConfirmed: () => void;
}

export const BookSessionModal: React.FC<BookSessionModalProps> = ({ coach, student, onClose, onBookingConfirmed }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmBooking = async () => {
    if (!date || !time) {
      setError('Please select a date and time.');
      return;
    }
    setLoading(true);
    setError('');

    try {
        const startTime = new Date(`${date}T${time}`);
        if(isNaN(startTime.getTime())){
            setError('Invalid date or time format.');
            setLoading(false);
            return;
        }

      const sessionData: Omit<Session, 'id'> = {
        coachId: coach.id,
        studentId: student.id,
        coachName: coach.name,
        studentName: student.name,
        coachAvatar: coach.avatarUrl,
        studentAvatar: student.avatarUrl,
        startTime: startTime.toISOString(),
        duration: 60, // 60 minutes
        status: 'upcoming',
      };
      
      await bookSession(sessionData);
      onBookingConfirmed();
      
    } catch (err) {
      console.error("Failed to book session", err);
      setError('Could not book session. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Book a Session with ${coach.name}`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="session-date" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Date</label>
          <input
            type="date"
            id="session-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-light-bg dark:bg-dark-bg"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="session-time" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Time</label>
          <input
            type="time"
            id="session-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-light-bg dark:bg-dark-bg"
          />
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">Note: This is a simplified booking system. In a real app, you would see the coach's actual availability.</p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirmBooking} disabled={loading}>
                {loading ? <LoadingSpinner className="w-5 h-5 animate-spin" /> : `Confirm for $${coach.hourlyRate}`}
            </Button>
        </div>
      </div>
    </Modal>
  );
};
