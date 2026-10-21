import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, BodyMeasurement, AttendanceRecord } from './types';
import { dataService } from './services/dataService';
import { authService } from './services/authService';
import { RETOS_MENSUALES } from './services/mockData';
import { Header } from './components/Header';
import { BottomNav, ScreenTab } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { DateSimulatorBar } from './components/DateSimulatorBar';
import { toISODate } from './utils/helpers';
import { LoginScreen } from './screens/LoginScreen';
import { HoyScreen } from './screens/HoyScreen';
import { RegistroScreen } from './screens/RegistroScreen';
import { ProgresoScreen } from './screens/ProgresoScreen';
import { MedidasScreen } from './screens/MedidasScreen';
import { RetoScreen } from './screens/RetoScreen';
import { AdminScreen } from './screens/AdminScreen';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentSession());
  const [activeRole, setActiveRole] = useState<'Participante' | 'Administrador'>('Participante');
  const [currentTab, setCurrentTab] = useState<ScreenTab>('hoy');
  
  // Tema: Por defecto Modo Día (light)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('vida_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Simulador de Fechas (Provisional para pruebas continuas)
  const [simulatedDate, setSimulatedDate] = useState<string>(() => {
    return localStorage.getItem('vida_simulated_date') || toISODate();
  });

  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Estado del Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulatedDateChange = (newDate: string) => {
    setSimulatedDate(newDate);
    localStorage.setItem('vida_simulated_date', newDate);
    showToast(`Simulando día: ${newDate}`);
  };

  const handleResetToRealToday = () => {
    const real = toISODate();
    setSimulatedDate(real);
    localStorage.removeItem('vida_simulated_date');
    showToast(`Regresado al día de hoy real (${real})`);
  };

  // Efecto para sincronizar el tema en el HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vida_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Cargar datos y sincronizar usuarios al iniciar
  useEffect(() => {
    authService.initSync();

    const loadedAccounts = authService.getAllAccounts();
    setParticipants(loadedAccounts);

    const loadedAttendance = dataService.getAttendance();
    setAttendance(loadedAttendance);

    const session = authService.getCurrentSession();
    if (session) {
      setUser(session);
      if (!session.fechaConsentimiento) {
        setShowOnboarding(true);
      }
    }
  }, []);

  // Cargar registros y medidas cuando cambia el usuario
  useEffect(() => {
    if (user) {
      dataService.getDailyLogs(user.id).then(setLogs);
      dataService.getMeasurements(user.id).then(setMeasurements);
      if (!user.fechaConsentimiento) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  const currentMonthNum = new Date().getMonth() + 1;
  const currentChallenge = RETOS_MENSUALES[currentMonthNum] || RETOS_MENSUALES[3];

  const handleLogin = (loggedUser: UserProfile) => {
    // Blindaje de aislamiento: Limpiar estado previo antes de cargar nueva sesión
    setLogs({});
    setMeasurements([]);
    setUser(loggedUser);
    setActiveRole('Participante');
    showToast(`¡Bienvenido, ${loggedUser.nombre}!`);

    if (!loggedUser.fechaConsentimiento) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    // Limpieza absoluta de memoria en el cliente
    setUser(null);
    setLogs({});
    setMeasurements([]);
    showToast('Sesión cerrada correctamente');
  };

  const handleOnboardingComplete = async (updatedUser: UserProfile, initialMeasurement?: BodyMeasurement) => {
    setUser(updatedUser);
    dataService.saveCurrentUser(updatedUser);

    if (initialMeasurement) {
      await dataService.saveMeasurement(initialMeasurement);
      setMeasurements(prev => [...prev, initialMeasurement]);
    }

    setShowOnboarding(false);
    showToast('¡Configuración inicial completada con éxito!');
  };

  // Guardado garantizado instantáneo (permite actualizar múltiples veces al día)
  const handleSaveLog = (newLog: DailyLog) => {
    // 1. Actualización inmediata en memoria de la UI
    setLogs(prev => ({ ...prev, [newLog.fecha]: newLog }));
    setCurrentTab('hoy');
    showToast('¡Registro guardado y actualizado!');

    // 2. Persistencia en disco y nube
    dataService.saveDailyLog(newLog);
  };

  // Actualización rápida desde las tarjetas interactivas de Hoy
  const handleQuickUpdateLog = (updatedLog: DailyLog) => {
    setLogs(prev => ({ ...prev, [updatedLog.fecha]: updatedLog }));
    dataService.saveDailyLog(updatedLog);
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

  const handleAddUser = async (newUser: UserProfile) => {
    const created = await authService.createUser(newUser);
    const updated = authService.getAllAccounts();
    setParticipants(updated);
    showToast(`Cuenta creada para ${created.nombre}`);
  };

  // Si no ha iniciado sesión, mostrar pantalla de Login
  if (!user) {
    return (
      <LoginScreen 
        onLoginSuccess={handleLogin} 
        availableUsers={participants.length > 0 ? participants : authService.getAllAccounts()} 
      />
    );
  }

  // Protección estricta: Solo si el rol es Administrador se puede ver la sección de Administrador
  const canAccessAdmin = user.rol === 'Administrador';

  if (activeRole === 'Administrador' && canAccessAdmin) {
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
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleRole={() => {
          if (canAccessAdmin) {
            setActiveRole(prev => prev === 'Participante' ? 'Administrador' : 'Participante');
          }
        }}
        onLogout={handleLogout}
      />

      {/* Barra de simulación de fechas para pruebas (fácil de remover cuando concluyan) */}
      <DateSimulatorBar
        currentDate={simulatedDate}
        onChangeDate={handleSimulatedDateChange}
        onResetToRealToday={handleResetToRealToday}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {currentTab === 'hoy' && (
          <HoyScreen
            user={user}
            logs={logs}
            challenge={currentChallenge}
            currentDate={simulatedDate}
            onGoToRegister={() => setCurrentTab('registro')}
            onQuickUpdateLog={handleQuickUpdateLog}
          />
        )}

        {currentTab === 'registro' && (
          <RegistroScreen
            logs={logs}
            userId={user.id}
            challenge={currentChallenge}
            currentDate={simulatedDate}
            onSave={handleSaveLog}
            onCancel={() => setCurrentTab('hoy')}
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

      {/* MENÚ INFERIOR SIEMPRE VISIBLE */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Modal de Onboarding si el usuario es nuevo */}
      {showOnboarding && (
        <OnboardingModal
          user={user}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Notificación Toast flotante */}
      <div className={`toast-notice ${toastMessage ? 'visible' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
};
export default App;
