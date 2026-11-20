import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio, fuente } from '../constants/tema';

// Una línea "etiqueta: valor" de la ficha del libro
export default function DatoLibro({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={estilos.fila}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espacio.m,
    paddingVertical: espacio.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
  etiqueta: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
  },
  valor: {
    color: colores.texto,
    fontSize: fuente.normal,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
});
