import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colores, espacio, fuente } from '../constants/tema';

export default function EstadoCargando({ mensaje }: { mensaje: string }) {
  return (
    <View style={estilos.contenedor} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colores.acento} />
      <Text style={estilos.texto}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacio.xl,
    gap: espacio.m,
  },
  texto: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
  },
});
