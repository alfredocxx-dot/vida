import React from 'react';
import { DailyLog } from '../types';
import { 
  toISODate, 
  addDays, 
  parseISODate, 
  isWaterComplete, 
  isFoodComplete, 
  isMoveComplete, 
  isDayComplete, 
  isSaturday,
  calculateCurrentStreak, 
  getWeeklyActivityMinutes,
  formatShortDate,
  MESES
} from '../utils/helpers';
import { Award, Flame, Droplet, Utensils, Activity } from 'lucide-react';

interface ProgresoScreenProps {
  logs: Record<string, DailyLog>;
}

export const ProgresoScreen: React.FC<ProgresoScreenProps> = ({ logs }) => {
  const today = toISODate();
  const currentMonthDate = new Date();
  const monthName = MESES[currentMonthDate.getMonth()];
  const year = currentMonthDate.getFullYear();

  // Días para el calendario del mes actual
  const firstDayOfMonth = new Date(year, currentMonthDate.getMonth(), 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Lunes = 0
  const daysInMonth = new Date(year, currentMonthDate.getMonth() + 1, 0).getDate();

  // Rachas
  const streakAll = calculateCurrentStreak(logs, today, isDayComplete, false);
  const streakWater = calculateCurrentStreak(logs, today, isWaterComplete, false);
  const streakFood = calculateCurrentStreak(logs, today, isFoodComplete, false);
  const streakMove = calculateCurrentStreak(logs, today, isMoveComplete, true);

  // Semanas recientes
  const weeks = [
    addDays(today, -21),
    addDays(today, -14),
    addDays(today, -7),
    today
  ];

  const maxStreak = Math.max(streakAll, streakWater, streakFood, streakMove);

  return (
    <div className="screen-scrollable">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Mi progreso</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: '14px', textTransform: 'capitalize' }}>
          {monthName} {year}
        </p>
      </div>

      {/* Calendario con 3 puntos por día */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
          Constancia mensual
        </h3>
        
        {/* Cabecera días */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '6px' }}>
          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span style={{ color: 'var(--brand)' }}>S</span><span>D</span>
        </div>

        {/* Celdas del calendario */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {/* Espacios vacíos antes del 1 */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Días del mes */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const entry = logs[dateStr];
            const isToday = dateStr === today;
            const isSat = isSaturday(dateStr);
            const isFuture = dateStr > today;

            const w = isWaterComplete(entry);
            const f = isFoodComplete(entry);
            const m = isMoveComplete(entry, dateStr);

            return (
              <div 
                key={dateStr}
                style={{
                  borderRadius: '10px',
                  padding: '6px 0',
                  display: 'grid',
                  justifyItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: isSat ? 'var(--surface-2)' : 'transparent',
                  border: isToday ? '2px solid var(--brand)' : '1px solid transparent',
                  opacity: isFuture ? 0.3 : 1
                }}
              >
                <span>{dayNum}</span>
                {!isFuture && (
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: w ? 'var(--water)' : 'var(--line)' }} />
                    <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: f ? 'var(--food)' : 'var(--line)' }} />
                    <i style={{ width: '5px', height: '5px', borderRadius: '50%', background: m ? 'var(--move)' : 'var(--line)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: 'var(--ink-2)', marginTop: '14px', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--water)' }} /> Agua
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--food)' }} /> Nutrición
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--move)' }} /> Actividad
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i style={{ width: '8px', height: '8px', borderRadius: '3px', background: 'var(--surface-2)', border: '1px solid var(--line)' }} /> Sábado
          </span>
        </div>
      </div>

      {/* Tarjetas de Rachas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="card">
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-2)' }}>Días completos</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: '26px', fontWeight: 800, marginTop: '2px', color: 'var(--ink)' }}>
            {streakAll} días
          </div>
          <div style={{ fontSize: '11px', color: 'var(--good)', fontWeight: 600 }}>Cadena activa</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--water-ink)' }}>Agua (8 vasos)</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: '26px', fontWeight: 800, marginTop: '2px', color: 'var(--water-ink)' }}>
            {streakWater} días
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-2)' }}>Racha de agua</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--food-ink)' }}>Nutrición</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: '26px', fontWeight: 800, marginTop: '2px', color: 'var(--food-ink)' }}>
            {streakFood} días
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-2)' }}>Verduras y sin ultra</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--move-ink)' }}>Actividad física</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: '26px', fontWeight: 800, marginTop: '2px', color: 'var(--move-ink)' }}>
            {streakMove} días
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-2)' }}>Sábado reposo</div>
        </div>
      </div>

      {/* Minutos semanales */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Actividad física por semana</h3>
        <p style={{ margin: '2px 0 14px', fontSize: '12px', color: 'var(--ink-2)' }}>
          Meta: 150 min/semana (marcada al centro) · Adecuado: 300 min
        </p>

        <div style={{ display: 'grid', gap: '10px' }}>
          {weeks.map(w => {
            const min = getWeeklyActivityMinutes(logs, w);
            const isCur = w === today;
            return (
              <div key={w} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 50px', gap: '10px', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>
                  {formatShortDate(w)} {isCur ? '(hoy)' : ''}
                </span>
                <div style={{ height: '12px', borderRadius: '999px', background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${Math.min(100, (min / 300) * 100)}%`, 
                      background: min >= 150 ? 'var(--good)' : 'var(--move)',
                      borderRadius: '999px' 
                    }} 
                  />
                  {/* Línea meta de 150 min (mitad de 300) */}
                  <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'var(--ink-2)', opacity: 0.5 }} />
                </div>
                <span className="num" style={{ fontWeight: 700, textAlign: 'right' }}>
                  {min} m
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insignias y Reconocimientos */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
          Insignias ganadas
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ display: 'grid', justifyItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: `3px ${maxStreak >= 7 ? 'solid var(--water)' : 'dashed var(--line)'}`,
              color: maxStreak >= 7 ? 'var(--water-ink)' : 'var(--ink-2)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--f-display)',
              fontSize: '16px',
              background: maxStreak >= 7 ? 'var(--water-soft)' : 'transparent'
            }}>
              7
            </div>
            <span>7 días</span>
          </div>

          <div style={{ display: 'grid', justifyItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: `3px ${maxStreak >= 21 ? 'solid var(--food)' : 'dashed var(--line)'}`,
              color: maxStreak >= 21 ? 'var(--food-ink)' : 'var(--ink-2)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--f-display)',
              fontSize: '16px',
              background: maxStreak >= 21 ? 'var(--food-soft)' : 'transparent'
            }}>
              21
            </div>
            <span>21 días</span>
          </div>

          <div style={{ display: 'grid', justifyItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: `3px ${maxStreak >= 40 ? 'solid var(--move)' : 'dashed var(--line)'}`,
              color: maxStreak >= 40 ? 'var(--move-ink)' : 'var(--ink-2)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--f-display)',
              fontSize: '16px',
              background: maxStreak >= 40 ? 'var(--move-soft)' : 'transparent'
            }}>
              40
            </div>
            <span>40 días</span>
          </div>
        </div>
      </div>
    </div>
  );
};
