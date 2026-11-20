import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { colores, espacio, fuente, radio, TOQUE_MINIMO } from '../constants/tema';
import type { Libro } from '../types';

export default function FilaLibro({ libro }: { libro: Libro }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${libro.titulo}, de ${libro.autor}`}
      onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
      style={({ pressed }) => [estilos.fila, pressed && estilos.presionada]}>
      <View style={estilos.lomo} />
      <View style={estilos.textos}>
        <Text style={estilos.titulo} numberOfLines={1}>
          {libro.titulo}
        </Text>
        <Text style={estilos.autor} numberOfLines={1}>
          {libro.autor} · {libro.anio}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.textoSuave} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    minHeight: TOQUE_MINIMO + espacio.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    paddingVertical: espacio.m,
    paddingHorizontal: espacio.l,
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
  },
  presionada: {
    backgroundColor: colores.superficieAlta,
  },
  lomo: {
    width: 6,
    alignSelf: 'stretch',
    borderRadius: radio.s,
    backgroundColor: colores.acentoOscuro,
  },
  textos: {
    flex: 1,
    gap: espacio.xs,
  },
  titulo: {
    color: colores.texto,
    fontSize: fuente.media,
    fontWeight: '600',
  },
  autor: {
    color: colores.textoSuave,
    fontSize: fuente.chica,
  },
});
