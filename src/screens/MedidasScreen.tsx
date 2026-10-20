import React, { useState } from 'react';
import { UserProfile, BodyMeasurement } from '../types';
import { calculateIMC, getIMCCategory, formatShortDate, toISODate } from '../utils/helpers';
import { Scale, Activity, Plus } from 'lucide-react';

interface MedidasScreenProps {
  user: UserProfile;
  measurements: BodyMeasurement[];
  onAddMeasurement: (item: BodyMeasurement) => void;
}

export const MedidasScreen: React.FC<MedidasScreenProps> = ({ user, measurements, onAddMeasurement }) => {
  const [pesoInput, setPesoInput] = useState('');
  const [cinturaInput, setCinturaInput] = useState('');

  const lastMeasure = measurements[measurements.length - 1] || {
    peso: user.pesoInicial || 80,
    cintura: 90,
    fecha: toISODate(),
    origen: 'Evaluación inicial',
    imcCalculado: calculateIMC(user.pesoInicial || 80, user.estatura)
  };

  const imc = lastMeasure.imcCalculado || calculateIMC(lastMeasure.peso, user.estatura);
  const imcCategory = getIMCCategory(imc);

  // Posición del pin en la barra de IMC (15 a 35)
  const pinPercent = Math.max(0, Math.min(100, ((imc - 15) / 20) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(pesoInput.replace(',', '.'));
    const c = cinturaInput ? parseInt(cinturaInput, 10) : null;

    if (!p || p < 30 || p > 250) {
      alert('Por favor ingresa un peso válido en kilogramos (ej: 81.5)');
      return;
    }

    const calculated = calculateIMC(p, user.estatura);
    onAddMeasurement({
      userId: user.id,
      fecha: toISODate(),
      origen: 'Autorreporte',
      peso: p,
      cintura: c,
      imcCalculado: calculated
    });

    setPesoInput('');
    setCinturaInput('');
  };

  return (
    <div className="screen-scrollable">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Medidas</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: '14px' }}>
          Estatura {user.estatura.toFixed(2)} m · Última medición {formatShortDate(lastMeasure.fecha)}
        </p>
      </div>

      {/* Tarjeta de IMC con escala visual */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Tu Índice de Masa Corporal (IMC)</h3>
        <p style={{ margin: '2px 0 20px', fontSize: '13px', color: 'var(--ink-2)' }}>
          <b style={{ color: 'var(--ink)' }}>{imc.toFixed(1)}</b> · {imcCategory} (criterios de la OMS)
        </p>

        {/* Escala horizontal */}
        <div style={{ position: 'relative', height: '14px', borderRadius: '999px', background: 'linear-gradient(90deg, var(--water) 0 17.5%, var(--good) 17.5% 50%, var(--warn) 50% 75%, var(--bad) 75% 100%)', margin: '30px 0 24px' }}>
          {/* Marcador Pin */}
          <div style={{
            position: 'absolute',
            top: '-28px',
            left: `${pinPercent}%`,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--f-display)',
            fontWeight: 800,
            fontSize: '13px',
            whiteSpace: 'nowrap',
            color: 'var(--ink)'
          }}>
            {imc.toFixed(1)}
            <div style={{
              width: '3px',
              height: '18px',
              background: 'var(--ink)',
              margin: '2px auto 0',
              borderRadius: '2px'
            }} />
          </div>

          {/* Ticks numéricos */}
          <span style={{ position: 'absolute', top: '18px', left: '17.5%', transform: 'translateX(-50%)', fontSize: '11px', color: 'var(--ink-2)' }}>18.5</span>
          <span style={{ position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: 'var(--ink-2)' }}>25</span>
          <span style={{ position: 'absolute', top: '18px', left: '75%', transform: 'translateX(-50%)', fontSize: '11px', color: 'var(--ink-2)' }}>30</span>
        </div>
      </div>

      {/* Semáforo de Hábitos */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Semáforo de hábitos</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--ink-2)' }}>
              Basado en tus últimos 30 días
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <i style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--good)' }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '14px', fontSize: '13px' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '8px 0', fontWeight: 600 }}>Hidratación</td>
              <td style={{ padding: '8px 0', color: 'var(--ink-2)' }}>Promedio 8 vasos/día</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>
                <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'var(--good-soft)', color: 'var(--good)' }}>Adecuado</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '8px 0', fontWeight: 600 }}>Actividad física</td>
              <td style={{ padding: '8px 0', color: 'var(--ink-2)' }}>160 min/semana</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>
                <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'var(--good-soft)', color: 'var(--good)' }}>Adecuado</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 600 }}>Estado nutricional (IMC)</td>
              <td style={{ padding: '8px 0', color: 'var(--ink-2)' }}>{imc.toFixed(1)} kg/m²</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>
                <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: imc < 25 ? 'var(--good-soft)' : 'var(--warn-soft)', color: imc < 25 ? 'var(--good)' : 'var(--warn)' }}>{imcCategory}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: '10px' }}>
          * Este semáforo mide hábitos de constancia; no constituye un diagnóstico clínico.
        </div>
      </div>

      {/* Formulario para registrar peso nuevo */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Registrar nuevo peso</h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Ej. 81.0"
                value={pesoInput}
                onChange={e => setPesoInput(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid var(--line)' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Cintura (cm, opcional)</label>
              <input
                type="number"
                placeholder="Ej. 94"
                value={cinturaInput}
                onChange={e => setCinturaInput(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid var(--line)' }}
              />
            </div>
          </div>
          <button type="submit" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Guardar nueva medida</span>
          </button>
        </form>
      </div>

      {/* Historial */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Historial de mediciones</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--ink-2)', fontSize: '11px' }}>
              <th style={{ padding: '6px 0' }}>Fecha</th>
              <th style={{ padding: '6px 0' }}>Origen</th>
              <th style={{ padding: '6px 0' }}>Peso</th>
              <th style={{ padding: '6px 0' }}>IMC</th>
            </tr>
          </thead>
          <tbody>
            {measurements.slice().reverse().map((m, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>{formatShortDate(m.fecha)}</td>
                <td style={{ padding: '8px 0', color: 'var(--ink-2)' }}>{m.origen}</td>
                <td style={{ padding: '8px 0', fontWeight: 700 }}>{m.peso.toFixed(1)} kg</td>
                <td style={{ padding: '8px 0', fontWeight: 700 }}>{m.imcCalculado.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
