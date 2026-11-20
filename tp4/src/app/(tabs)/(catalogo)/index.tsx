import { FlatList, StyleSheet } from 'react-native';
import Boton from '../../../components/Boton';
import EncabezadoCatalogo from '../../../components/EncabezadoCatalogo';
import EstadoCargando from '../../../components/EstadoCargando';
import EstadoMensaje from '../../../components/EstadoMensaje';
import FilaLibro from '../../../components/FilaLibro';
import Separador from '../../../components/Separador';
import { espacio } from '../../../constants/tema';
import { useCatalogoInfinito } from '../../../hooks/useCatalogoInfinito';
import { useLibros } from '../../../hooks/useLibros';

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { items, cargarMas } = useCatalogoInfinito(libros);

  if (cargando) {
    return <EstadoCargando mensaje="Buscando en los estantes…" />;
  }

  if (error) {
    return (
      <EstadoMensaje icono="cloud-offline-outline" tono="error" titulo="No cargó el catálogo" detalle={error}>
        <Boton texto="Reintentar" onPress={reintentar} />
      </EstadoMensaje>
    );
  }

  return (
    <FlatList
      data={items}
      // La clave sale del ISBN (más la tanda), nunca del índice de la fila
      keyExtractor={(item) => item.clave}
      renderItem={({ item }) => <FilaLibro libro={item.libro} />}
      onEndReached={cargarMas}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={EncabezadoCatalogo}
      ListEmptyComponent={
        <EstadoMensaje
          icono="book-outline"
          titulo="Los estantes están vacíos"
          detalle="Todavía no hay libros cargados en la biblioteca.">
          <Boton texto="Volver a cargar" variante="secundario" onPress={reintentar} />
        </EstadoMensaje>
      }
      contentContainerStyle={estilos.lista}
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    padding: espacio.l,
    flexGrow: 1,
  },
});
