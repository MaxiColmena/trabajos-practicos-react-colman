import { TipoRecurso, InfoPermiso } from './types';

export const RECURSOS_INFO: Record<TipoRecurso, InfoPermiso> = {
  camara: {
    recurso: 'camara',
    titulo: 'Cámara',
    icono: 'camera',
    proposito: 'Usamos tu cámara para escanear el código QR del aula y capturar fotos del desperfecto edilicio.',
    modulo: 'expo-camera',
    cuandoSePide: 'Al tocar "Escanear QR del aula" o "Sacar foto" en el formulario de reporte.',
    alternativa: 'Ingresar el código del aula por teclado y adjuntar imágenes mediante el selector del sistema.',
  },
  ubicacion: {
    recurso: 'ubicacion',
    titulo: 'Ubicación en primer plano',
    icono: 'location-outline',
    proposito: 'Usamos tu ubicación para identificar en qué sector o patio del instituto se encuentra el desperfecto.',
    modulo: 'expo-location',
    cuandoSePide: 'Al tocar "Marcar ubicación actual" en el formulario de reporte.',
    alternativa: 'Seleccionar manualmente el sector edilicio (Patio central, Pasillo PB, etc.) desde una lista.',
  },
  notificaciones: {
    recurso: 'notificaciones',
    titulo: 'Notificaciones',
    icono: 'notifications-outline',
    proposito: 'Usamos las notificaciones para avisarte cuando el equipo de mantenimiento resuelva tu reporte.',
    modulo: 'expo-notifications',
    cuandoSePide: 'Únicamente al activar el interruptor "Avisarme cuando se resuelva mi reporte" en /ajustes-app.',
    alternativa: 'Consultar las actualizaciones en cualquier momento desde la bandeja interna de la pestaña /avisos.',
  },
  microfono: {
    recurso: 'microfono',
    titulo: 'Micrófono (Nota de voz)',
    icono: 'mic-outline',
    proposito: 'Usamos tu micrófono para grabar una nota de voz describiendo el desperfecto.',
    modulo: 'expo-audio',
    cuandoSePide: 'Al tocar el botón opcional "Grabar nota de voz" en el formulario.',
    alternativa: 'Escribir la descripción del problema con el teclado en el campo de texto.',
  },
  galeria: {
    recurso: 'galeria',
    titulo: 'Selector de fotos (Sin permiso)',
    icono: 'images-outline',
    proposito: 'Usamos tus fotos para permitirte adjuntar imágenes del desperfecto edilicio.',
    modulo: 'expo-image-picker (Photo Picker nativo)',
    cuandoSePide: 'Al tocar "Elegir de la galería" (se abre el selector del SO sin pedir permisos).',
    alternativa: 'Sacar una foto en el momento o guardar el reporte sin fotografía adjunta.',
  },
};
