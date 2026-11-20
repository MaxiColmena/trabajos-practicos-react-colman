import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  CLAVE_PERSONAL,
  DIAS_PRESTAMO,
  USUARIO_APP,
  USUARIO_PERSONAL,
} from '../constants/biblioteca';
import { ESPERA_INICIAL, LIBROS } from '../data/libros';
import { Cola } from '../estructuras/cola';
import { Pila } from '../estructuras/pila';
import { sumarDias } from '../lib/fechas';
import {
  avisarEntrega,
  cancelarRecordatorio,
  notificacionesPermitidas,
  programarRecordatorio,
} from '../lib/notificaciones';
import type { Aviso, Libro, Prestamo, ResultadoReserva } from '../types';

type EsperaMia = { isbn: string; titulo: string; posicion: number };
type ListaMostrador = { libro: Libro; frente: string; cantidad: number };

type Biblioteca = {
  // Sesión del personal
  sesion: string | null;
  ingresar: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;

  // Vistos recientemente (Pila de ISBN)
  recientes: string[];
  verLibro: (isbn: string) => void;

  // Préstamos y listas de espera
  prestamos: Prestamo[];
  misEsperas: EsperaMia[];
  listasMostrador: ListaMostrador[];
  disponibles: (libro: Libro) => number;
  personasEsperando: (isbn: string) => number;
  tengoReserva: (isbn: string) => boolean;
  reservar: (libro: Libro) => ResultadoReserva;
  devolver: (isbn: string) => Promise<void>;
  activarRecordatorio: (isbn: string) => Promise<void>;
  desactivarRecordatorio: (isbn: string) => Promise<void>;
  entregarSiguiente: (libro: Libro) => Promise<void>;

  // Avisos dentro de la app (cuando no hay notificaciones)
  avisos: Aviso[];
  descartarAviso: (id: string) => void;
};

const BibliotecaContext = createContext<Biblioteca | null>(null);

