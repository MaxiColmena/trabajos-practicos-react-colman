import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reporte, Aviso } from './types';

const STORAGE_KEY_REPORTES = '@ipf_reportes_v1';
const STORAGE_KEY_AVISOS = '@ipf_avisos_v1';
const STORAGE_KEY_CONFIG = '@ipf_config_v1';

const REPORTES_INICIALES: Reporte[] = [
  {
    id: 'rep-101',
    titulo: 'Tubo fluorescente parpadeando',
    descripcion: 'La luminaria del fondo parpadea constantemente e interrumpe la clase.',
    aula: 'Aula 204 (Piso 2)',
    categoria: 'electricidad',
    estado: 'pendiente',
    fechaCreacion: new Date(Date.now() - 3600000 * 24).toISOString(),
    ubicacion: {
      sector: 'Pabellón Central - Piso 2',
      esAproximada: true,
    },
  },
  {
    id: 'rep-102',
    titulo: 'Pérdida continua en canilla del baño',
    descripcion: 'La canilla del lavatorio izquierdo gotea con fuerza.',
    aula: 'Baño Docentes PB',
    categoria: 'agua',
    estado: 'en curso',
    fechaCreacion: new Date(Date.now() - 3600000 * 48).toISOString(),
    ubicacion: {
      sector: 'Planta Baja - Sanitarios',
      esAproximada: false,
      latitud: -26.1848,
      longitud: -58.1731,
    },
  },
  {
    id: 'rep-103',
    titulo: 'Proyector HDMI sin señal',
    descripcion: 'El conector de pared no envía imagen al proyector principal.',
    aula: 'Laboratorio de Informática 1',
    categoria: 'equipos',
    estado: 'resuelto',
    fechaCreacion: new Date(Date.now() - 3600000 * 72).toISOString(),
    ubicacion: {
      sector: 'Ala Tecnológica',
      esAproximada: false,
      latitud: -26.185,
      longitud: -58.1735,
    },
  },
];

const AVISOS_INICIALES: Aviso[] = [
  {
    id: 'aviso-1',
    reporteId: 'rep-103',
    titulo: 'Reporte Resuelto',
    mensaje: 'El desperfecto "Proyector HDMI sin señal" en Laboratorio de Informática 1 ha sido resuelto por mantenimiento.',
    fecha: new Date(Date.now() - 3600000 * 12).toISOString(),
    leido: false,
  },
];

export async function obtenerReportes(): Promise<Reporte[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY_REPORTES);
    if (!json) {
      await AsyncStorage.setItem(STORAGE_KEY_REPORTES, JSON.stringify(REPORTES_INICIALES));
      return REPORTES_INICIALES;
    }
    return JSON.parse(json);
  } catch {
    return REPORTES_INICIALES;
  }
}

export async function guardarReporte(reporte: Reporte): Promise<void> {
  const actuales = await obtenerReportes();
  const index = actuales.findIndex((r) => r.id === reporte.id);
  let actualizados: Reporte[];
  if (index >= 0) {
    actualizados = [...actuales];
    actualizados[index] = reporte;
  } else {
    actualizados = [reporte, ...actuales];
  }
  await AsyncStorage.setItem(STORAGE_KEY_REPORTES, JSON.stringify(actualizados));
}

export async function obtenerReportePorId(id: string): Promise<Reporte | null> {
  const lista = await obtenerReportes();
  return lista.find((r) => r.id === id) || null;
}

export async function actualizarEstadoReporte(id: string, nuevoEstado: Reporte['estado']): Promise<Reporte | null> {
  const actuales = await obtenerReportes();
  const reporte = actuales.find((r) => r.id === id);
  if (!reporte) return null;
  reporte.estado = nuevoEstado;
  await AsyncStorage.setItem(STORAGE_KEY_REPORTES, JSON.stringify(actuales));
  return reporte;
}

export async function obtenerAvisos(): Promise<Aviso[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY_AVISOS);
    if (!json) {
      await AsyncStorage.setItem(STORAGE_KEY_AVISOS, JSON.stringify(AVISOS_INICIALES));
      return AVISOS_INICIALES;
    }
    return JSON.parse(json);
  } catch {
    return AVISOS_INICIALES;
  }
}

export async function agregarAviso(aviso: Aviso): Promise<void> {
  const actuales = await obtenerAvisos();
  const actualizados = [aviso, ...actuales];
  await AsyncStorage.setItem(STORAGE_KEY_AVISOS, JSON.stringify(actualizados));
}

export async function marcarAvisoLeido(id: string): Promise<void> {
  const actuales = await obtenerAvisos();
  const actualizados = actuales.map((a) => (a.id === id ? { ...a, leido: true } : a));
  await AsyncStorage.setItem(STORAGE_KEY_AVISOS, JSON.stringify(actualizados));
}

export async function eliminarAviso(id: string): Promise<void> {
  const actuales = await obtenerAvisos();
  const actualizados = actuales.filter((a) => a.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY_AVISOS, JSON.stringify(actualizados));
}

export async function obtenerConfigNotificaciones(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEY_CONFIG);
    return val === 'true';
  } catch {
    return false;
  }
}

export async function guardarConfigNotificaciones(habilitado: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_CONFIG, habilitado ? 'true' : 'false');
}
