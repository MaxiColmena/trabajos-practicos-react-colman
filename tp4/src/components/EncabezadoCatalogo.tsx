import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colores, espacio, fuente } from '../constants/tema';
import Boton from './Boton';
import VistosRecientes from './VistosRecientes';

export default function EncabezadoCatalogo() {
  return (
    <View style={estilos.contenedor}>
      <VistosRecientes />
      <View style={estilos.accesos}>
        <View style={estilos.acceso}>
          <Boton texto="Buscar" variante="secundario" onPress={() => router.push('/buscar')} />
        </View>
        <View style={estilos.acceso}>
          <Boton texto="Escanear" variante="secundario" onPress={() => router.push('/escanear')} />
        </View>
      </View>
      <Text style={estilos.titulo}>Todo el catálogo</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.l,
    marginBottom: espacio.s,
  },
  accesos: {
    flexDirection: 'row',
    gap: espacio.s,
  },
  acceso: {
    flex: 1,
  },
  titulo: {
    color: colores.textoSuave,
    fontSize: fuente.chica,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
