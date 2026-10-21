import { DailyLog, BodyMeasurement, AttendanceRecord, UserProfile } from '../types';
import { db, isFirebaseConfigured } from './firebase';
import { DEFAULT_ADMIN, INITIAL_MEASUREMENTS, MOCK_OFFICE_PARTICIPANTS, MOCK_ATTENDANCE } from './mockData';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

const STORAGE_KEYS = {
  USER: 'vida_user_profile',
  LOGS: 'vida_daily_logs',
  MEASUREMENTS: 'vida_measurements',
  ATTENDANCE: 'vida_attendance',
  PARTICIPANTS: 'vida_participants'
};

// Generador de datos iniciales locales aislados por usuario
const getInitialLogs = (userId: string): Record<string, DailyLog> => {
  const userKey = `${STORAGE_KEYS.LOGS}_${userId}`;
  const stored = localStorage.getItem(userKey);
  if (stored) {
    try { 
      return JSON.parse(stored); 
    } catch (e) {}
  }

  // Migración retroactiva: Si es el administrador Alfredo y existían datos en la clave global previa
  if (userId === 'usr-alfredo') {
    const legacy = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        localStorage.setItem(userKey, JSON.stringify(parsed));
        return parsed;
      } catch (e) {}
    }

    // Si aún no tenía nada, generamos sus 14 días demostrativos
    const logs: Record<string, DailyLog> = {};
    for (let i = 14; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const isSat = d.getUTCDay() === 6;
      
      logs[dateStr] = {
        userId: 'usr-alfredo',
        fecha: dateStr,
        vasos: 8 + (i % 3 === 0 ? 1 : 0),
        sinAzucar: true,
        verduras: true,
        ultra: true,
        minutos: isSat ? 0 : 35,
        tipo: 'Caminata',
        pausa: true,
        reto: true
      };
    }
    localStorage.setItem(userKey, JSON.stringify(logs));
    return logs;
  }

  // Para nuevos usuarios (como Ana o Benjamín), su historial comienza totalmente limpio y propio
  const emptyLogs: Record<string, DailyLog> = {};
  localStorage.setItem(userKey, JSON.stringify(emptyLogs));
  return emptyLogs;
};

export const dataService = {
  // Usuario actual
  getCurrentUser(): UserProfile {
    const local = localStorage.getItem(STORAGE_KEYS.USER);
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_ADMIN));
    return DEFAULT_ADMIN;
  },

  saveCurrentUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Registros diarios aislados por usuario
  async getDailyLogs(userId: string): Promise<Record<string, DailyLog>> {
    if (!userId) return {};
    
    // 1. Obtener caché local inmediato del usuario
    const localLogs = getInitialLogs(userId);

    // 2. Si Firebase está activo, sincronizar en segundo plano
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'registros_diarios'), where('userId', '==', userId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          snap.forEach(docSnap => {
            const item = docSnap.data() as DailyLog;
            localLogs[item.fecha] = item;
          });
          localStorage.setItem(`${STORAGE_KEYS.LOGS}_${userId}`, JSON.stringify(localLogs));
        }
      } catch (err) {
        console.warn('Lectura Firestore en segundo plano, usando caché local:', err);
      }
    }
    return localLogs;
  },

  // Guardado garantizado instantáneo (permite actualizar múltiples veces al día)
  saveDailyLog(log: DailyLog): void {
    if (!log || !log.userId) {
      console.warn('Protección activa: Intento de guardar registro diario sin userId');
      return;
    }

    const userKey = `${STORAGE_KEYS.LOGS}_${log.userId}`;
    const stored = localStorage.getItem(userKey);
    let logs: Record<string, DailyLog> = {};
    if (stored) {
      try { logs = JSON.parse(stored); } catch (e) {}
    }
    logs[log.fecha] = {
      ...log,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(userKey, JSON.stringify(logs));

    // 2. Sincronizar en Firestore si está disponible
    if (isFirebaseConfigured && db) {
      const docId = `${log.userId}_${log.fecha}`;
      setDoc(doc(db, 'registros_diarios', docId), {
        ...log,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        console.warn('Sincronización con Firestore guardada localmente:', err);
      });
    }
  },

  // Medidas Corporales aisladas por usuario
  async getMeasurements(userId: string): Promise<BodyMeasurement[]> {
    if (!userId) return [];

    const userKey = `${STORAGE_KEYS.MEASUREMENTS}_${userId}`;
    const stored = localStorage.getItem(userKey);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }

    // Filtrar únicamente las medidas que pertenezcan a este usuario
    const userMeasurements = INITIAL_MEASUREMENTS.filter(m => m.userId === userId);
    localStorage.setItem(userKey, JSON.stringify(userMeasurements));
    return userMeasurements;
  },

  async saveMeasurement(item: BodyMeasurement): Promise<void> {
    if (!item || !item.userId) {
      console.warn('Protección activa: Intento de guardar medida corporal sin userId');
      return;
    }

    const userKey = `${STORAGE_KEYS.MEASUREMENTS}_${item.userId}`;
    const measurements = await this.getMeasurements(item.userId);
    measurements.push(item);
    localStorage.setItem(userKey, JSON.stringify(measurements));

    if (isFirebaseConfigured && db) {
      const docRef = doc(collection(db, 'medidas'));
      setDoc(docRef, item).catch(err => {
        console.warn('Medida guardada localmente, sincronización en espera:', err);
      });
    }
  },

  // Participantes de la oficina
  getParticipants(): UserProfile[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(MOCK_OFFICE_PARTICIPANTS));
    return MOCK_OFFICE_PARTICIPANTS;
  },

  // Asistencia (Lunes y Jueves)
  getAttendance(): AttendanceRecord[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(MOCK_ATTENDANCE));
    return MOCK_ATTENDANCE;
  },

  saveAttendance(attendance: AttendanceRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }
};
