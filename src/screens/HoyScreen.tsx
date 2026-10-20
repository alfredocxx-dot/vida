import React from 'react';
import { UserProfile, DailyLog, MonthlyChallenge } from '../types';
import { 
  toISODate, 
  formatLongDate, 
  isWaterComplete, 
  isFoodComplete, 
  isMoveComplete, 
  isDayComplete, 
  calculateCurrentStreak, 
  getWeeklyActivityMinutes,
  getMondayOfWeek,
  addDays,
  DIAS_LETRA,
  parseISODate,
  MESES
} from '../utils/helpers';
import { RingProgress } from '../components/RingProgress';
import { Droplet, Utensils, Activity, Flame, Bell, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HoyScreenProps {
  user: UserProfile;
  logs: Record<string, DailyLog>;
  challenge: MonthlyChallenge;
  onGoToRegister: () => void;
}

export const HoyScreen: React.FC<HoyScreenProps> = ({ user, logs, challenge, onGoToRegister }) => {
  const today = toISODate();
  const currentLog = logs[today] || null;

  const waterOk = isWaterComplete(currentLog);
  const foodOk = isFoodComplete(currentLog);
  const moveOk = isMoveComplete(currentLog, today);
  const dayOk = isDayComplete(currentLog, today);

  const completedCount = [waterOk, foodOk, moveOk].filter(Boolean).length;

  const currentStreak = calculateCurrentStreak(logs, today, isDayComplete, false);
  const monday = getMondayOfWeek(today);
  const weeklyMinutes = getWeeklyActivityMinutes(logs, monday);

  // Mensaje de faltantes
  const missing: string[] = [];
  if (!waterOk) missing.push('agua');
  if (!foodOk) missing.push('nutrición');
  if (!moveOk) missing.push('actividad');

  // Lanzar confetti al lograr los 3 pilares
  React.useEffect(() => {
    if (completedCount === 3) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  }, [completedCount]);

  return (
    <div className="screen-scrollable">
      {/* Saludo */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
          Buenos días, {user.nombre.split(' ')[0]}
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: '14px' }}>
          {formatLongDate(today)} · Trimestre de {challenge.trimestre}
        </p>
      </div>

      {/* Resumen Anillo */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <RingProgress completedCount={completedCount} />
        <div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: '32px', fontWeight: 800, lineHeight: 1 }}>
            {completedCount} de 3
          </div>
          <div style={{ color: 'var(--ink-2)', fontSize: '13px', marginTop: '2px' }}>
            pilares cumplidos hoy
          </div>
          <div style={{ fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>
            {completedCount === 3 ? (
              <span style={{ color: 'var(--good)' }}>¡Excelente! Día completo</span>
            ) : (
              <span>Te falta: <span style={{ color: 'var(--brand)' }}>{missing.join(', ')}</span></span>
            )}
          </div>
        </div>
      </div>

      {/* Tarjetas de Pilares */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {/* Pilar Agua */}
        <div className="pillar-row p-water">
          <div className="pi-icon">
            <Droplet size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Hidratación</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--ink-2)' }}>
              <span className="num" style={{ fontWeight: 700, color: 'var(--ink)' }}>{currentLog?.vasos ?? 0} de 8</span> vasos · sin refrescos: {currentLog?.sinAzucar === true ? 'Sí' : currentLog?.sinAzucar === false ? 'No' : 'pendiente'}
            </p>
            <div className="bar-track">
              <div 
                className="bar-fill" 
                style={{ width: `${Math.min(100, Math.round(((currentLog?.vasos ?? 0) / 8) * 100))}%` }} 
              />
            </div>
          </div>
          <div className={`check-circle ${waterOk ? 'checked' : ''}`}>
            <Check size={16} strokeWidth={3} />
          </div>
        </div>

        {/* Pilar Nutrición */}
        <div className="pillar-row p-food">
          <div className="pi-icon">
            <Utensils size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Nutrición</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--ink-2)' }}>
              Verduras en 2 comidas: {currentLog?.verduras === true ? 'Sí' : currentLog?.verduras === false ? 'No' : 'pendiente'} · sin ultraprocesados: {currentLog?.ultra === true ? 'Sí' : currentLog?.ultra === false ? 'No' : 'pendiente'}
            </p>
            <div className="bar-track">
              <div 
                className="bar-fill" 
                style={{ width: `${((currentLog?.verduras ? 50 : 0) + (currentLog?.ultra ? 50 : 0))}%` }} 
              />
            </div>
          </div>
          <div className={`check-circle ${foodOk ? 'checked' : ''}`}>
            <Check size={16} strokeWidth={3} />
          </div>
        </div>

        {/* Pilar Actividad */}
        <div className="pillar-row p-move">
          <div className="pi-icon">
            <Activity size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Actividad física</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--ink-2)' }}>
              <span className="num" style={{ fontWeight: 700, color: 'var(--ink)' }}>{currentLog?.minutos ?? 0} de 30</span> min hoy · semana <span className="num" style={{ fontWeight: 700 }}>{weeklyMinutes} de 150</span>
            </p>
            <div className="bar-track">
              <div 
                className="bar-fill" 
                style={{ width: `${Math.min(100, Math.round(((currentLog?.minutos ?? 0) / 30) * 100))}%` }} 
              />
            </div>
          </div>
          <div className={`check-circle ${moveOk ? 'checked' : ''}`}>
            <Check size={16} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Botón de Registro */}
      <button className="btn-primary" onClick={onGoToRegister}>
        <span>Actualizar mi registro de hoy</span>
        <ArrowRight size={18} />
      </button>

      {/* Racha */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Racha de días completos</h3>
            <div style={{ color: 'var(--ink-2)', fontSize: '12px', marginTop: '2px' }}>
              Sin romper la cadena
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--move)' }}>
            <Flame size={26} fill="var(--move)" />
            <span style={{ fontFamily: 'var(--f-display)', fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
              {currentStreak}
            </span>
          </div>
        </div>

        {/* Tira semanal de 7 días */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginTop: '14px' }}>
          {Array.from({ length: 7 }).map((_, idx) => {
            const date = addDays(today, idx - 6);
            const entry = logs[date];
            const isDone = isDayComplete(entry, date);
            const isCurr = date === today;
            const dayNum = parseISODate(date).getUTCDay();

            return (
              <div key={date} style={{ display: 'grid', justifyItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--ink-2)' }}>
                <span>{DIAS_LETRA[dayNum]}</span>
                <i style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  background: isDone ? 'var(--good)' : 'var(--surface-2)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  border: isCurr ? '2px solid var(--brand)' : 'none',
                  fontStyle: 'normal'
                }}>
                  {isDone ? <Check size={16} strokeWidth={3} /> : ''}
                </i>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reto del mes */}
      <div className="card" style={{ borderLeft: '6px solid var(--food)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--food-ink)', letterSpacing: '0.06em' }}>
          Reto de {MESES[new Date().getMonth()]}
        </div>
        <h3 style={{ margin: '4px 0 2px', fontSize: '16px', fontWeight: 700 }}>
          {challenge.titulo}
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-2)' }}>
          {challenge.pregunta} Contéstalo en tu registro.
        </p>
      </div>

      {/* Pausa Activa */}
      <div className="card" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'var(--move-soft)',
          color: 'var(--move-ink)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0
        }}>
          <Bell size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Pausa activa a las 12:00</h3>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--ink-2)' }}>
            3 a 5 minutos de estiramiento en tu lugar de trabajo.
          </p>
        </div>
      </div>
    </div>
  );
};
