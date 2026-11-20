import { useEffect, useState } from 'react';
import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

type EstadoLibros = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
};

export function useLibros() {
  const [estado, setEstado] = useState<EstadoLibros>({ libros: [], cargando: true, error: null });
  // Cada vez que cambia, el efecto vuelve a pedir el catálogo
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    obtenerLibros()
      .then((libros) => {
        if (activo) setEstado({ libros, cargando: false, error: null });
      })
      .catch(() => {
        if (activo) {
          setEstado({
            libros: [],
            cargando: false,
            error: 'No pudimos conectarnos con la biblioteca. Revisá tu conexión y probá de nuevo.',
          });
        }
      });

    // Si el Catálogo se desmonta antes de que llegue la respuesta, se ignora
    return () => {
      activo = false;
    };
  }, [intento]);

  function reintentar() {
    setEstado((anterior) => ({ ...anterior, cargando: true, error: null }));
    setIntento((n) => n + 1);
  }

  return { ...estado, reintentar };
}
