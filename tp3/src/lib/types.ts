export type CategoriaReporte = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';

export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export interface UbicacionReporte {
  latitud?: number;
  longitud?: number;
  sector: string;
  esAproximada: boolean;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  fotoUri?: string;
  fotoModo?: 'camara' | 'galeria_selector';
  ubicacion?: UbicacionReporte;
  audioUri?: string;
  estado: EstadoReporte;
  fechaCreacion: string;
}

export interface Aviso {
  id: string;
  reporteId: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export type TipoRecurso = 'camara' | 'ubicacion' | 'notificaciones' | 'microfono' | 'galeria';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export interface InfoPermiso {
  recurso: TipoRecurso;
  titulo: string;
  icono: string;
  proposito: string;
  modulo: string;
  cuandoSePide: string;
  alternativa: string;
}
