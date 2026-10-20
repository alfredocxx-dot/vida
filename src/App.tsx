import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, BodyMeasurement, AttendanceRecord } from './types';
import { dataService } from './services/dataService';
import { RETOS_MENSUALES } from './services/mockData';
import { Header } from './components/Header';
import { BottomNav, ScreenTab } from './components/BottomNav';
import { LoginScreen } from './screens/LoginScreen';
import { HoyScreen } from './screens/HoyScreen';
import { RegistroScreen } from './screens/RegistroScreen';
import { ProgresoScreen } from './screens/ProgresoScreen';
import { MedidasScreen } from './screens/MedidasScreen';
import { RetoScreen } from './screens/RetoScreen';
import { AdminScreen } from './screens/AdminScreen';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<'Participante' | 'Administrador'>('Participante');
  const [currentTab, setCurrentTab] = useState<ScreenTab>('hoy');
  
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cargar datos al iniciar
  useEffect(() => {
    const loadedParticipants = dataService.getParticipants();
    setParticipants(loadedParticipants);

    const loadedAttendance = dataService.getAttendance();
    setAttendance(loadedAttendance);

    // Usuario inicial por defecto
    const initialUser = dataService.getCurrentUser();
    setUser(initialUser);
  }, []);

  // Cargar registros y medidas cuando cambia el usuario
  useEffect(() => {
    if (user) {
      dataService.getDailyLogs(user.id).then(setLogs);
      dataService.getMeasurements(user.id).then(setMeasurements);
    }
  }, [user]);

  const currentMonthNum = new Date().getMonth() + 1;
  const currentChallenge = RETOS_MENSUALES[currentMonthNum] || RETOS_MENSUALES[3];

  const handleLogin = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    dataService.saveCurrentUser(loggedUser);
    setActiveRole('Participante');
    showToast(`¡Bienvenido, ${loggedUser.nombre}!`);
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Sesión cerrada correctamente');
  };

  const handleSaveLog = async (newLog: DailyLog) => {
    await dataService.saveDailyLog(newLog);
    setLogs(prev => ({ ...prev, [newLog.fecha]: newLog }));
    setCurrentTab('hoy');
    showToast('¡Registro guardado con éxito!');
  };

  const handleAddMeasurement = async (item: BodyMeasurement) => {
    await dataService.saveMeasurement(item);
    setMeasurements(prev => [...prev, item]);
    showToast('Medida corporal guardada');
  };

  const handleSaveAttendance = (updated: AttendanceRecord[]) => {
    dataService.saveAttendance(updated);
    setAttendance(updated);
    showToast('Pase de lista actualizado');
  };

  const handleAddUser = (newUser: UserProfile) => {
    const updated = [...participants, newUser];
    setParticipants(updated);
    localStorage.setItem('vida_participants', JSON.stringify(updated));
    showToast(`Cuenta creada para ${newUser.nombre}`);
  };

  // Si no ha iniciado sesión, mostrar pantalla de Login
  if (!user) {
    return <LoginScreen onLogin={handleLogin} availableUsers={participants} />;
  }

  // Si está en modo Administrador
  if (activeRole === 'Administrador') {
    return (
      <AdminScreen
        currentUser={user}
        participants={participants}
        attendance={attendance}
        onBackToApp={() => setActiveRole('Participante')}
        onSaveAttendance={handleSaveAttendance}
        onAddUser={handleAddUser}
      />
    );
  }

  // Vista Móvil del Participante
  return (
    <div className="mobile-app-container">
      <Header
        user={user}
        activeRole={activeRole}
        onToggleRole={() => setActiveRole(prev => prev === 'Participante' ? 'Administrador' : 'Participante')}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {currentTab === 'hoy' && (
          <HoyScreen
            user={user}
            logs={logs}
            challenge={currentChallenge}
            onGoToRegister={() => setCurrentTab('registro')}
          />
        )}

        {currentTab === 'registro' && (
          <RegistroScreen
            logs={logs}
            userId={user.id}
            challenge={currentChallenge}
            onSave={handleSaveLog}
          />
        )}

        {currentTab === 'progreso' && (
          <ProgresoScreen logs={logs} />
        )}

        {currentTab === 'medidas' && (
          <MedidasScreen
            user={user}
            measurements={measurements}
            onAddMeasurement={handleAddMeasurement}
          />
        )}

        {currentTab === 'reto' && (
          <RetoScreen
            challenge={currentChallenge}
            logs={logs}
          />
        )}
      </main>

      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Notificación Toast flotante */}
      <div className={`toast-notice ${toastMessage ? 'visible' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
};
export default App;
