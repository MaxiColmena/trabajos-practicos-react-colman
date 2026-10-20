import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync } from 'expo-audio';
import { TipoRecurso, EstadoPermiso } from '../lib/types';
import { useRevisarAlVolver } from './useRevisarAlVolver';

export interface DetallePermiso {
  canAskAgain: boolean;
  accessPrivileges?: 'all' | 'limited' | 'none';
  accuracy?: 'fine' | 'coarse';
  provisional?: boolean;
  statusRaw?: string;
}

export interface UsePermisoReturn {
  estado: EstadoPermiso;
  parcial: boolean;
  detalle: DetallePermiso;
  pedir: () => Promise<EstadoPermiso>;
  abrirAjustes: () => void;
  consultar: () => Promise<EstadoPermiso>;
}

export function usePermiso(recurso: TipoRecurso): UsePermisoReturn {
  const [estado, setEstado] = useState<EstadoPermiso>('cargando');
  const [parcial, setParcial] = useState<boolean>(false);
  const [detalle, setDetalle] = useState<DetallePermiso>({ canAskAgain: true });

  const evaluarRespuesta = useCallback(
    (res: any, tipo: TipoRecurso): EstadoPermiso => {
      if (!res) {
        return 'cargando';
      }

      const status = res.status;
      const canAskAgain = res.canAskAgain ?? true;
      const granted = res.granted ?? status === 'granted';

      let esParcial = false;
      let accPriv = res.accessPrivileges;
      let accuracy: 'fine' | 'coarse' | undefined = undefined;
      let isProvisional = false;

      // Verificar matices según el recurso y plataforma
      if (tipo === 'ubicacion') {
        if (res.android && res.android.accuracy === 'coarse') {
          esParcial = true;
          accuracy = 'coarse';
        } else if (res.scope === 'reduced') {
          esParcial = true;
          accuracy = 'coarse';
        } else {
          accuracy = 'fine';
        }
      }

      if (tipo === 'notificaciones' && Platform.OS === 'ios') {
        if (res.ios && res.ios.status === Notifications.IosAuthorizationStatus?.PROVISIONAL) {
          isProvisional = true;
          esParcial = true;
        }
      }

      if (accPriv === 'limited') {
        esParcial = true;
      }

      setParcial(esParcial);
      setDetalle({
        canAskAgain,
        accessPrivileges: accPriv,
        accuracy,
        provisional: isProvisional,
        statusRaw: status,
      });

      if (granted || status === 'granted') {
        return 'concedido';
      }

      if (status === 'undetermined') {
        return 'preguntable';
      }

      if (status === 'denied') {
        return canAskAgain ? 'preguntable' : 'bloqueado';
      }

      return 'preguntable';
    },
    []
  );

  const consultar = useCallback(async (): Promise<EstadoPermiso> => {
    try {
      if (recurso === 'galeria') {
        // En el enfoque de mínimo privilegio, el selector de fotos del sistema no requiere permiso
        setParcial(false);
        setDetalle({ canAskAgain: true, accessPrivileges: 'all', statusRaw: 'granted' });
        setEstado('concedido');
        return 'concedido';
      }

      let res: any = null;
      if (recurso === 'camara') {
        res = await Camera.getCameraPermissionsAsync();
      } else if (recurso === 'ubicacion') {
        res = await Location.getForegroundPermissionsAsync();
      } else if (recurso === 'notificaciones') {
        res = await Notifications.getPermissionsAsync();
      } else if (recurso === 'microfono') {
        res = await getRecordingPermissionsAsync();
      }

      const nuevoEstado = evaluarRespuesta(res, recurso);
      setEstado(nuevoEstado);
      return nuevoEstado;
    } catch {
      setEstado('preguntable');
      return 'preguntable';
    }
  }, [recurso, evaluarRespuesta]);

  const pedir = useCallback(async (): Promise<EstadoPermiso> => {
    try {
      if (recurso === 'galeria') {
        setEstado('concedido');
        return 'concedido';
      }

      let res: any = null;
      if (recurso === 'camara') {
        res = await Camera.requestCameraPermissionsAsync();
      } else if (recurso === 'ubicacion') {
        res = await Location.requestForegroundPermissionsAsync();
      } else if (recurso === 'notificaciones') {
        // En Android creamos el canal "reportes" antes de pedir si aplica
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('reportes', {
            name: 'Reportes y Avisos',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [0, 250, 250, 250],
          });
        }
        res = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowProvisional: true, // Desafío opcional: soporte de provisionales en iOS
          },
        });
      } else if (recurso === 'microfono') {
        res = await requestRecordingPermissionsAsync();
      }

      const nuevoEstado = evaluarRespuesta(res, recurso);
      setEstado(nuevoEstado);
      return nuevoEstado;
    } catch {
      setEstado('bloqueado');
      return 'bloqueado';
    }
  }, [recurso, evaluarRespuesta]);

  const abrirAjustes = useCallback(() => {
    Linking.openSettings();
  }, []);

  // Consulta inicial pasiva
  useEffect(() => {
    consultar();
  }, [consultar]);

  // Actualización automática al volver de Ajustes usando AppState
  useRevisarAlVolver(() => {
    consultar();
  });

  return {
    estado,
    parcial,
    detalle,
    pedir,
    abrirAjustes,
    consultar,
  };
}
