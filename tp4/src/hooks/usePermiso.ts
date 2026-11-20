import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import type { PermissionResponse } from 'expo';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { crearCanalPrestamos } from '../lib/notificaciones';
import { aEstado } from '../lib/permisos';
import type { EstadoPermiso, Recurso } from '../types';
import { useRevisarAlVolver } from './useRevisarAlVolver';

type UsePermiso = {
  estado: EstadoPermiso;
  pedir: () => Promise<EstadoPermiso>;
  consultar: () => Promise<EstadoPermiso>;
  abrirAjustes: () => void;
};

// Versión del TP 3 recortada a los dos recursos que usa esta app y sin "any"
export function usePermiso(recurso: Recurso): UsePermiso {
  // La cámara usa el hook que trae expo-camera (consulta sola al montar)
  const [camara, pedirCamara, consultarCamara] = useCameraPermissions();
  const [notificaciones, setNotificaciones] = useState<PermissionResponse | null>(null);

  useEffect(() => {
    if (recurso !== 'notificaciones') return;
    let activo = true;
    Notifications.getPermissionsAsync().then((respuesta) => {
      if (activo) setNotificaciones(respuesta);
    });
    return () => {
      activo = false;
    };
  }, [recurso]);

  const consultar = useCallback(async (): Promise<EstadoPermiso> => {
    if (recurso === 'camara') {
      return aEstado(await consultarCamara());
    }
    const respuesta = await Notifications.getPermissionsAsync();
    setNotificaciones(respuesta);
    return aEstado(respuesta);
  }, [recurso, consultarCamara]);

  const pedir = useCallback(async (): Promise<EstadoPermiso> => {
    if (recurso === 'camara') {
      return aEstado(await pedirCamara());
    }
    await crearCanalPrestamos();
    const respuesta = await Notifications.requestPermissionsAsync();
    setNotificaciones(respuesta);
    return aEstado(respuesta);
  }, [recurso, pedirCamara]);

  // Si la persona cambió el permiso en Ajustes, lo vemos al volver
  useRevisarAlVolver(consultar);

  return {
    estado: aEstado(recurso === 'camara' ? camara : notificaciones),
    pedir,
    consultar,
    abrirAjustes: () => {
      Linking.openSettings();
    },
  };
}
