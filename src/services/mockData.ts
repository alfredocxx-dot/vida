import { UserProfile, BodyMeasurement, MonthlyChallenge, AttendanceRecord } from '../types';

export const RETOS_MENSUALES: Record<number, MonthlyChallenge> = {
  1: { mes: 1, titulo: 'Más vegetales', pregunta: '¿Agregaste una ensalada o verdura extra hoy?', trimestre: 'Nutrición' },
  2: { mes: 2, titulo: 'Menos ultraprocesados', pregunta: '¿Comiste comida hecha en casa hoy?', trimestre: 'Nutrición' },
  3: { mes: 3, titulo: 'Reducción de carnes', pregunta: '¿Tu día fue sin carne?', trimestre: 'Nutrición' },
  4: { mes: 4, titulo: 'Cero refrescos', pregunta: '¿Evitaste totalmente bebidas azucaradas?', trimestre: 'Hidratación' },
  5: { mes: 5, titulo: 'Agua matutina', pregunta: '¿Tomaste 2 vasos de agua al despertar?', trimestre: 'Hidratación' },
  6: { mes: 6, titulo: '8 vasos completos', pregunta: '¿Cumpliste tus 8 vasos de agua pura?', trimestre: 'Hidratación' },
  7: { mes: 7, titulo: 'Caminata continua', pregunta: '¿Completaste al menos 30 min continuos de actividad?', trimestre: 'Actividad física' },
  8: { mes: 8, titulo: 'Fuerza y movilidad', pregunta: '¿Hiciste ejercicios de estiramiento y fuerza?', trimestre: 'Actividad física' },
  9: { mes: 9, titulo: 'Pausa activa constante', pregunta: '¿Hiciste la pausa activa laboral de las 12:00?', trimestre: 'Actividad física' },
  10: { mes: 10, titulo: 'Salud integral', pregunta: '¿Dormiste al menos 7 horas continuas?', trimestre: 'Integral' },
  11: { mes: 11, titulo: 'Consistencia total', pregunta: '¿Cumpliste los 3 pilares el día de hoy?', trimestre: 'Integral' },
  12: { mes: 12, titulo: 'Evaluación final y metas', pregunta: '¿Revisaste tus avances del año?', trimestre: 'Integral' }
};

// 1 Administrador y 2 Participantes de prueba oficiales
export const DEFAULT_ADMIN: UserProfile = {
  id: 'usr-alfredo',
  nombre: 'Alfredo Jiménez',
  usuario: 'alfredo',
  email: 'alfredo@iaach.org',
  rol: 'Administrador',
  campo: 'Asociación Altos de Chiapas',
  oficina: 'Oficinas de la Asociación',
  sexo: 'M',
  estatura: 1.72,
  pesoInicial: 83.2,
  activo: true,
  fechaConsentimiento: '2027-01-11'
};

export const MOCK_OFFICE_PARTICIPANTS: UserProfile[] = [
  DEFAULT_ADMIN,
  {
    id: 'usr-ana',
    nombre: 'Ana Gómez',
    usuario: 'ana.g',
    email: 'ana.gomez@iaach.org',
    rol: 'Participante',
    campo: 'Asociación Altos de Chiapas',
    oficina: 'Oficinas de la Asociación',
    sexo: 'F',
    estatura: 1.62,
    pesoInicial: 64.5,
    activo: true,
    fechaConsentimiento: '2027-01-12'
  },
  {
    id: 'usr-benjamin',
    nombre: 'Benjamín Ruiz',
    usuario: 'benjamin.r',
    email: 'benjamin.ruiz@iaach.org',
    rol: 'Participante',
    campo: 'Asociación Altos de Chiapas',
    oficina: 'Oficinas de la Asociación',
    sexo: 'M',
    estatura: 1.76,
    pesoInicial: 79.0,
    activo: true,
    fechaConsentimiento: '2027-01-12'
  }
];

export const INITIAL_MEASUREMENTS: BodyMeasurement[] = [
  { id: 'm-1', userId: 'usr-alfredo', fecha: '2027-01-14', origen: 'Evaluación inicial', peso: 83.2, cintura: 97, imcCalculado: 28.1 },
  { id: 'm-2', userId: 'usr-alfredo', fecha: '2027-02-15', origen: 'Autorreporte', peso: 82.1, cintura: null, imcCalculado: 27.7 },
  { id: 'm-3', userId: 'usr-alfredo', fecha: '2027-03-08', origen: 'Autorreporte', peso: 81.3, cintura: 95, imcCalculado: 27.5 }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    fecha: '2027-03-08',
    records: { 'usr-alfredo': 'A', 'usr-ana': 'A', 'usr-benjamin': 'P' }
  },
  {
    fecha: '2027-03-04',
    records: { 'usr-alfredo': 'A', 'usr-ana': 'A', 'usr-benjamin': 'A' }
  }
];
