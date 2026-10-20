import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { agregarAviso } from './storage';

// Configurar cómo se comportan las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Crea el canal requerido en Android antes de emitir notificaciones
 */
export async function inicializarCanalNotificaciones(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reportes', {
      name: 'Reportes y Avisos',
      description: 'Notificaciones sobre el avance y resolución de desperfectos edilicios',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563EB',
    });
  }
}

/**
 * Programa una notificación a los 10 segundos para simular la resolución de un reporte.
 * Si el permiso está denegado o no disponible, genera un aviso en la bandeja interna /avisos.
 */
export async function programarResolucionSimulada(
  reporteId: string,
  titulo: string,
  aula: string
): Promise<{ metodo: 'notificacion_local' | 'bandeja_interna'; segundos?: number }> {
  await inicializarCanalNotificaciones();

  const permisos = await Notifications.getPermissionsAsync();
  const tienePermiso = permisos.granted || permisos.status === 'granted';

  const mensajeCuerpo = `El desperfecto "${titulo}" en ${aula} ha sido solucionado por el personal de mantenimiento.`;

  if (tienePermiso) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🛠️ Reporte Resuelto',
          body: mensajeCuerpo,
          sound: 'default',
          data: { reporteId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
        },
      });

      // También registramos el aviso con una demora de 10s para que persista en /avisos
      setTimeout(async () => {
        await agregarAviso({
          id: `aviso-${Date.now()}`,
          reporteId,
          titulo: 'Reporte Resuelto',
          mensaje: mensajeCuerpo,
          fecha: new Date().toISOString(),
          leido: false,
        });
      }, 10000);

      return { metodo: 'notificacion_local', segundos: 10 };
    } catch {
      // Fallback si falla la programación nativa
    }
  }

  // Alternativa: Si el permiso está denegado o falla, se guarda inmediatamente en la bandeja /avisos
  await agregarAviso({
    id: `aviso-${Date.now()}`,
    reporteId,
    titulo: 'Reporte Resuelto (Bandeja Interna)',
    mensaje: `${mensajeCuerpo} (Aviso entregado en la bandeja de la app debido a que las notificaciones del sistema están desactivadas).`,
    fecha: new Date().toISOString(),
    leido: false,
  });

  return { metodo: 'bandeja_interna' };
}
