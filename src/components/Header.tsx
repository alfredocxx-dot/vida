import React from 'react';
import { UserProfile } from '../types';
import { isFirebaseConfigured } from '../services/firebase';
import { Cloud, CloudOff, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  activeRole: 'Participante' | 'Administrador';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleRole: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  activeRole, 
  theme, 
  onToggleTheme, 
  onToggleRole, 
  onLogout 
}) => {
  const isAdmin = user.rol === 'Administrador';

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div 
          className="logo-plate" 
          onClick={isAdmin ? onToggleRole : undefined} 
          style={{ cursor: isAdmin ? 'pointer' : 'default', height: '36px', padding: '3px 8px' }}
          title={isAdmin ? "Toca para alternar vista móvil / administrador" : "VIDA"}
        >
          <img 
            src="./logo-vida.png" 
            alt="VIDA" 
            style={{ height: '28px', width: 'auto', display: 'block' }} 
            onError={(e) => {
              // Fallback texto estilizado si tarda en cargar la imagen
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Estado de sincronización en nube */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 600 }}>
          {isFirebaseConfigured ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--good)' }} title="Sincronizado con Firebase Firestore">
              <Cloud size={13} /> Nube
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--warn)' }} title="Modo Local">
              <CloudOff size={13} /> Local
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Toggle Modo Día / Modo Noche */}
        <button
          onClick={onToggleTheme}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--surface-2)',
            color: 'var(--ink)',
            display: 'grid',
            placeItems: 'center',
            border: '1px solid var(--line)'
          }}
          title={theme === 'light' ? 'Cambiar a Modo Noche' : 'Cambiar a Modo Día'}
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Solo el Administrador ve el botón para ir a su sección exclusiva */}
        {isAdmin && (
          <button
            onClick={onToggleRole}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '6px 10px',
              borderRadius: '999px',
              background: activeRole === 'Administrador' ? 'var(--brand)' : 'var(--surface-2)',
              color: activeRole === 'Administrador' ? '#fff' : 'var(--ink)',
              border: '1px solid',
              borderColor: activeRole === 'Administrador' ? 'var(--brand)' : 'var(--line)'
            }}
          >
            {activeRole === 'Administrador' ? 'Vista Móvil' : 'Panel Admin'}
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
