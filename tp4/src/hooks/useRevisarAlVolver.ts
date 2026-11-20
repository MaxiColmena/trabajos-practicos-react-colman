import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

// Del TP 3: ejecuta "revisar" cuando la app vuelve al primer plano
// (por ejemplo, después de pasar por los Ajustes del teléfono)
export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef<string>(AppState.currentState ?? 'active');

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo: AppStateStatus) => {
      const estabaAfuera = anterior.current === 'background' || anterior.current === 'inactive';
      if (estabaAfuera && nuevo === 'active') {
        revisar();
      }
      anterior.current = nuevo;
    });

    return () => sub.remove();
  }, [revisar]);
}
