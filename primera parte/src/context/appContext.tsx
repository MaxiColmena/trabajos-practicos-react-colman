import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { Plato } from '../data/platos';
import { Cola } from '../estructuras/cola';
import { Pila } from '../estructuras/pila';

export type Pedido = {
  numero: number;
  items: Plato[];
  nota: string;
  total: number;
};

type Contexto = {
  // Sesión
  usuario: string | null;
  ingresar: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;

  // Carrito y deshacer
  carrito: Plato[];
  total: number;
  puedeDeshacer: boolean;
  agregar: (plato: Plato) => void;
  deshacerUltimo: () => void;
  nota: string;
  setNota: (texto: string) => void;

  // Cola de pedidos
  confirmarPedido: () => Pedido | null;
  frente: Pedido | undefined;
  enEspera: number;
  atenderSiguiente: () => void;
  posicionEnCola: (numero: number) => number;

  // Historial
  atendidos: Pedido[];
};

const Ctx = createContext<Contexto | null>(null);

// Usuario y clave fijos
const USUARIO_COCINA = 'cocina';
const CLAVE_COCINA = '1234';

export function AppProvider({ children }: { children: ReactNode }) {
  const [, setVersion] = useState(0);

  const refrescar = () => setVersion((v) => v + 1);

  const [usuario, setUsuario] = useState<string | null>(null);
  const [nota, setNota] = useState('');

  const carrito = useRef<Plato[]>([]);
  const acciones = useRef(new Pila<Plato>());
  const cola = useRef(new Cola<Pedido>());
  const atendidos = useRef(new Pila<Pedido>());
  const proximoNumero = useRef(1);

  const ingresar = (u: string, c: string) => {
    if (u === USUARIO_COCINA && c === CLAVE_COCINA) {
      setUsuario(u);
      return true;
    }

    return false;
  };

  const cerrarSesion = () => setUsuario(null);

  const agregar = (plato: Plato) => {
    carrito.current.push(plato);
    acciones.current.push(plato);

    refrescar();
  };

  const deshacerUltimo = () => {
    const ultimo = acciones.current.pop();

    if (!ultimo) return;

    const ids = carrito.current.map((p) => p.id);
    const i = ids.lastIndexOf(ultimo.id);

    if (i >= 0) {
      carrito.current.splice(i, 1);
    }

    refrescar();
  };

  const confirmarPedido = (): Pedido | null => {
    if (carrito.current.length === 0) return null;

    const items = [...carrito.current];

    const pedido: Pedido = {
      numero: proximoNumero.current++,
      items,
      nota,
      total: items.reduce((suma, p) => suma + p.precio, 0),
    };

    cola.current.encolar(pedido);

    carrito.current = [];
    acciones.current = new Pila<Plato>();

    setNota('');

    refrescar();

    return pedido;
  };

  const atenderSiguiente = () => {
    const pedido = cola.current.desencolar();

    if (pedido) {
      atendidos.current.push(pedido);
    }

    refrescar();
  };

  const posicionEnCola = (numero: number) =>
    cola.current.aArray().findIndex((p) => p.numero === numero);

  const valor: Contexto = {
    usuario,
    ingresar,
    cerrarSesion,

    carrito: [...carrito.current],
    total: carrito.current.reduce((suma, p) => suma + p.precio, 0),

    puedeDeshacer: !acciones.current.vacia,

    agregar,
    deshacerUltimo,

    nota,
    setNota,

    confirmarPedido,

    frente: cola.current.frente(),
    enEspera: cola.current.tamanio,

    atenderSiguiente,
    posicionEnCola,

    atendidos: atendidos.current.aArray().reverse(),
  };

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useApp(): Contexto {
  const c = useContext(Ctx);

  if (!c) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }

  return c;
}