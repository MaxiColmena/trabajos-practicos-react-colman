import { StyleSheet, Switch, Text, View } from 'react-native';
import { colores, espacio, fuente, radio, TOQUE_MINIMO } from '../constants/tema';
import { formatearFecha } from '../lib/fechas';
import type { Prestamo } from '../types';
import Boton from './Boton';

type Props = {
  prestamo: Prestamo;
  onRecordar: (activar: boolean) => void;
  onDevolver: () => void;
};

export default function FilaPrestamo({ prestamo, onRecordar, onDevolver }: Props) {
  const recordando = prestamo.notificacionId !== null;

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{prestamo.titulo}</Text>
      <Text style={estilos.vence}>Lo devolvés el {formatearFecha(prestamo.vence)}</Text>

      <View style={estilos.fila}>
        <Text style={estilos.etiqueta}>Recordarme</Text>
        <Switch
          accessibilityLabel={`Recordarme devolver ${prestamo.titulo}`}
          value={recordando}
          onValueChange={onRecordar}
          trackColor={{ false: colores.borde, true: colores.acentoOscuro }}
          thumbColor={recordando ? colores.acento : colores.textoSuave}
          style={estilos.interruptor}
        />
      </View>

      <Boton texto="Devolver" variante="peligro" onPress={onDevolver} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    padding: espacio.l,
    gap: espacio.s,
  },
  titulo: {
    color: colores.texto,
    fontSize: fuente.media,
    fontWeight: '700',
  },
  vence: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
  },
  fila: {
    minHeight: TOQUE_MINIMO,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiqueta: {
    color: colores.texto,
    fontSize: fuente.normal,
  },
  interruptor: {
    minHeight: TOQUE_MINIMO,
  },
});
