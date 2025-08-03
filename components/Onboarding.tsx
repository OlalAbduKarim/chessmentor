
import React, { useState } from 'react';
import { OnboardingSlide } from '../types';
import GlobeIcon from './icons/GlobeIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import TrophyIcon from './icons/TrophyIcon';
import Button from './Button';

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: "Join Global Coaches and Learners",
    description: "Connect with a diverse community of chess enthusiasts from all over the world.",
    icon: <GlobeIcon className="w-24 h-24 text-brand-accent" />,
  },
  {
    title: "Interactive Classes From Beginner to Master",
    description: "Find the perfect course that matches your skill level and learning goals.",
    icon: <BookOpenIcon className="w-24 h-24 text-brand-accent" />,
  },
  {
    title: "Track Progress & Earn Certificates",
    description: "Monitor your improvement, complete courses, and earn shareable certificates.",
    icon: <TrophyIcon className="w-24 h-24 text-brand-accent" />,
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1;
  const slide = ONBOARDING_SLIDES[currentSlide];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-primary p-8 text-brand-light text-center">
      <div className="w-full max-w-md flex-grow flex flex-col justify-center items-center">
        <div className="mb-8">{slide.icon}</div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{slide.title}</h2>
        <p className="text-gray-300 mb-12">{slide.description}</p>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex justify-center space-x-2 mb-8">
          {ONBOARDING_SLIDES.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-brand-accent' : 'bg-brand-secondary'
              }`}
            />
          ))}
        </div>
        <Button onClick={handleNext} fullWidth>
          {isLastSlide ? "Create My Account" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;