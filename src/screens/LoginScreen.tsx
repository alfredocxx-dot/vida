import React, { useState } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { Lock, User, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  availableUsers: UserProfile[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, availableUsers }) => {
  const [username, setUsername] = useState('alfredo');
  const [password, setPassword] = useState('vida2027');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Ingresa tu nombre de usuario');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Ingresa tu contraseña');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const user = await authService.login(username, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Verifica tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (usr: string) => {
    setUsername(usr);
    setPassword('vida2027');
    setErrorMsg('');
    setIsLoading(true);

    try {
      const user = await authService.login(usr, 'vida2027');
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '24px 20px',
      maxWidth: '420px',
      margin: '0 auto',
      gap: '20px'
    }}>
      {/* Logotipo Oficial */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '10px 16px', background: '#FFFFFF', borderRadius: '18px', boxShadow: 'var(--shadow)', border: '1px solid var(--line)', marginBottom: '14px' }}>
          <img 
            src="./logo-vida.png" 
            alt="VIDA" 
            style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto' }} 
          />
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>Oficinas Saludables 2027</h1>
        <p style={{ margin: '3px 0 0', color: 'var(--ink-2)', fontSize: '14px' }}>
          Nutrición · Hidratación · Actividad física
        </p>
      </div>

      {/* Formulario */}
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Usuario o Correo
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ej. alfredo"
                autoComplete="username"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: errorMsg ? 'var(--bad)' : 'var(--line)',
                  fontSize: '15px',
                  background: 'var(--surface)',
                  color: 'var(--ink)'
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 38px',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: errorMsg ? 'var(--bad)' : 'var(--line)',
                  fontSize: '15px',
                  background: 'var(--surface)',
                  color: 'var(--ink)'
                }}
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-2)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-2)',
                  display: 'grid',
                  placeItems: 'center'
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Mensaje de Error en caso de fallo */}
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bad-soft)',
              color: 'var(--bad)',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '4px', opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Verificando credenciales...' : 'Iniciar Sesión'}</span>
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Acceso Rápido para Pruebas Oficiales */}
        <div style={{ marginTop: '18px', borderTop: '1px solid var(--line)', paddingTop: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ink-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Acceso Rápido para Pruebas:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => handleQuickLogin('alfredo')}
              disabled={isLoading}
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'var(--brand-soft)',
                color: 'var(--brand)',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>👑 Alfredo Jiménez</span>
              <span style={{ fontSize: '10px', background: 'var(--brand)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>ADMIN</span>
            </button>
            <button
              onClick={() => handleQuickLogin('ana.g')}
              disabled={isLoading}
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'var(--surface-2)',
                color: 'var(--ink)',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>👩 Ana Gómez</span>
              <span style={{ fontSize: '10px', color: 'var(--ink-2)' }}>Participante</span>
            </button>
            <button
              onClick={() => handleQuickLogin('benjamin.r')}
              disabled={isLoading}
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'var(--surface-2)',
                color: 'var(--ink)',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>👨 Benjamín Ruiz</span>
              <span style={{ fontSize: '10px', color: 'var(--ink-2)' }}>Participante</span>
            </button>
          </div>
        </div>
      </div>

      {/* Versículo bíblico del documento */}
      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-2)', fontStyle: 'italic', padding: '0 10px' }}>
        «Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma.»
        <div style={{ fontWeight: 700, fontStyle: 'normal', fontSize: '12px', marginTop: '4px', color: 'var(--brand)' }}>
          3 Juan 1:2
        </div>
      </div>
    </div>
  );
};
