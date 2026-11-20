export type Libro = {
  isbn: string; // 13 dígitos, sin guiones
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number; // ejemplares en el estante al iniciar la app
};

// Un libro que Maxi tiene en préstamo
export type Prestamo = {
  isbn: string;
  titulo: string;
  vence: string; // fecha ISO
  delEstante: boolean; // false si llegó desde la lista de espera (ejemplar devuelto)
  notificacionId: string | null;
};

// Aviso que se muestra dentro de la app cuando no hay notificaciones
export type Aviso = {
  id: string;
  texto: string;
};

export type ResultadoReserva =
  | { tipo: 'prestamo'; vence: string }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'repetida' };

export type Recurso = 'camara' | 'notificaciones';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';
