import { StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import Boton from '../components/Boton';
import EstadoMensaje from '../components/EstadoMensaje';
import { colores, espacio, fuente, radio } from '../constants/tema';

export default function NoEncontrado() {
  const ruta = usePathname();

  return (
    <View style={estilos.pantalla}>
      <EstadoMensaje
        icono="map-outline"
        titulo="Te perdiste en la Tierra Media"
        detalle="Esta página no existe en la biblioteca:">
        <Text style={estilos.ruta} selectable>
          {ruta}
        </Text>
        <Boton texto="Volver al Catálogo" onPress={() => router.replace('/')} />
      </EstadoMensaje>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  ruta: {
    color: colores.aviso,
    fontSize: fuente.normal,
    fontFamily: 'monospace',
    backgroundColor: colores.superficie,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
    borderRadius: radio.s,
  },
});
