import React from 'react';
import { toISODate, addDays, formatLongDate } from '../utils/helpers';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar } from 'lucide-react';

interface DateSimulatorBarProps {
  currentDate: string;
  onChangeDate: (newDate: string) => void;
  onResetToRealToday: () => void;
}

export const DateSimulatorBar: React.FC<DateSimulatorBarProps> = ({
  currentDate,
  onChangeDate,
  onResetToRealToday
}) => {
  const realToday = toISODate();
  const isSimulated = currentDate !== realToday;

  const handlePrevDay = () => {
    onChangeDate(addDays(currentDate, -1));
  };

  const handleNextDay = () => {
    onChangeDate(addDays(currentDate, 1));
  };

  return (
    <div style={{
      background: isSimulated 
        ? 'linear-gradient(90deg, #F6A81C 0%, #E08900 100%)' 
        : 'var(--surface-2)',
      color: isSimulated ? '#FFFFFF' : 'var(--ink)',
      padding: '8px 12px',
      fontSize: '12px',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      flexWrap: 'wrap',
      transition: 'all 0.3s ease',
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
        <Calendar size={15} />
        <span>
          {isSimulated ? 'Simulador activo:' : 'Fecha de registro:'}
        </span>
        <span style={{ 
          background: isSimulated ? 'rgba(0,0,0,0.2)' : 'var(--surface-1)', 
          padding: '2px 8px', 
          borderRadius: '12px',
          fontFamily: 'var(--f-mono, monospace)',
          fontSize: '11px'
        }}>
          {currentDate}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          type="button"
          onClick={handlePrevDay}
          title="Simular día anterior"
          style={{
            background: isSimulated ? 'rgba(255,255,255,0.25)' : 'var(--surface-1)',
            color: isSimulated ? '#FFFFFF' : 'var(--ink)',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <ChevronLeft size={14} /> Anterior
        </button>

        {isSimulated && (
          <button
            type="button"
            onClick={onResetToRealToday}
            title="Volver al día de hoy real"
            style={{
              background: '#FFFFFF',
              color: '#3B658C',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <RotateCcw size={12} /> Hoy real
          </button>
        )}

        <button
          type="button"
          onClick={handleNextDay}
          title="Simular día siguiente"
          style={{
            background: isSimulated ? 'rgba(255,255,255,0.25)' : 'var(--surface-1)',
            color: isSimulated ? '#FFFFFF' : 'var(--ink)',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Siguiente <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
