import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores, espacio, fuente } from '../constants/tema';

type Props = {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  detalle?: string;
  tono?: 'normal' | 'error';
  children?: ReactNode; // acción para salir del estado (botón o link)
};

// Sirve para los estados de error, vacío y "no encontrado"
export default function EstadoMensaje({ icono, titulo, detalle, tono = 'normal', children }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Ionicons
        name={icono}
        size={48}
        color={tono === 'error' ? colores.peligro : colores.acento}
      />
      <Text style={estilos.titulo}>{titulo}</Text>
      {detalle ? <Text style={estilos.detalle}>{detalle}</Text> : null}
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacio.xl,
    gap: espacio.m,
  },
  titulo: {
    color: colores.texto,
    fontSize: fuente.media,
    fontWeight: '700',
    textAlign: 'center',
  },
  detalle: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
    textAlign: 'center',
    lineHeight: 21,
  },
});
