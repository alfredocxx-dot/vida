export type Role = 'Participante' | 'Administrador' | 'Coordinador';

export interface UserProfile {
  id: string;
  nombre: string;
  usuario: string; // e.g. alfredo
  email?: string;
  rol: Role;
  campo?: string;
  oficina?: string;
  sexo?: 'M' | 'F';
  estatura: number; // en metros, ej: 1.72
  pesoInicial?: number;
  activo: boolean;
  fechaConsentimiento?: string;
}

export type ActivityType = 'Caminata' | 'Fuerza' | 'Deporte' | 'Sesión de oficina';

export interface DailyLog {
  id?: string;
  userId: string;
  fecha: string; // YYYY-MM-DD
  vasos: number; // 0..15
  sinAzucar: boolean | null; // evitó refrescos y bebidas azucaradas
  verduras: boolean | null; // verduras en al menos 2 comidas
  ultra: boolean | null; // evitó ultraprocesados
  minutos: number | null; // 0, 10, 20, 30, 45, 60
  tipo: ActivityType | null;
  pausa: boolean | null; // pausa activa a las 12:00 (lunes a viernes)
  reto: boolean | null; // cumplió el reto del mes
  updatedAt?: string;
}

export interface BodyMeasurement {
  id?: string;
  userId: string;
  fecha: string; // YYYY-MM-DD
  origen: 'Evaluación inicial' | 'Evaluación intermedia' | 'Evaluación final' | 'Autorreporte';
  peso: number; // kg
  cintura: number | null; // cm
  caderaPectoral?: number | null; // cm
  imcCalculado: number;
}

export type AttendanceStatus = 'A' | 'P' | 'N'; // Activa, Parcial, Nula

export interface AttendanceRecord {
  id?: string;
  fecha: string; // YYYY-MM-DD (lunes o jueves)
  records: Record<string, AttendanceStatus>; // userId -> status
}

export interface MonthlyChallenge {
  mes: number; // 1..12
  titulo: string;
  pregunta: string;
  trimestre: 'Nutrición' | 'Hidratación' | 'Actividad física' | 'Integral';
}

export const METAS_VIDA = {
  vasos: 8,
  minDia: 30,
  minSemana: 150,
  minSemanaAdecuado: 300,
};
