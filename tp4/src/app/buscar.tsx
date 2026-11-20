import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import EstadoCargando from '../components/EstadoCargando';
import EstadoMensaje from '../components/EstadoMensaje';
import FilaLibro from '../components/FilaLibro';
import Separador from '../components/Separador';
import { DEMORA_BUSQUEDA_MS } from '../constants/biblioteca';
import { colores, espacio } from '../constants/tema';
import { buscarLibros } from '../lib/api';
import type { Libro } from '../types';

// Guardamos para qué texto es cada respuesta: así sabemos si está al día
type Respuesta = { para: string; libros: Libro[]; error: boolean };

export default function Buscar() {
  // La búsqueda vive en la URL (/buscar?q=...)
  const { q } = useLocalSearchParams<{ q?: string }>();
  const consulta = (q ?? '').trim();
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!consulta) return;
    let vigente = true;

    // Debounce: se pide recién cuando la persona deja de escribir 300 ms
    const temporizador = setTimeout(() => {
      buscarLibros(consulta)
        .then((libros) => {
          if (vigente) setRespuesta({ para: consulta, libros, error: false });
        })
        .catch(() => {
          if (vigente) setRespuesta({ para: consulta, libros: [], error: true });
        });
    }, DEMORA_BUSQUEDA_MS);

    // Al cambiar el texto: se cancela el temporizador y la respuesta vieja se descarta
    return () => {
      vigente = false;
      clearTimeout(temporizador);
    };
  }, [consulta, intento]);

  function reintentar() {
    setRespuesta(null);
    setIntento((n) => n + 1);
  }

  const alDia = respuesta !== null && respuesta.para === consulta;

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.buscador}>
        <CampoTexto
          etiqueta="Título o autor"
          placeholder="Ej.: Tolkien, Principito…"
          value={q ?? ''}
          // setParams cambia la URL sin apilar una pantalla por letra
          onChangeText={(texto) => router.setParams({ q: texto })}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {!consulta ? (
        <EstadoMensaje
          icono="search-outline"
          titulo="¿Qué querés leer?"
          detalle="Escribí parte del título o el nombre del autor."
        />
      ) : !alDia ? (
        <EstadoCargando mensaje="Buscando…" />
      ) : respuesta.error ? (
        <EstadoMensaje icono="cloud-offline-outline" tono="error" titulo="No pudimos buscar" detalle="Revisá tu conexión y probá de nuevo.">
          <Boton texto="Reintentar" onPress={reintentar} />
        </EstadoMensaje>
      ) : (
        <FlatList
          data={respuesta.libros}
          keyExtractor={(libro) => libro.isbn}
          renderItem={({ item }) => <FilaLibro libro={item} />}
          ItemSeparatorComponent={Separador}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={
            <EstadoMensaje
              icono="book-outline"
              titulo="No encontramos nada"
              detalle={`Ningún título ni autor coincide con "${consulta}".`}
            />
          }
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  buscador: {
    padding: espacio.l,
    paddingBottom: espacio.s,
  },
  lista: {
    padding: espacio.l,
    flexGrow: 1,
  },
});
