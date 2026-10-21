import React, { useState, useEffect } from 'react';
import { DailyLog, ActivityType, MonthlyChallenge } from '../types';
import { toISODate, addDays, formatLongDate, parseISODate, isSaturday } from '../utils/helpers';
import { Droplet, Utensils, Activity, Flag, Plus, Minus, Check, ArrowLeft } from 'lucide-react';

interface RegistroScreenProps {
  logs: Record<string, DailyLog>;
  userId: string;
  challenge: MonthlyChallenge;
  onSave: (log: DailyLog) => void;
  onCancel?: () => void;
}

export const RegistroScreen: React.FC<RegistroScreenProps> = ({ 
  logs, 
  userId, 
  challenge, 
  onSave,
  onCancel 
}) => {
  const today = toISODate();
  const yesterday = addDays(today, -1);

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [isSavedAnimation, setIsSavedAnimation] = useState(false);
  const [draft, setDraft] = useState<DailyLog>({
    userId,
    fecha: today,
    vasos: 0,
    sinAzucar: null,
    verduras: null,
    ultra: null,
    minutos: null,
    tipo: 'Caminata',
    pausa: null,
    reto: null
  });

  // Cargar registro de la fecha seleccionada (o valores limpios)
  useEffect(() => {
    const existing = logs[selectedDate];
    if (existing) {
      setDraft({ ...existing });
    } else {
      setDraft({
        userId,
        fecha: selectedDate,
        vasos: 0,
        sinAzucar: null,
        verduras: null,
        ultra: null,
        minutos: null,
        tipo: 'Caminata',
        pausa: null,
        reto: null
      });
    }
  }, [selectedDate, logs, userId]);

  const isLaboral = parseISODate(selectedDate).getUTCDay() >= 1 && parseISODate(selectedDate).getUTCDay() <= 5;
  const isSat = isSaturday(selectedDate);

  const handleYnToggle = (field: keyof DailyLog, val: boolean) => {
    setDraft(prev => ({
      ...prev,
      [field]: prev[field] === val ? null : val
    }));
  };

  const handleSave = () => {
    setIsSavedAnimation(true);
    
    // Guardado instantáneo
    onSave({
      ...draft,
      fecha: selectedDate,
      userId
    });
  };

  return (
    <div className="screen-scrollable">
      {/* Cabecera con botón volver */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Registro del día</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: '14px' }}>
            {formatLongDate(selectedDate)}
          </p>
        </div>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="btn-ghost" 
            style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ArrowLeft size={14} /> Volver
          </button>
        )}
      </div>

      {/* Tabs Hoy / Ayer */}
      <div style={{
        display: 'inline-flex',
        background: 'var(--surface-2)',
        borderRadius: '14px',
        padding: '4px',
        gap: '4px',
        alignSelf: 'start'
      }}>
        <button
          onClick={() => setSelectedDate(today)}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            background: selectedDate === today ? 'var(--surface)' : 'transparent',
            color: selectedDate === today ? 'var(--ink)' : 'var(--ink-2)',
            boxShadow: selectedDate === today ? 'var(--shadow)' : 'none'
          }}
        >
          Hoy
        </button>
        <button
          onClick={() => setSelectedDate(yesterday)}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            background: selectedDate === yesterday ? 'var(--surface)' : 'transparent',
            color: selectedDate === yesterday ? 'var(--ink)' : 'var(--ink-2)',
            boxShadow: selectedDate === yesterday ? 'var(--shadow)' : 'none'
          }}
        >
          Ayer
        </button>
      </div>

      {/* 1. Pilar Hidratación */}
      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--water-ink)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
          <Droplet size={16} fill="var(--water)" color="var(--water)" />
          Hidratación
        </div>

        <div className="card">
          <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>
            ¿Cuántos vasos de agua pura tomaste hoy?
          </label>

          {/* Grid de Vasos Interactivos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '14px' }}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const num = idx + 1;
              const isFilled = num <= draft.vasos;
              const isTarget = num === 8;
              return (
                <button
                  key={num}
                  onClick={() => setDraft(prev => ({ ...prev, vasos: prev.vasos === num ? num - 1 : num }))}
                  style={{
                    aspectRatio: '3/4',
                    border: '1.5px solid',
                    borderColor: isFilled ? 'var(--water)' : isTarget ? 'var(--water)' : 'var(--line)',
                    borderStyle: isTarget && !isFilled ? 'dashed' : 'solid',
                    borderRadius: '8px',
                    background: isFilled ? 'var(--water-soft)' : 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isFilled ? 'var(--water-ink)' : 'var(--ink-2)',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                  title={`${num} vasos`}
                >
                  <Droplet size={16} fill={isFilled ? 'var(--water)' : 'none'} color={isFilled ? 'var(--water)' : 'var(--ink-2)'} />
                  <span>{num}</span>
                </button>
              );
            })}
          </div>

          {/* Contador numérico +/- */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setDraft(prev => ({ ...prev, vasos: Math.max(0, prev.vasos - 1) }))}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                border: '1.5px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: '20px'
              }}
            >
              <Minus size={18} />
            </button>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: '22px', fontWeight: 800 }}>
              {draft.vasos} vasos
            </div>
            <button
              onClick={() => setDraft(prev => ({ ...prev, vasos: Math.min(15, prev.vasos + 1) }))}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                border: '1.5px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: '20px'
              }}
            >
              <Plus size={18} />
            </button>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: '8px' }}>
            Meta: 8 vasos al día (el vaso con borde punteado).
          </div>
        </div>

        {/* Sin bebidas azucaradas */}
        <div className="card">
          <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>
            ¿Evitaste refrescos y bebidas azucaradas?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleYnToggle('sinAzucar', true)}
              className={`quick-action-btn ${draft.sinAzucar === true ? 'active-yes' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              Sí
            </button>
            <button
              onClick={() => handleYnToggle('sinAzucar', false)}
              className={`quick-action-btn ${draft.sinAzucar === false ? 'active-no' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* 2. Pilar Nutrición */}
      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--food-ink)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
          <Utensils size={16} color="var(--food)" />
          Nutrición
        </div>

        <div className="card">
          <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>
            ¿Comiste verduras en al menos dos comidas?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleYnToggle('verduras', true)}
              className={`quick-action-btn ${draft.verduras === true ? 'active-yes' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              Sí
            </button>
            <button
              onClick={() => handleYnToggle('verduras', false)}
              className={`quick-action-btn ${draft.verduras === false ? 'active-no' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              No
            </button>
          </div>
        </div>

        <div className="card">
          <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>
            ¿Evitaste ultraprocesados? <span style={{ fontWeight: 400, color: 'var(--ink-2)', fontSize: '12px' }}>(frituras, pan dulce industrial, embutidos)</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleYnToggle('ultra', true)}
              className={`quick-action-btn ${draft.ultra === true ? 'active-yes' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              Sí
            </button>
            <button
              onClick={() => handleYnToggle('ultra', false)}
              className={`quick-action-btn ${draft.ultra === false ? 'active-no' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pilar Actividad Física */}
      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--move-ink)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
          <Activity size={16} color="var(--move)" />
          Actividad física
        </div>

        <div className="card">
          <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>
            ¿Cuántos minutos de actividad hiciste?
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[0, 10, 20, 30, 45, 60].map(m => (
              <button
                key={m}
                onClick={() => setDraft(prev => ({ ...prev, minutos: prev.minutos === m ? null : m }))}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '1.5px solid',
                  borderColor: draft.minutos === m ? 'var(--move)' : 'var(--line)',
                  background: draft.minutos === m ? 'var(--move-soft)' : 'var(--surface)',
                  color: draft.minutos === m ? 'var(--move-ink)' : 'var(--ink)'
                }}
              >
                {m === 60 ? '60+ min' : `${m} min`}
              </button>
            ))}
          </div>

          <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', margin: '14px 0 10px' }}>
            Tipo de actividad
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(['Caminata', 'Fuerza', 'Deporte', 'Sesión de oficina'] as ActivityType[]).map(t => (
              <button
                key={t}
                onClick={() => setDraft(prev => ({ ...prev, tipo: prev.tipo === t ? null : t }))}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '1.5px solid',
                  borderColor: draft.tipo === t ? 'var(--move)' : 'var(--line)',
                  background: draft.tipo === t ? 'var(--move-soft)' : 'var(--surface)',
                  color: draft.tipo === t ? 'var(--move-ink)' : 'var(--ink)'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {isSat && (
            <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: '10px', background: 'var(--surface-2)', padding: '6px 10px', borderRadius: '8px' }}>
              ℹ️ Es sábado (reposo): si no hiciste actividad física, tu racha no se rompe.
            </div>
          )}
        </div>

        {/* Pausa Activa (laboral) */}
        {isLaboral && (
          <div className="card">
            <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>
              ¿Hiciste la pausa activa de las 12:00?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => handleYnToggle('pausa', true)}
                className={`quick-action-btn ${draft.pausa === true ? 'active-yes' : ''}`}
                style={{ padding: '12px', fontSize: '14px' }}
              >
                Sí
              </button>
              <button
                onClick={() => handleYnToggle('pausa', false)}
                className={`quick-action-btn ${draft.pausa === false ? 'active-no' : ''}`}
                style={{ padding: '12px', fontSize: '14px' }}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Reto del Mes */}
      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--food-ink)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
          <Flag size={16} color="var(--food)" />
          Reto del mes: {challenge.titulo}
        </div>

        <div className="card">
          <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>
            {challenge.pregunta}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleYnToggle('reto', true)}
              className={`quick-action-btn ${draft.reto === true ? 'active-yes' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              Sí
            </button>
            <button
              onClick={() => handleYnToggle('reto', false)}
              className={`quick-action-btn ${draft.reto === false ? 'active-no' : ''}`}
              style={{ padding: '12px', fontSize: '14px' }}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Botón Guardar con feedback */}
      <button 
        className="btn-primary" 
        onClick={handleSave}
        style={{
          background: isSavedAnimation ? 'var(--good)' : undefined,
          boxShadow: isSavedAnimation ? '0 4px 14px rgba(46, 154, 87, 0.4)' : undefined
        }}
      >
        <Check size={18} strokeWidth={3} />
        <span>{isSavedAnimation ? '¡Registro Guardado!' : 'Guardar y Actualizar Registro'}</span>
      </button>
    </div>
  );
};
