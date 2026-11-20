import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CANTIDAD_RECIENTES } from '../constants/biblioteca';
import { colores, espacio, fuente, radio, TOQUE_MINIMO } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';
import { buscarLibroPorIsbn } from '../lib/catalogo';

// Los 3 del tope de la Pila, del más reciente al más antiguo
export default function VistosRecientes() {
  const { recientes } = useBiblioteca();
  const libros = recientes
    .slice(0, CANTIDAD_RECIENTES)
    .map(buscarLibroPorIsbn)
    .filter((l) => l !== undefined);

  return (
    <View style={estilos.seccion}>
      <Text style={estilos.titulo}>Vistos recientemente</Text>
      {libros.length === 0 ? (
        <Text style={estilos.vacio}>Todavía no abriste ningún libro.</Text>
      ) : (
        <View style={estilos.fila}>
          {libros.map((libro) => (
            <Pressable
              key={libro.isbn}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${libro.titulo}`}
              onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
              style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}>
              <Text style={estilos.tituloLibro} numberOfLines={2}>
                {libro.titulo}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  seccion: {
    gap: espacio.s,
  },
  titulo: {
    color: colores.textoSuave,
    fontSize: fuente.chica,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vacio: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
  },
  fila: {
    flexDirection: 'row',
    gap: espacio.s,
  },
  tarjeta: {
    flex: 1,
    minHeight: TOQUE_MINIMO + espacio.xl,
    padding: espacio.m,
    borderRadius: radio.m,
    backgroundColor: colores.superficieAlta,
    borderLeftWidth: 3,
    borderLeftColor: colores.acento,
    justifyContent: 'center',
  },
  presionada: {
    opacity: 0.8,
  },
  tituloLibro: {
    color: colores.texto,
    fontSize: fuente.chica,
    fontWeight: '600',
  },
});