function crearEsperasIniciales(): Record<string, Cola<string>> {
  const esperas: Record<string, Cola<string>> = {};
  Object.entries(ESPERA_INICIAL).forEach(([isbn, personas]) => {
    const cola = new Cola<string>();
    personas.forEach((p) => cola.encolar(p));
    esperas[isbn] = cola;
  });
  return esperas;
}

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<string | null>(null);
  // Pila y Colas no se mutan: cada cambio crea una copia (clonar) y se reemplaza el estado,
  // así React ve una referencia nueva y vuelve a renderizar.
  const [recientes, setRecientes] = useState(() => new Pila<string>());
  const [esperas, setEsperas] = useState(crearEsperasIniciales);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  function ingresar(usuario: string, clave: string): boolean {
    if (usuario.trim().toLowerCase() === USUARIO_PERSONAL && clave === CLAVE_PERSONAL) {
      setSesion(USUARIO_PERSONAL);
      return true;
    }
    return false;
  }

  function cerrarSesion() {
    setSesion(null);
  }

  function verLibro(isbn: string) {
    setRecientes((pila) => {
      // Si ya está en el tope no se apila de nuevo
      if (pila.tope() === isbn) return pila;
      const nueva = pila.clonar();
      nueva.push(isbn);
      return nueva;
    });
  }

  // Los disponibles se calculan: no se guardan en dos lugares
  function disponibles(libro: Libro): number {
    const delEstante = prestamos.filter((p) => p.isbn === libro.isbn && p.delEstante).length;
    return libro.ejemplares - delEstante;
  }

  function personasEsperando(isbn: string): number {
    return esperas[isbn]?.tamanio ?? 0;
  }

  function posicionEnEspera(isbn: string): number {
    const lista = esperas[isbn]?.aArray() ?? [];
    return lista.indexOf(USUARIO_APP) + 1; // 0 = no está
  }

  function tengoReserva(isbn: string): boolean {
    return prestamos.some((p) => p.isbn === isbn) || posicionEnEspera(isbn) > 0;
  }

  function reservar(libro: Libro): ResultadoReserva {
    if (tengoReserva(libro.isbn)) return { tipo: 'repetida' };

    if (disponibles(libro) > 0) {
      const vence = sumarDias(new Date(), DIAS_PRESTAMO).toISOString();
      setPrestamos((lista) => [
        ...lista,
        { isbn: libro.isbn, titulo: libro.titulo, vence, delEstante: true, notificacionId: null },
      ]);
      return { tipo: 'prestamo', vence };
    }

    const cola = esperas[libro.isbn]?.clonar() ?? new Cola<string>();
    cola.encolar(USUARIO_APP);
    setEsperas((anteriores) => ({ ...anteriores, [libro.isbn]: cola }));
    return { tipo: 'espera', posicion: cola.tamanio };
  }

  async function devolver(isbn: string) {
    const prestamo = prestamos.find((p) => p.isbn === isbn);
    if (prestamo?.notificacionId) {
      await cancelarRecordatorio(prestamo.notificacionId);
    }
    setPrestamos((lista) => lista.filter((p) => p.isbn !== isbn));
  }

  async function activarRecordatorio(isbn: string) {
    const prestamo = prestamos.find((p) => p.isbn === isbn);
    if (!prestamo || prestamo.notificacionId) return;
    const id = await programarRecordatorio(prestamo.titulo);
    setPrestamos((lista) =>
      lista.map((p) => (p.isbn === isbn ? { ...p, notificacionId: id } : p)),
    );
  }

  async function desactivarRecordatorio(isbn: string) {
    const prestamo = prestamos.find((p) => p.isbn === isbn);
    if (!prestamo?.notificacionId) return;
    await cancelarRecordatorio(prestamo.notificacionId);
    setPrestamos((lista) =>
      lista.map((p) => (p.isbn === isbn ? { ...p, notificacionId: null } : p)),
    );
  }

  // Simula que alguien devolvió un ejemplar y se lo damos al primero de la fila
  async function entregarSiguiente(libro: Libro) {
    const actual = esperas[libro.isbn];
    if (!actual || actual.vacia) return;

    const cola = actual.clonar();
    const persona = cola.desencolar();
    setEsperas((anteriores) => ({ ...anteriores, [libro.isbn]: cola }));

    if (persona !== USUARIO_APP) return;

    const vence = sumarDias(new Date(), DIAS_PRESTAMO).toISOString();
    setPrestamos((lista) => [
      ...lista,
      { isbn: libro.isbn, titulo: libro.titulo, vence, delEstante: false, notificacionId: null },
    ]);

    // Se consulta el permiso ahora: pudo haber cambiado desde Ajustes
    if (await notificacionesPermitidas()) {
      await avisarEntrega(libro.titulo);
    } else {
      setAvisos((lista) => [
        ...lista,
        {
          id: `${libro.isbn}-${Date.now()}`,
          texto: `¡Te tocó "${libro.titulo}"! Ya lo tenés en préstamo, pasá a retirarlo.`,
        },
      ]);
    }
  }

  function descartarAviso(id: string) {
    setAvisos((lista) => lista.filter((a) => a.id !== id));
  }

  const misEsperas: EsperaMia[] = LIBROS.filter((l) => posicionEnEspera(l.isbn) > 0).map((l) => ({
    isbn: l.isbn,
    titulo: l.titulo,
    posicion: posicionEnEspera(l.isbn),
  }));

  const listasMostrador: ListaMostrador[] = LIBROS.flatMap((libro) => {
    const frente = esperas[libro.isbn]?.frente();
    return frente ? [{ libro, frente, cantidad: personasEsperando(libro.isbn) }] : [];
  });

  const valor: Biblioteca = {
    sesion,
    ingresar,
    cerrarSesion,
    recientes: recientes.aArray().reverse(),
    verLibro,
    prestamos,
    misEsperas,
    listasMostrador,
    disponibles,
    personasEsperando,
    tengoReserva,
    reservar,
    devolver,
    activarRecordatorio,
    desactivarRecordatorio,
    entregarSiguiente,
    avisos,
    descartarAviso,
  };

  return <BibliotecaContext.Provider value={valor}>{children}</BibliotecaContext.Provider>;
}

export function useBiblioteca(): Biblioteca {
  const contexto = useContext(BibliotecaContext);
  if (!contexto) {
    throw new Error('useBiblioteca debe usarse dentro de BibliotecaProvider');
  }
  return contexto;
}
