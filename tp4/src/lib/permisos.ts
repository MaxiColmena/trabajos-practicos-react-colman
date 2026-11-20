import type { PermissionResponse } from 'expo';
import type { EstadoPermiso, Recurso } from '../types';

type InfoPermiso = {
  titulo: string;
  icono: 'camera-outline' | 'notifications-outline';
  beneficio: string;
};

export const INFO_PERMISOS: Record<Recurso, InfoPermiso> = {
  camara: {
    titulo: 'Cámara',
    icono: 'camera-outline',
    beneficio: 'Usamos tu cámara para leer el código de barras de la contratapa y abrir el libro sin escribir nada.',
  },
  notificaciones: {
    titulo: 'Notificaciones',
    icono: 'notifications-outline',
    beneficio: 'Usamos las notificaciones para recordarte cuándo devolver un libro y avisarte cuando te toca uno.',
  },
};

export function esRecurso(valor: string | undefined): valor is Recurso {
  return valor === 'camara' || valor === 'notificaciones';
}

// Traduce la respuesta del sistema a los cuatro estados de la app.
// status solo no alcanza: "denied" puede volver a preguntarse o no, lo decide canAskAgain.
export function aEstado(respuesta: PermissionResponse | null): EstadoPermiso {
  if (!respuesta) return 'cargando';
  if (respuesta.granted) return 'concedido';
  if (respuesta.canAskAgain) return 'preguntable';
  return 'bloqueado';
}
