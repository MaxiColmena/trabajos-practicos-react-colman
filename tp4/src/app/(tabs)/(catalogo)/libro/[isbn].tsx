import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Boton from '../../../../components/Boton';
import DatoLibro from '../../../../components/DatoLibro';
import EstadoMensaje from '../../../../components/EstadoMensaje';
import { colores, espacio, fuente, radio } from '../../../../constants/tema';
import { useBiblioteca } from '../../../../context/BibliotecaContext';
import { buscarLibroPorIsbn, esIsbnValido } from '../../../../lib/catalogo';

export default function DetalleLibro() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { verLibro, disponibles, personasEsperando, tengoReserva } = useBiblioteca();

  // El router no sabe qué ISBN existen: validar es responsabilidad de esta pantalla
  const valido = esIsbnValido(isbn);
  const libro = valido ? buscarLibroPorIsbn(isbn) : undefined;
  const isbnEncontrado = libro?.isbn;

  useEffect(() => {
    if (isbnEncontrado) verLibro(isbnEncontrado);
  }, [isbnEncontrado, verLibro]);

  if (!libro) {
    return (
      <>
        <Stack.Screen options={{ title: 'Libro no encontrado' }} />
        <EstadoMensaje
          icono="help-circle-outline"
          tono="error"
          titulo={valido ? 'No tenemos ese libro' : 'Ese ISBN no es válido'}
          detalle={
            valido
              ? `Ningún libro de la biblioteca tiene el ISBN ${isbn}.`
              : `"${isbn}" no es un ISBN: tiene que tener 13 números, sin guiones.`
          }>
          <Boton texto="Ir al Catálogo" onPress={() => router.dismissTo('/')} />
        </EstadoMensaje>
      </>
    );
  }

  const quedan = disponibles(libro);
  const esperan = personasEsperando(libro.isbn);
  const yaReservado = tengoReserva(libro.isbn);

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: libro.titulo }} />
      <View style={estilos.portada}>
        <Text style={estilos.titulo}>{libro.titulo}</Text>
        <Text style={estilos.autor}>{libro.autor}</Text>
      </View>

      <View>
        <DatoLibro etiqueta="Año" valor={String(libro.anio)} />
        <DatoLibro etiqueta="Ejemplares disponibles" valor={String(quedan)} />
        <DatoLibro etiqueta="En lista de espera" valor={esperan === 1 ? '1 persona' : `${esperan} personas`} />
        <DatoLibro etiqueta="ISBN" valor={libro.isbn} />
      </View>

      <Boton
        texto={yaReservado ? 'Ya lo reservaste' : 'Reservar'}
        deshabilitado={yaReservado}
        onPress={() => router.push({ pathname: '/reservar/[isbn]', params: { isbn: libro.isbn } })}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: espacio.l,
    gap: espacio.xl,
  },
  portada: {
    padding: espacio.xl,
    borderRadius: radio.l,
    backgroundColor: colores.superficie,
    borderLeftWidth: 6,
    borderLeftColor: colores.acento,
    gap: espacio.s,
  },
  titulo: {
    color: colores.texto,
    fontSize: fuente.grande,
    fontWeight: '800',
  },
  autor: {
    color: colores.textoSuave,
    fontSize: fuente.media,
  },
});
