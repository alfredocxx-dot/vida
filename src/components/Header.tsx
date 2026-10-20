import React from 'react';
import { UserProfile } from '../types';
import { isFirebaseConfigured } from '../services/firebase';
import { ShieldCheck, Cloud, CloudOff } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  activeRole: 'Participante' | 'Administrador';
  onToggleRole: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, activeRole, onToggleRole, onLogout }) => {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="logo-plate" style={{ cursor: 'pointer' }} onClick={onToggleRole} title="Cambiar de vista">
          <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--brand)', letterSpacing: '-0.03em' }}>
            V<span style={{ color: 'var(--water)' }}>I</span><span style={{ color: 'var(--food)' }}>D</span><span style={{ color: 'var(--move)' }}>A</span>
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, marginLeft: '6px', color: 'var(--ink-2)', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: '6px' }}>
            {activeRole === 'Administrador' ? 'ADMIN' : 'APP'}
          </span>
        </div>

        {/* Indicador de estado de conexión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--ink-2)' }}>
          {isFirebaseConfigured ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--good)' }}>
              <Cloud size={14} /> Cloud
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--warn)' }}>
              <CloudOff size={14} /> Local
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user.rol === 'Administrador' && (
          <button
            onClick={onToggleRole}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '999px',
              background: activeRole === 'Administrador' ? 'var(--brand)' : 'var(--surface-2)',
              color: activeRole === 'Administrador' ? '#fff' : 'var(--ink)'
            }}
          >
            {activeRole === 'Administrador' ? 'Ver como Móvil' : 'Panel Admin'}
          </button>
        )}

        <button 
          className="avatar-btn" 
          onClick={onLogout}
          title={`${user.nombre} (${user.rol}) - Clic para salir`}
        >
          {user.nombre.charAt(0)}
        </button>
      </div>
    </header>
  );
};
