import { DailyLog, BodyMeasurement } from '../types';

export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export const MESES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const DIAS_LETRA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export const toISODate = (d: Date = new Date()): string => {
  return d.toISOString().slice(0, 10);
};

export const parseISODate = (iso: string): Date => {
  return new Date(`${iso}T12:00:00Z`);
};

export const addDays = (iso: string, n: number): string => {
  const d = parseISODate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISODate(d);
};

export const isSaturday = (iso: string): boolean => {
  return parseISODate(iso).getUTCDay() === 6;
};

export const formatLongDate = (iso: string): string => {
  const d = parseISODate(iso);
  const dayName = DIAS_SEMANA[d.getUTCDay()];
  return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
};

export const formatShortDate = (iso: string): string => {
  const d = parseISODate(iso);
  return `${d.getUTCDate()} ${MESES_CORTO[d.getUTCMonth()]}`;
};

// Reglas de pilares de VIDA
export const isWaterComplete = (log?: DailyLog | null): boolean => {
  if (!log) return false;
  return (log.vasos ?? 0) >= 8 && log.sinAzucar === true;
};

export const isFoodComplete = (log?: DailyLog | null): boolean => {
  if (!log) return false;
  return log.verduras === true && log.ultra === true;
};

export const isMoveComplete = (log?: DailyLog | null, fecha?: string): boolean => {
  if (fecha && isSaturday(fecha)) return true; // Sábado es día de reposo, no rompe racha
  if (!log) return false;
  return (log.minutos ?? 0) >= 30;
};

export const isDayComplete = (log?: DailyLog | null, fecha?: string): boolean => {
  if (!log) return false;
  return isWaterComplete(log) && isFoodComplete(log) && isMoveComplete(log, fecha);
};

// Cálculo de IMC según la OMS
export const calculateIMC = (pesoKg: number, estaturaM: number): number => {
  if (estaturaM <= 0) return 0;
  return Number((pesoKg / (estaturaM * estaturaM)).toFixed(1));
};

export const getIMCCategory = (imc: number): string => {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Normopeso';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidad';
};

// Cálculo de rachas
export const calculateCurrentStreak = (
  logs: Record<string, DailyLog>,
  todayIso: string,
  condition: (log?: DailyLog, iso?: string) => boolean,
  skipSaturday: boolean = false
): number => {
  let curr = todayIso;
  let count = 0;
  
  // Si hoy aún no se registra o no cumple, empezamos a evaluar desde ayer
  if (!condition(logs[curr], curr)) {
    curr = addDays(curr, -1);
  }

  while (logs[curr] || (skipSaturday && isSaturday(curr))) {
    if (condition(logs[curr], curr)) {
      count++;
    } else if (skipSaturday && isSaturday(curr)) {
      // no rompemos la racha
    } else {
      break;
    }
    curr = addDays(curr, -1);
  }

  return count;
};

// Minutos de actividad semanal (Lunes a Domingo)
export const getWeeklyActivityMinutes = (
  logs: Record<string, DailyLog>,
  mondayIso: string
): number => {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const day = addDays(mondayIso, i);
    const entry = logs[day];
    if (entry && entry.minutos) {
      total += entry.minutos;
    }
  }
  return total;
};

export const getMondayOfWeek = (iso: string): string => {
  const d = parseISODate(iso);
  const day = d.getUTCDay(); // 0 domingo, 1 lunes...
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return toISODate(mon);
};
