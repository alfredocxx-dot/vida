import React, { useState } from 'react';
import { UserProfile, BodyMeasurement } from '../types';
import { calculateIMC, toISODate } from '../utils/helpers';
import { Sparkles, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  user: UserProfile;
  onComplete: (updatedUser: UserProfile, initialMeasurement?: BodyMeasurement) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [estatura, setEstatura] = useState(user.estatura ? String(user.estatura) : '1.70');
  const [peso, setPeso] = useState(user.pesoInicial ? String(user.pesoInicial) : '');
  const [aceptoAviso, setAceptoAviso] = useState(true);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      const estNum = parseFloat(estatura.replace(',', '.')) || 1.70;
      const pesoNum = parseFloat(peso.replace(',', '.')) || 75.0;
      const today = toISODate();

      const updatedUser: UserProfile = {
        ...user,
        estatura: estNum,
        pesoInicial: pesoNum,
        fechaConsentimiento: today
      };

      const initialMeasurement: BodyMeasurement = {
        userId: user.id,
        fecha: today,
        origen: 'Evaluación inicial',
        peso: pesoNum,
        cintura: null,
        imcCalculado: calculateIMC(pesoNum, estNum)
      };

      onComplete(updatedUser, initialMeasurement);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(13, 22, 32, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', borderRadius: '24px', padding: '24px' }}>
        {/* Logo arriba */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img src="./logo-vida.png" alt="VIDA" style={{ height: '36px', width: 'auto', margin: '0 auto' }} />
        </div>

        {/* Paso 1: Propósito */}
        {step === 1 && (
          <div style={{ textAlign: 'center', display: 'grid', gap: '14px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--brand-soft)',
              color: 'var(--brand)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto'
            }}>
              <Sparkles size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>¡Bienvenido, {user.nombre}!</h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)', marginTop: '6px' }}>
                El Proyecto VIDA te acompaña cada día en 3 pilares clave para tu bienestar integral:
              </p>
            </div>
            <div style={{ display: 'grid', gap: '8px', textAlign: 'left', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--water-soft)', padding: '10px 12px', borderRadius: '12px', color: 'var(--water-ink)' }}>
                <span>💧</span> <b>Hidratación:</b> 8 vasos de agua pura al día
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--food-soft)', padding: '10px 12px', borderRadius: '12px', color: 'var(--food-ink)' }}>
                <span>🥗</span> <b>Nutrición:</b> Verduras frescas y menos ultraprocesados
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--move-soft)', padding: '10px 12px', borderRadius: '12px', color: 'var(--move-ink)' }}>
                <span>🏃</span> <b>Actividad física:</b> 30 min al día (¡sábado es reposo!)
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Datos básicos */}
        {step === 2 && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Tu Línea Base</h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-2)', margin: '4px 0 0' }}>
                Solo lo básico para calcular tu avance y tu índice de salud:
              </p>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Estatura (en metros)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej. 1.72"
                  value={estatura}
                  onChange={e => setEstatura(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Peso inicial aproximado (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej. 78.5"
                  value={peso}
                  onChange={e => setPeso(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)' }}
                />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
              * Podrás actualizar o afinar estos datos en cualquier momento desde la pestaña Medidas.
            </div>
          </div>
        )}

        {/* Paso 3: Aviso de Privacidad y Consentimiento */}
        {step === 3 && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--good-soft)',
              color: 'var(--good)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto'
            }}>
              <ShieldCheck size={26} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Compromiso y Privacidad</h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-2)', margin: '4px 0 0' }}>
                La participación es voluntaria conforme al Documento Rector VIDA.
              </p>
            </div>
            <div style={{
              background: 'var(--surface-2)',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'var(--ink-2)',
              lineHeight: 1.5,
              maxHeight: '130px',
              overflowY: 'auto'
            }}>
              Tus registros diarios son confidenciales y personales. El Departamento de Salud de la Asociación únicamente supervisa estadísticas globales de participación y constancia de la oficina, promoviendo un estilo de vida saludable y preventivo.
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={aceptoAviso}
                onChange={e => setAceptoAviso(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span>Deseo participar en Oficinas Saludables</span>
            </label>
          </div>
        )}

        {/* Botón de continuar */}
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={step === 3 && !aceptoAviso}
          style={{ marginTop: '18px' }}
        >
          {step < 3 ? (
            <>
              <span>Continuar</span>
              <ArrowRight size={18} />
            </>
          ) : (
            <>
              <Check size={18} strokeWidth={3} />
              <span>¡Comenzar mi día!</span>
            </>
          )}
        </button>

        {/* Puntos de progreso */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
          {[1, 2, 3].map(i => (
            <i
              key={i}
              style={{
                width: i === step ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === step ? 'var(--brand)' : 'var(--line)',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
