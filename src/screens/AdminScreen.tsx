import React, { useState } from 'react';
import { UserProfile, AttendanceRecord, AttendanceStatus, BodyMeasurement } from '../types';
import { 
  Users, 
  Grid, 
  CheckSquare, 
  Ruler, 
  Key, 
  ArrowLeft, 
  Download, 
  BellRing, 
  CheckCircle, 
  XCircle,
  Plus
} from 'lucide-react';

interface AdminScreenProps {
  currentUser: UserProfile;
  participants: UserProfile[];
  attendance: AttendanceRecord[];
  onBackToApp: () => void;
  onSaveAttendance: (att: AttendanceRecord[]) => void;
  onAddUser: (user: UserProfile) => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  currentUser,
  participants,
  attendance,
  onBackToApp,
  onSaveAttendance,
  onAddUser
}) => {
  const [activeTab, setActiveTab] = useState<'tablero' | 'participantes' | 'asistencia' | 'evaluaciones' | 'usuarios'>('tablero');
  const [selectedParticipant, setSelectedParticipant] = useState<UserProfile | null>(null);

  // Estados para nuevo usuario
  const [newNombre, setNewNombre] = useState('');
  const [newUsuario, setNewUsuario] = useState('');
  const [newRol, setNewRol] = useState<'Participante' | 'Administrador'>('Participante');

  // Sesión de asistencia actual
  const [currentSessionDate, setCurrentSessionDate] = useState('2027-03-08');

  const currentAttRecord = attendance.find(a => a.fecha === currentSessionDate) || {
    fecha: currentSessionDate,
    records: {}
  };

  const handleSetAttendance = (userId: string, status: AttendanceStatus) => {
    const updated = attendance.map(a => {
      if (a.fecha === currentSessionDate) {
        return {
          ...a,
          records: {
            ...a.records,
            [userId]: status
          }
        };
      }
      return a;
    });
    onSaveAttendance(updated);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre || !newUsuario) return;
    const created: UserProfile = {
      id: `usr-${Date.now()}`,
      nombre: newNombre,
      usuario: newUsuario.toLowerCase(),
      rol: newRol,
      estatura: 1.65,
      activo: true
    };
    onAddUser(created);
    setNewNombre('');
    setNewUsuario('');
    alert(`Cuenta creada para ${created.nombre}. Contraseña temporal: vida-2027`);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '1000px', margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)' }}>
      {/* Barra superior de administración */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onBackToApp} 
            className="btn-ghost" 
            style={{ width: 'auto', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            <span>Volver a la App</span>
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Panel de Administración</h1>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-2)' }}>
              Proyecto VIDA · Asociación Altos de Chiapas
            </p>
          </div>
        </div>

        {/* Pestañas de Admin */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {[
            { id: 'tablero', label: 'Tablero', icon: Grid },
            { id: 'participantes', label: 'Participantes', icon: Users },
            { id: 'asistencia', label: 'Asistencia L/J', icon: CheckSquare },
            { id: 'evaluaciones', label: 'Evaluaciones', icon: Ruler },
            { id: 'usuarios', label: 'Usuarios', icon: Key },
          ].map(tab => {
            const Icon = tab.icon;
            const isAct = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: isAct ? 'var(--brand)' : 'var(--surface)',
                  color: isAct ? '#fff' : 'var(--ink-2)',
                  border: '1px solid',
                  borderColor: isAct ? 'var(--brand)' : 'var(--line)'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido según pestaña */}
      {activeTab === 'tablero' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div className="card">
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-2)' }}>Registraron esta semana</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: '28px', fontWeight: 800, margin: '4px 0' }}>
                9 <small style={{ fontSize: '14px', color: 'var(--ink-2)' }}>de {participants.length}</small>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--good)', fontWeight: 700 }}>90% de participación</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--water-ink)' }}>Vasos de agua al día</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: '28px', fontWeight: 800, margin: '4px 0', color: 'var(--water-ink)' }}>
                7.8 <small style={{ fontSize: '14px', color: 'var(--ink-2)' }}>de 8</small>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>Promedio últimos 7 días</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--move-ink)' }}>Actividad física</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: '28px', fontWeight: 800, margin: '4px 0', color: 'var(--move-ink)' }}>
                165 <small style={{ fontSize: '14px', color: 'var(--ink-2)' }}>min</small>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--good)', fontWeight: 700 }}>Meta de 150 superada</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--good)' }}>Días completos</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: '28px', fontWeight: 800, margin: '4px 0', color: 'var(--good)' }}>
                78%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>3 pilares al día</div>
            </div>
          </div>

          {/* Alertas: Necesitan ánimo */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Seguimiento: Empleados con 3 o más días sin registrar
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--ink-2)' }}>
              El objetivo de la app es el acompañamiento y motivación oportuna.
            </p>

            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--warn-soft)', padding: '10px 14px', borderRadius: '12px', fontSize: '13px' }}>
                <span><b>Gabriela Ortiz</b> · 4 días sin registrar</span>
                <button 
                  onClick={() => alert('Recordatorio enviado a Gabriela Ortiz')}
                  style={{ background: 'var(--surface)', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', border: '1px solid var(--line)' }}
                >
                  Enviar aviso amistoso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participantes */}
      {activeTab === 'participantes' && (
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
            Lista de Personal de Oficina ({participants.length} personas)
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--ink-2)' }}>
            Haz clic en un participante para consultar su ficha de constancia.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--line)', textAlign: 'left', color: 'var(--ink-2)' }}>
                  <th style={{ padding: '8px 10px' }}>Nombre</th>
                  <th style={{ padding: '8px 10px' }}>Usuario</th>
                  <th style={{ padding: '8px 10px' }}>Rol</th>
                  <th style={{ padding: '8px 10px' }}>Estado</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>{p.nombre}</td>
                    <td style={{ padding: '10px', color: 'var(--ink-2)' }}>{p.usuario}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: p.rol === 'Administrador' ? 'var(--brand)' : 'var(--surface-2)', color: p.rol === 'Administrador' ? '#fff' : 'var(--ink)' }}>
                        {p.rol}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ color: p.activo ? 'var(--good)' : 'var(--bad)', fontWeight: 700, fontSize: '12px' }}>
                        {p.activo ? '● Activo' : '● Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedParticipant(p)}
                        style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--surface-2)', fontSize: '12px', fontWeight: 700 }}
                      >
                        Ver ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asistencia Lunes y Jueves */}
      {activeTab === 'asistencia' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Pase de Lista: Activación Física</h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--ink-2)' }}>
                Sesiones obligatorias de lunes y jueves (mínimo 2 horas por semana)
              </p>
            </div>
            <select
              value={currentSessionDate}
              onChange={e => setCurrentSessionDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid var(--line)', fontWeight: 700 }}
            >
              <option value="2027-03-08">Lunes 8 de marzo</option>
              <option value="2027-03-04">Jueves 4 de marzo</option>
              <option value="2027-03-01">Lunes 1 de marzo</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--ink-2)' }}>
                  <th style={{ padding: '8px 10px' }}>Participante</th>
                  <th style={{ padding: '8px 10px' }}>Participación</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(p => {
                  const currentVal = currentAttRecord.records[p.id] || 'N';
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{p.nombre}</td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'inline-flex', borderRadius: '10px', border: '1.5px solid var(--line)', overflow: 'hidden' }}>
                          {(['A', 'P', 'N'] as AttendanceStatus[]).map(st => {
                            const labels = { A: 'Activa', P: 'Parcial', N: 'Nula' };
                            const isSel = currentVal === st;
                            return (
                              <button
                                key={st}
                                onClick={() => handleSetAttendance(p.id, st)}
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  background: isSel ? (st === 'A' ? 'var(--good-soft)' : st === 'P' ? 'var(--warn-soft)' : 'var(--bad-soft)') : 'var(--surface)',
                                  color: isSel ? (st === 'A' ? 'var(--good)' : st === 'P' ? 'var(--warn)' : 'var(--bad)') : 'var(--ink-2)',
                                  borderRight: st !== 'N' ? '1px solid var(--line)' : 'none'
                                }}
                              >
                                {labels[st]}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evaluaciones */}
      {activeTab === 'evaluaciones' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Momentos de Evaluación Anual
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--good-soft)', border: '1px solid var(--good)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--good)', textTransform: 'uppercase' }}>Enero – Febrero</span>
                <h4 style={{ margin: '4px 0', fontSize: '15px' }}>Evaluación Inicial</h4>
                <span style={{ fontSize: '12px', color: 'var(--ink)' }}>Completada (Línea base)</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase' }}>Junio – Julio</span>
                <h4 style={{ margin: '4px 0', fontSize: '15px' }}>Evaluación Intermedia</h4>
                <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>Programada</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase' }}>Noviembre – Diciembre</span>
                <h4 style={{ margin: '4px 0', fontSize: '15px' }}>Evaluación Final</h4>
                <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>Programada</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Tabla 1 · Línea Base Institucional</h3>
              <button 
                onClick={() => alert('Descargando informe para el Documento Rector...')}
                className="btn-ghost" 
                style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} />
                <span>Exportar Excel</span>
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 0' }}>Total personal de oficina</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{participants.length}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 0' }}>Evaluados en línea base</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{participants.length} (100%)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 0' }}>Pilar 1: Estado nutricional predominante</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: 'var(--warn)' }}>Sobrepeso</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 0' }}>Pilar 2: Nivel de actividad física inicial</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: 'var(--move-ink)' }}>Moderado</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0' }}>Pilar 3: Hidratación promedio inicial</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: 'var(--water-ink)' }}>7.2 vasos/día</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Usuarios */}
      {activeTab === 'usuarios' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Crear nueva cuenta</h3>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--ink-2)' }}>
              El empleado ingresa con usuario y contraseña (sin Google).
            </p>
            <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Ej. Roberto Sánchez"
                  value={newNombre}
                  onChange={e => setNewNombre(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid var(--line)' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Usuario</label>
                <input
                  type="text"
                  placeholder="Ej. roberto.s"
                  value={newUsuario}
                  onChange={e => setNewUsuario(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid var(--line)' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Rol</label>
                <select
                  value={newRol}
                  onChange={e => setNewRol(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid var(--line)', fontWeight: 700 }}
                >
                  <option value="Participante">Participante</option>
                  <option value="Administrador">Administrador de campo</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '6px' }}>
                <Plus size={16} />
                <span>Crear cuenta de empleado</span>
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>Restablecer contraseñas</h3>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
              {participants.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: '13px' }}>
                  <div>
                    <b>{p.nombre}</b>
                    <div style={{ fontSize: '11px', color: 'var(--ink-2)' }}>@{p.usuario}</div>
                  </div>
                  <button
                    onClick={() => alert(`Contraseña temporal generada para ${p.usuario}: vida-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="btn-ghost"
                    style={{ width: 'auto', padding: '4px 10px', fontSize: '11px' }}
                  >
                    Restablecer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Ficha Participante */}
      {selectedParticipant && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'grid',
          placeItems: 'center',
          padding: '16px',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{selectedParticipant.nombre}</h2>
                <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                  Usuario: @{selectedParticipant.usuario} · Estatura {selectedParticipant.estatura.toFixed(2)} m
                </div>
              </div>
              <button 
                onClick={() => setSelectedParticipant(null)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-2)', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ margin: '16px 0', display: 'grid', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: '12px' }}>
                <b style={{ fontSize: '13px' }}>Historial últimos 28 días</b>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '3px', marginTop: '8px' }}>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <i key={i} style={{ height: '18px', borderRadius: '4px', background: i % 4 === 0 ? 'var(--good)' : i % 5 === 0 ? 'var(--warn)' : 'var(--good)' }} />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Nota privada del Administrador
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Ej. Animar respecto a la meta de agua o verificar asistencia."
                  style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid var(--line)' }}
                />
              </div>
            </div>

            <button className="btn-primary" onClick={() => setSelectedParticipant(null)}>
              Cerrar ficha
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
