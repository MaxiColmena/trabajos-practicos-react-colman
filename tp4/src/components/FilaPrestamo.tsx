import { StyleSheet, Switch, Text, View } from 'react-native';
import { colores, espacio, fuente, radio, TOQUE_MINIMO } from '../constants/tema';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { formatearFecha } from '../lib/fechas';
import type { Prestamo } from '../types';
import Boton from './Boton';
import Portada from './Portada';

type Props = {
  prestamo: Prestamo;
  onRecordar: (activar: boolean) => void;
  onDevolver: () => void;
};

export default function FilaPrestamo({ prestamo, onRecordar, onDevolver }: Props) {
  const recordando = prestamo.notificacionId !== null;
  const libro = buscarLibroPorIsbn(prestamo.isbn);

  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.cabecera}>
        {libro ? <Portada libro={libro} /> : null}
        <View style={estilos.textos}>
          <Text style={estilos.titulo}>{prestamo.titulo}</Text>
          <Text style={estilos.vence}>Lo devolvés el {formatearFecha(prestamo.vence)}</Text>
        </View>
      </View>

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
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
  },
  textos: {
    flex: 1,
    gap: espacio.xs,
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
