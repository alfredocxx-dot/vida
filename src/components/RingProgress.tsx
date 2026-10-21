import React from 'react';

interface RingProgressProps {
  waterOk: boolean;
  foodOk: boolean;
  moveOk: boolean;
  size?: number;
}

export const RingProgress: React.FC<RingProgressProps> = ({ 
  waterOk, 
  foodOk, 
  moveOk, 
  size = 96 
}) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius; // ~213.63
  
  // Cada arco cubre 1/3 de la circunferencia con un espacio (gap) de 8px
  const arcLength = (circumference / 3) - 7; // ~64.2
  const strokeDash = `${arcLength} ${circumference - arcLength}`;

  const completedCount = (waterOk ? 1 : 0) + (foodOk ? 1 : 0) + (moveOk ? 1 : 0);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 84 84" 
        style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        aria-label={`${completedCount} de 3 pilares cumplidos`}
      >
        {/* Defs para sombras suaves */}
        <defs>
          <filter id="glow-water" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0090D8" floodOpacity="0.4"/>
          </filter>
          <filter id="glow-food" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#75B827" floodOpacity="0.4"/>
          </filter>
          <filter id="glow-move" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#F6A81C" floodOpacity="0.4"/>
          </filter>
        </defs>

        {/* ================= SECCIÓN 1: HIDRATACIÓN (Arriba - 0° a 120°) ================= */}
        {/* Fondo inactivo */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          transform="rotate(0 42 42)"
        />
        {/* Arco activo */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={waterOk ? "var(--water)" : "transparent"}
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          transform="rotate(0 42 42)"
          filter={waterOk ? "url(#glow-water)" : undefined}
          style={{ transition: 'stroke 0.4s ease, filter 0.4s ease' }}
        />

        {/* ================= SECCIÓN 2: NUTRICIÓN (Abajo Derecha - 120° a 240°) ================= */}
        {/* Fondo inactivo */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          transform="rotate(120 42 42)"
        />
        {/* Arco activo */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={foodOk ? "var(--food)" : "transparent"}
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          transform="rotate(120 42 42)"
          filter={foodOk ? "url(#glow-food)" : undefined}
          style={{ transition: 'stroke 0.4s ease, filter 0.4s ease' }}
        />

        {/* ================= SECCIÓN 3: ACTIVIDAD FÍSICA (Abajo Izquierda - 240° a 360°) ================= */}
        {/* Fondo inactivo */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          transform="rotate(240 42 42)"
        />
        {/* Arco activo */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={moveOk ? "var(--move)" : "transparent"}
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          transform="rotate(240 42 42)"
          filter={moveOk ? "url(#glow-move)" : undefined}
          style={{ transition: 'stroke 0.4s ease, filter 0.4s ease' }}
        />
      </svg>

      {/* Contenido en el centro del aro */}
      <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ 
          fontFamily: 'var(--f-display)', 
          fontSize: '22px', 
          fontWeight: 800, 
          lineHeight: 1, 
          color: completedCount === 3 ? 'var(--good)' : 'var(--ink)' 
        }}>
          {completedCount}
          <span style={{ fontSize: '13px', color: 'var(--ink-2)', fontWeight: 600 }}>/3</span>
        </div>
      </div>
    </div>
  );
};
