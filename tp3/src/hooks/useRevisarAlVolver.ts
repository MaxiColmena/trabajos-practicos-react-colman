import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook para detectar cuando la app vuelve al primer plano desde otra app
 * (como los Ajustes del sistema operativo) y ejecutar una función de refresco.
 */
export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef<string>(AppState.currentState || 'active');

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo: AppStateStatus) => {
      const estabaAfuera = /inactive|background/.test(anterior.current);
      if (estabaAfuera && nuevo === 'active') {
        revisar();
      }
      anterior.current = nuevo;
    });

    return () => {
      sub.remove();
    };
  }, [revisar]);
}
