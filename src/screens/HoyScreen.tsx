import React from 'react';
import { UserProfile, DailyLog, MonthlyChallenge, ActivityType } from '../types';
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
  MESES,
  isSaturday
} from '../utils/helpers';
import { RingProgress } from '../components/RingProgress';
import { 
  Droplet, 
  Utensils, 
  Activity, 
  Flame, 
  Bell, 
  Check, 
  Edit3, 
  Plus, 
  Minus,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HoyScreenProps {
  user: UserProfile;
  logs: Record<string, DailyLog>;
  challenge: MonthlyChallenge;
  onGoToRegister: () => void;
  onQuickUpdateLog: (updatedLog: DailyLog) => void;
}

export const HoyScreen: React.FC<HoyScreenProps> = ({ 
  user, 
  logs, 
  challenge, 
  onGoToRegister,
  onQuickUpdateLog 
}) => {
  const today = toISODate();
  
  // Log actual de hoy (o plantilla vacía para comenzar a registrar)
  const currentLog: DailyLog = logs[today] || {
    userId: user.id,
    fecha: today,
    vasos: 0,
    sinAzucar: null,
    verduras: null,
    ultra: null,
    minutos: 0,
    tipo: 'Caminata',
    pausa: null,
    reto: null
  };

  const waterOk = isWaterComplete(currentLog);
  const foodOk = isFoodComplete(currentLog);
  const moveOk = isMoveComplete(currentLog, today);
  const dayOk = isDayComplete(currentLog, today);

  const completedCount = [waterOk, foodOk, moveOk].filter(Boolean).length;
  const currentStreak = calculateCurrentStreak(logs, today, isDayComplete, false);
  const monday = getMondayOfWeek(today);
  const weeklyMinutes = getWeeklyActivityMinutes(logs, monday);
  const isSat = isSaturday(today);

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

  // Actualizaciones rápidas pilar por pilar
  const updateWater = (delta: number) => {
    const newVasos = Math.max(0, Math.min(15, (currentLog.vasos || 0) + delta));
    onQuickUpdateLog({
      ...currentLog,
      vasos: newVasos,
      sinAzucar: currentLog.sinAzucar ?? true
    });
  };

  const toggleSinAzucar = (val: boolean) => {
    onQuickUpdateLog({
      ...currentLog,
      sinAzucar: currentLog.sinAzucar === val ? null : val
    });
  };

  const toggleVerduras = (val: boolean) => {
    onQuickUpdateLog({
      ...currentLog,
      verduras: currentLog.verduras === val ? null : val
    });
  };

  const toggleUltra = (val: boolean) => {
    onQuickUpdateLog({
      ...currentLog,
      ultra: currentLog.ultra === val ? null : val
    });
  };

  const addMinutos = (mins: number) => {
    onQuickUpdateLog({
      ...currentLog,
      minutos: (currentLog.minutos || 0) + mins
    });
  };

  const hasAnyRecord = (currentLog.vasos || 0) > 0 || currentLog.sinAzucar !== null || currentLog.verduras !== null || (currentLog.minutos || 0) > 0;

  return (
    <div className="screen-scrollable">
      {/* Saludo y Fecha */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
          Buenos días, {user.nombre.split(' ')[0]}
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: '14px' }}>
          {formatLongDate(today)} · Trimestre de {challenge.trimestre}
        </p>
      </div>

      {/* ANILLO DE 3 PILARES CON EXPLICACIÓN CRISTALINA */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <RingProgress completedCount={completedCount} size={88} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: '34px', fontWeight: 800, lineHeight: 1, color: completedCount === 3 ? 'var(--good)' : 'var(--brand)' }}>
                {completedCount} de 3
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-2)' }}>
                pilares de hoy
              </span>
            </div>

            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.35 }}>
              {completedCount === 3 ? (
                <b style={{ color: 'var(--good)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} /> ¡Felicidades! Día completo cumplido
                </b>
              ) : (
                <span>
                  Cada pilar cumplido llena <b>1/3</b> del círculo. Cumple los 3 para asegurar tu racha.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Estado en vivo de los 3 pilares */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          paddingTop: '12px',
          borderTop: '1px solid var(--line)',
          textAlign: 'center',
          fontSize: '11px'
        }}>
          <div style={{
            padding: '8px 4px',
            borderRadius: '10px',
            background: waterOk ? 'var(--good-soft)' : 'var(--water-soft)',
            color: waterOk ? 'var(--good)' : 'var(--water-ink)',
            fontWeight: 700
          }}>
            <div>💧 Hidratación</div>
            <div style={{ marginTop: '2px', fontSize: '10px' }}>
              {waterOk ? '✓ Cumplido' : `${currentLog.vasos || 0}/8 vasos`}
            </div>
          </div>

          <div style={{
            padding: '8px 4px',
            borderRadius: '10px',
            background: foodOk ? 'var(--good-soft)' : 'var(--food-soft)',
            color: foodOk ? 'var(--good)' : 'var(--food-ink)',
            fontWeight: 700
          }}>
            <div>🥗 Nutrición</div>
            <div style={{ marginTop: '2px', fontSize: '10px' }}>
              {foodOk ? '✓ Cumplido' : (currentLog.verduras ? 'Falta sin ultra' : 'Pendiente')}
            </div>
          </div>

          <div style={{
            padding: '8px 4px',
            borderRadius: '10px',
            background: moveOk ? 'var(--good-soft)' : 'var(--move-soft)',
            color: moveOk ? 'var(--good)' : 'var(--move-ink)',
            fontWeight: 700
          }}>
            <div>🏃 Actividad</div>
            <div style={{ marginTop: '2px', fontSize: '10px' }}>
              {moveOk ? (isSat ? '✓ Reposo' : '✓ Cumplido') : `${currentLog.minutos || 0}/30 min`}
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRO PILAR POR PILAR (INTERACTIVO DIRECTO) */}
      <div style={{ display: 'grid', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800 }}>Registrar hábitos de hoy</h2>
          <span style={{ fontSize: '11px', color: 'var(--ink-2)', fontWeight: 600 }}>Toca para actualizar</span>
        </div>

        {/* 1. TARJETA INTERACTIVA DE HIDRATACIÓN */}
        <div className={`pillar-row p-water ${waterOk ? 'completed' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div className="pi-icon">
              <Droplet size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Hidratación</h3>
                <span style={{ fontSize: '12px', fontWeight: 800, color: waterOk ? 'var(--good)' : 'var(--water-ink)' }}>
                  {currentLog.vasos || 0} de 8 vasos
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--ink-2)' }}>
                Meta: 8 vasos de agua pura y evitar refrescos
              </p>
            </div>
            <div className={`check-circle ${waterOk ? 'checked' : ''}`}>
              <Check size={16} strokeWidth={3} />
            </div>
          </div>

          {/* Controles interactivos directos */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--line)'
          }}>
            {/* Sumar / Restar vasos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => updateWater(-1)}
                className="quick-action-btn"
                style={{ padding: '6px 10px', fontSize: '14px', lineHeight: 1 }}
                title="Quitar un vaso"
              >
                <Minus size={14} />
              </button>
              <span className="num" style={{ fontWeight: 800, fontSize: '14px', minWidth: '60px', textAlign: 'center' }}>
                {currentLog.vasos || 0} vasos
              </span>
              <button
                onClick={() => updateWater(1)}
                className="quick-action-btn"
                style={{ padding: '6px 10px', fontSize: '14px', lineHeight: 1, background: 'var(--water-soft)', borderColor: 'var(--water)', color: 'var(--water-ink)' }}
                title="Sumar un vaso"
              >
                <Plus size={14} /> +1 vaso
              </button>
            </div>

            {/* Toggle sin azucaradas */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}>
              <span style={{ color: 'var(--ink-2)' }}>¿Sin refresco?</span>
              <button
                onClick={() => toggleSinAzucar(true)}
                className={`quick-action-btn ${currentLog.sinAzucar === true ? 'active-yes' : ''}`}
                style={{ padding: '4px 8px' }}
              >
                Sí
              </button>
              <button
                onClick={() => toggleSinAzucar(false)}
                className={`quick-action-btn ${currentLog.sinAzucar === false ? 'active-no' : ''}`}
                style={{ padding: '4px 8px' }}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* 2. TARJETA INTERACTIVA DE NUTRICIÓN */}
        <div className={`pillar-row p-food ${foodOk ? 'completed' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div className="pi-icon">
              <Utensils size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Nutrición</h3>
                <span style={{ fontSize: '12px', fontWeight: 800, color: foodOk ? 'var(--good)' : 'var(--food-ink)' }}>
                  {foodOk ? 'Completo' : 'Pendiente'}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--ink-2)' }}>
                Verduras en 2 comidas y evitar ultraprocesados
              </p>
            </div>
            <div className={`check-circle ${foodOk ? 'checked' : ''}`}>
              <Check size={16} strokeWidth={3} />
            </div>
          </div>

          {/* Controles interactivos directos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--line)'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '4px' }}>
                Verduras en 2 comidas:
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => toggleVerduras(true)}
                  className={`quick-action-btn ${currentLog.verduras === true ? 'active-yes' : ''}`}
                  style={{ flex: 1, padding: '5px' }}
                >
                  Sí
                </button>
                <button
                  onClick={() => toggleVerduras(false)}
                  className={`quick-action-btn ${currentLog.verduras === false ? 'active-no' : ''}`}
                  style={{ flex: 1, padding: '5px' }}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '4px' }}>
                Sin ultraprocesados:
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => toggleUltra(true)}
                  className={`quick-action-btn ${currentLog.ultra === true ? 'active-yes' : ''}`}
                  style={{ flex: 1, padding: '5px' }}
                >
                  Sí
                </button>
                <button
                  onClick={() => toggleUltra(false)}
                  className={`quick-action-btn ${currentLog.ultra === false ? 'active-no' : ''}`}
                  style={{ flex: 1, padding: '5px' }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TARJETA INTERACTIVA DE ACTIVIDAD FÍSICA */}
        <div className={`pillar-row p-move ${moveOk ? 'completed' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div className="pi-icon">
              <Activity size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Actividad física</h3>
                <span style={{ fontSize: '12px', fontWeight: 800, color: moveOk ? 'var(--good)' : 'var(--move-ink)' }}>
                  {isSat ? 'Sábado reposo' : `${currentLog.minutos || 0} de 30 min`}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--ink-2)' }}>
                {isSat ? 'El sábado no rompe tu racha de constancia' : `Meta diaria 30 min · Semana: ${weeklyMinutes} de 150 min`}
              </p>
            </div>
            <div className={`check-circle ${moveOk ? 'checked' : ''}`}>
              <Check size={16} strokeWidth={3} />
            </div>
          </div>

          {/* Selector de minutos en 1 toque */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--line)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-2)' }}>Sumar tiempo:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => addMinutos(15)}
                className="quick-action-btn"
                style={{ padding: '5px 8px', fontSize: '11px' }}
              >
                +15 min
              </button>
              <button
                onClick={() => addMinutos(30)}
                className="quick-action-btn"
                style={{ padding: '5px 8px', fontSize: '11px', background: 'var(--move-soft)', borderColor: 'var(--move)', color: 'var(--move-ink)' }}
              >
                +30 min
              </button>
              <button
                onClick={() => onQuickUpdateLog({ ...currentLog, minutos: 45 })}
                className="quick-action-btn"
                style={{ padding: '5px 8px', fontSize: '11px' }}
              >
                45 min
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÓN PRINCIPAL DUAL: REGISTRAR O MODIFICAR */}
      <button 
        className="btn-primary" 
        onClick={onGoToRegister}
        style={{ marginTop: '4px' }}
      >
        <Edit3 size={18} />
        <span>{hasAnyRecord ? 'Modificar o Ver Registro Completo de Hoy' : 'Registrar Todo el Día Completo'}</span>
      </button>

      {/* Racha de días completos */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Racha de días completos</h3>
            <div style={{ color: 'var(--ink-2)', fontSize: '12px', marginTop: '2px' }}>
              Días consecutivos con los 3 pilares logrados
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

      {/* Reto del mes actual */}
      <div className="card" style={{ borderLeft: '6px solid var(--food)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--food-ink)', letterSpacing: '0.06em' }}>
          Reto de {MESES[new Date().getMonth()]} · Trimestre de {challenge.trimestre}
        </div>
        <h3 style={{ margin: '4px 0 2px', fontSize: '16px', fontWeight: 700 }}>
          {challenge.titulo}
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-2)' }}>
          {challenge.pregunta} Contéstalo en tu registro para ganar la insignia mensual.
        </p>
      </div>

      {/* Pausa Activa de las 12:00 */}
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
