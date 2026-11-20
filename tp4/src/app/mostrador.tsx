import { FlatList, StyleSheet, View } from 'react-native';
import Boton from '../components/Boton';
import EstadoMensaje from '../components/EstadoMensaje';
import FilaMostrador from '../components/FilaMostrador';
import Separador from '../components/Separador';
import { colores, espacio } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';

export default function Mostrador() {
  const { listasMostrador, entregarSiguiente, cerrarSesion } = useBiblioteca();

  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={listasMostrador}
        keyExtractor={(item) => item.libro.isbn}
        renderItem={({ item }) => (
          <FilaMostrador
            libro={item.libro}
            frente={item.frente}
            cantidad={item.cantidad}
            onEntregar={() => entregarSiguiente(item.libro)}
          />
        )}
        ItemSeparatorComponent={Separador}
        ListEmptyComponent={
          <EstadoMensaje
            icono="people-outline"
            titulo="Nadie está esperando"
            detalle="Cuando alguien se anote en una lista de espera, aparece acá."
          />
        }
        contentContainerStyle={estilos.lista}
      />
      <View style={estilos.pie}>
        {/* Al cerrar sesión, Stack.Protected saca el mostrador del historial */}
        <Boton texto="Cerrar sesión" variante="peligro" onPress={cerrarSesion} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    padding: espacio.l,
    flexGrow: 1,
  },
  pie: {
    padding: espacio.l,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
  },
});
