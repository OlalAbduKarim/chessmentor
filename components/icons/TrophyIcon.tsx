
import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 119 0zM18 2.25a7.5 7.5 0 00-7.5 7.5c0 1.55.46 3.018 1.25 4.25m12.5 0A7.5 7.5 0 009.75 3.75M3 13.5a7.5 7.5 0 011.25-4.25m0 0A7.5 7.5 0 0114.25 3.75" />
  </svg>
);

export default TrophyIcon;
