import React from 'react';

interface RingProgressProps {
  completedCount: number; // 0..3
  size?: number;
}

export const RingProgress: React.FC<RingProgressProps> = ({ completedCount, size = 84 }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - completedCount / 3);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 84 84" 
      style={{ flexShrink: 0 }}
      aria-label={`${completedCount} de 3 pilares cumplidos`}
    >
      {/* Fondo */}
      <circle 
        cx="42" 
        cy="42" 
        r={radius} 
        fill="none" 
        stroke="var(--surface-2)" 
        strokeWidth="10" 
      />
      {/* Progreso activo */}
      <circle 
        cx="42" 
        cy="42" 
        r={radius} 
        fill="none" 
        stroke={completedCount === 3 ? "var(--good)" : "var(--brand)"} 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeDasharray={circumference} 
        strokeDashoffset={strokeDashoffset} 
        transform="rotate(-90 42 42)" 
        style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
      />
    </svg>
  );
};
