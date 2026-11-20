import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colores, fuente, portada, radio } from '../constants/tema';
import { urlPortada } from '../lib/catalogo';
import type { Libro } from '../types';

type Props = {
  libro: Libro;
  tamanio?: 'chica' | 'grande';
};

// Tapa real del libro. Si no hay o no carga (sin internet), se muestra una tapa con la inicial.
export default function Portada({ libro, tamanio = 'chica' }: Props) {
  const [fallo, setFallo] = useState(false);
  const url = urlPortada(libro.isbn);

  if (!url || fallo) {
    return (
      <View style={[estilos[tamanio], estilos.reemplazo]} accessibilityLabel={`Sin tapa de ${libro.titulo}`}>
        <Text style={[estilos.inicial, tamanio === 'grande' && estilos.inicialGrande]}>
          {libro.titulo.charAt(0)}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={estilos[tamanio]}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      accessibilityLabel={`Tapa de ${libro.titulo}`}
      onError={() => setFallo(true)}
    />
  );
}

const estilos = StyleSheet.create({
  chica: {
    width: portada.chica.ancho,
    height: portada.chica.alto,
    borderRadius: radio.s,
    backgroundColor: colores.superficieAlta,
  },
  grande: {
    width: portada.grande.ancho,
    height: portada.grande.alto,
    borderRadius: radio.m,
    backgroundColor: colores.superficieAlta,
  },
  reemplazo: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colores.acentoOscuro,
  },
  inicial: {
    color: colores.acento,
    fontSize: fuente.titulo,
    fontWeight: '800',
  },
  inicialGrande: {
    fontSize: fuente.enorme,
  },
});
