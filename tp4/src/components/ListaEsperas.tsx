import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio, fuente, radio } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';

// "Mis reservas en espera", con la posición en cada Cola
export default function ListaEsperas() {
  const { misEsperas } = useBiblioteca();

  return (
    <View style={estilos.seccion}>
      <Text style={estilos.titulo}>En lista de espera</Text>
      {misEsperas.length === 0 ? (
        <Text style={estilos.vacio}>No estás esperando ningún libro.</Text>
      ) : (
        misEsperas.map((espera) => (
          <View key={espera.isbn} style={estilos.fila}>
            <Text style={estilos.libro} numberOfLines={1}>
              {espera.titulo}
            </Text>
            <Text style={estilos.posicion}>
              {espera.posicion === 1 ? '¡Sos el próximo!' : `Puesto ${espera.posicion}`}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  seccion: {
    gap: espacio.s,
    marginTop: espacio.xl,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espacio.m,
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    padding: espacio.l,
  },
  libro: {
    flex: 1,
    color: colores.texto,
    fontSize: fuente.normal,
    fontWeight: '600',
  },
  posicion: {
    color: colores.acento,
    fontSize: fuente.normal,
    fontWeight: '700',
  },
});
