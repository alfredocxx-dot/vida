import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
  availableUsers: UserProfile[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, availableUsers }) => {
  const [username, setUsername] = useState('alfredo');
  const [password, setPassword] = useState('vida2027');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const found = availableUsers.find(u => u.usuario.toLowerCase() === cleanUser);

    if (found) {
      onLogin(found);
    } else {
      // Fallback creando perfil dinámico si escribe otro usuario
      const custom: UserProfile = {
        id: `usr-${cleanUser}`,
        nombre: username.charAt(0).toUpperCase() + username.slice(1),
        usuario: cleanUser,
        rol: cleanUser === 'admin' || cleanUser === 'alfredo' ? 'Administrador' : 'Participante',
        estatura: 1.70,
        activo: true
      };
      onLogin(custom);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '24px 20px',
      maxWidth: '400px',
      margin: '0 auto',
      gap: '20px'
    }}>
      {/* Logotipo y Título */}
      <div style={{ textAlign: 'center' }}>
        <div className="logo-plate" style={{ padding: '8px 18px', display: 'inline-flex', marginBottom: '16px' }}>
          <span style={{ fontWeight: 800, fontSize: '26px', color: 'var(--brand)', letterSpacing: '-0.03em' }}>
            V<span style={{ color: 'var(--water)' }}>I</span><span style={{ color: 'var(--food)' }}>D</span><span style={{ color: 'var(--move)' }}>A</span>
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Oficinas Saludables 2027</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: '14px' }}>
          Nutrición · Hidratación · Actividad física
        </p>
      </div>

      {/* Formulario */}
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ej. alfredo"
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--line)',
                  fontSize: '15px'
                }}
                required
              />
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-2)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--line)',
                  fontSize: '15px'
                }}
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-2)' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '6px' }}>
            Ingresar a la App
          </button>
        </form>

        {/* Acceso rápido para pruebas */}
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ink-2)', fontWeight: 700, marginBottom: '8px' }}>
            ACCESO RÁPIDO PARA PROBAR:
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => { setUsername('alfredo'); setPassword('vida2027'); }}
              style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '8px', background: 'var(--surface-2)', fontWeight: 700 }}
            >
              👤 Alfredo (Admin)
            </button>
            <button
              onClick={() => { setUsername('ana.g'); setPassword('vida2027'); }}
              style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '8px', background: 'var(--surface-2)', fontWeight: 700 }}
            >
              👩 Ana (Participante)
            </button>
          </div>
        </div>
      </div>

      {/* Versículo bíblico del documento */}
      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-2)', fontStyle: 'italic', padding: '0 10px' }}>
        «Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma.»
        <div style={{ fontWeight: 700, fontStyle: 'normal', fontSize: '12px', marginTop: '4px' }}>
          3 Juan 1:2
        </div>
      </div>
    </div>
  );
};
