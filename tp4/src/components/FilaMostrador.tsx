import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio, fuente, radio } from '../constants/tema';
import type { Libro } from '../types';
import Boton from './Boton';

type Props = {
  libro: Libro;
  frente: string;
  cantidad: number;
  onEntregar: () => void;
};

export default function FilaMostrador({ libro, frente, cantidad, onEntregar }: Props) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{libro.titulo}</Text>
      <Text style={estilos.detalle}>
        Al frente: <Text style={estilos.frente}>{frente}</Text>
      </Text>
      <Text style={estilos.detalle}>
        {cantidad === 1 ? 'Espera 1 persona' : `Esperan ${cantidad} personas`}
      </Text>
      <Boton texto="Entregar al siguiente" onPress={onEntregar} />
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
  detalle: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
  },
  frente: {
    color: colores.acento,
    fontWeight: '700',
  },
});
