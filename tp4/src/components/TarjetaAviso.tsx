import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores, espacio, fuente, radio } from '../constants/tema';

type Props = {
  texto: string;
  tono?: 'info' | 'alerta';
  children?: ReactNode;
};

export default function TarjetaAviso({ texto, tono = 'info', children }: Props) {
  return (
    <View style={[estilos.tarjeta, tono === 'alerta' && estilos.alerta]} accessibilityLiveRegion="polite">
      <View style={estilos.fila}>
        <Ionicons
          name={tono === 'alerta' ? 'alert-circle-outline' : 'information-circle-outline'}
          size={22}
          color={tono === 'alerta' ? colores.aviso : colores.acento}
        />
        <Text style={estilos.texto}>{texto}</Text>
      </View>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    padding: espacio.l,
    gap: espacio.m,
    borderLeftWidth: 4,
    borderLeftColor: colores.acento,
  },
  alerta: {
    borderLeftColor: colores.aviso,
  },
  fila: {
    flexDirection: 'row',
    gap: espacio.s,
    alignItems: 'flex-start',
  },
  texto: {
    flex: 1,
    color: colores.texto,
    fontSize: fuente.normal,
    lineHeight: 21,
  },
});
