import React from 'react';

interface CaveLogoProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const CaveLogo: React.FC<CaveLogoProps> = ({ size = 24, className = "", strokeWidth = 2 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mountain/Cave Shape */}
      <path 
        d="M2 21L12 3L22 21" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Entrance Arch */}
      <path 
        d="M8 21V17C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17V21" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Base line */}
      <path 
        d="M2 21H22" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default CaveLogo;
