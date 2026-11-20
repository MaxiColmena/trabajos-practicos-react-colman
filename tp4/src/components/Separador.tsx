import { StyleSheet, View } from 'react-native';
import { espacio } from '../constants/tema';

// Espacio entre filas de una FlatList
export default function Separador() {
  return <View style={estilos.separador} />;
}

const estilos = StyleSheet.create({
  separador: {
    height: espacio.s,
  },
});
