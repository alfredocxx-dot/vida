import React from 'react';
import { MonthlyChallenge, DailyLog } from '../types';
import { MESES } from '../utils/helpers';
import { Flag, CheckCircle, Calendar, Sparkles } from 'lucide-react';

interface RetoScreenProps {
  challenge: MonthlyChallenge;
  logs: Record<string, DailyLog>;
}

export const RetoScreen: React.FC<RetoScreenProps> = ({ challenge, logs }) => {
  const currentMonth = new Date().getMonth();
  const monthName = MESES[currentMonth];

  // Contar días cumplidos del reto en el mes en curso
  let daysCompleted = 0;
  Object.values(logs).forEach(log => {
    if (log && log.reto === true) {
      daysCompleted++;
    }
  });

  const targetDays = 20;
  const progressPercent = Math.min(100, Math.round((daysCompleted / targetDays) * 100));

  return (
    <div className="screen-scrollable">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Reto del mes</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: '14px', textTransform: 'capitalize' }}>
          Trimestre de {challenge.trimestre}
        </p>
      </div>

      {/* Tarjeta del reto actual con barra de 20 días */}
      <div className="card" style={{ borderLeft: '6px solid var(--food)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--food-ink)', letterSpacing: '0.06em' }}>
          {monthName}
        </div>
        <h3 style={{ margin: '4px 0 2px', fontSize: '18px', fontWeight: 700 }}>
          {challenge.titulo}
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-2)' }}>
          {challenge.pregunta}
        </p>

        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            <span>Progreso de insignia</span>
            <span style={{ color: 'var(--food-ink)' }}>{daysCompleted} de {targetDays} días</span>
          </div>
          <div className="bar-track" style={{ height: '10px' }}>
            <div className="bar-fill" style={{ width: `${progressPercent}%`, background: 'var(--food)' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: '6px' }}>
            {daysCompleted >= targetDays ? '🎉 ¡Insignia del mes ganada!' : 'Cumple 20 días en el mes para obtener tu insignia.'}
          </div>
        </div>
      </div>

      {/* Retos del Trimestre */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Retos del trimestre</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <div>
              <b style={{ fontSize: '14px' }}>Enero</b>
              <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>Más vegetales</div>
            </div>
            <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'var(--good-soft)', color: 'var(--good)' }}>
              Completado
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <div>
              <b style={{ fontSize: '14px' }}>Febrero</b>
              <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>Menos ultraprocesados</div>
            </div>
            <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'var(--good-soft)', color: 'var(--good)' }}>
              Completado
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <div>
              <b style={{ fontSize: '14px' }}>Marzo</b>
              <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>Reducción de consumo de carnes</div>
            </div>
            <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'var(--warn-soft)', color: 'var(--warn)' }}>
              En curso
            </span>
          </div>
        </div>
      </div>

      {/* Avisos del Departamento de Salud */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Avisos de Salud</h3>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '10px', display: 'grid', gap: '10px' }}>
          <div>
            <b style={{ fontSize: '13px' }}>Activación física institucional</b>
            <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: '2px' }}>
              Lunes y jueves (2 horas por semana en total). Recuerda llevar ropa y calzado cómodo.
            </div>
          </div>
          <div>
            <b style={{ fontSize: '13px' }}>Convivio saludable de fin de trimestre</b>
            <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: '2px' }}>
              Último sábado del trimestre: degustación de platillos saludables preparados por cada departamento.
            </div>
          </div>
        </div>
      </div>

      {/* Calendario de Próximos Trimestres */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Ruta Anual VIDA 2027</h3>
        <div style={{ fontSize: '12px', color: 'var(--ink-2)', display: 'grid', gap: '6px' }}>
          <div>💧 <b>Abril – Junio:</b> Trimestre de Hidratación</div>
          <div>🏃 <b>Julio – Septiembre:</b> Trimestre de Actividad Física</div>
          <div>✨ <b>Octubre – Diciembre:</b> Salud Integral y Feria de la Salud</div>
        </div>
      </div>
    </div>
  );
};
