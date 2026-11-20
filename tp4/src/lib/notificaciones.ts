import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { CANAL_PRESTAMOS, SEGUNDOS_RECORDATORIO } from '../constants/biblioteca';

// Que la notificación se vea aunque la app esté abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// En Android 13+ el canal tiene que existir antes de pedir el permiso
export async function crearCanalPrestamos(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_PRESTAMOS, {
    name: 'Préstamos',
    description: 'Recordatorios para devolver los libros a tiempo',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

// Consulta el permiso en el momento (no usa un valor guardado)
export async function notificacionesPermitidas(): Promise<boolean> {
  const permiso = await Notifications.getPermissionsAsync();
  return permiso.granted;
}

// Devuelve el identificador para poder cancelarla después
export async function programarRecordatorio(titulo: string): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Acordate de devolver tu libro',
      body: `"${titulo}" vence pronto. Pasá por la biblioteca del IPF.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_RECORDATORIO,
      channelId: CANAL_PRESTAMOS,
    },
  });
}

export async function cancelarRecordatorio(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

// Aviso inmediato cuando el mostrador te entrega un libro de la lista de espera
export async function avisarEntrega(titulo: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Te llegó el turno!',
      body: `Ya podés retirar "${titulo}" en el mostrador.`,
    },
    trigger: null,
  });
}
