import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Boton from '../../components/Boton';
import EstadoMensaje from '../../components/EstadoMensaje';
import { DIAS_PRESTAMO } from '../../constants/biblioteca';
import { colores, espacio, fuente, radio } from '../../constants/tema';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { buscarLibroPorIsbn, esIsbnValido } from '../../lib/catalogo';
import { formatearFecha, sumarDias } from '../../lib/fechas';

export default function ConfirmarReserva() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { reservar, disponibles, personasEsperando, tengoReserva } = useBiblioteca();
  const [confirmado, setConfirmado] = useState(false);

  const libro = esIsbnValido(isbn) ? buscarLibroPorIsbn(isbn) : undefined;

  if (!libro) {
    return (
      <EstadoMensaje icono="help-circle-outline" tono="error" titulo="No encontramos ese libro">
        <Boton texto="Cerrar" variante="secundario" onPress={() => router.back()} />
      </EstadoMensaje>
    );
  }

  if (tengoReserva(libro.isbn) && !confirmado) {
    return (
      <EstadoMensaje
        icono="checkmark-circle-outline"
        titulo="Ya lo tenés reservado"
        detalle={`"${libro.titulo}" ya está en Mis reservas. No hace falta pedirlo dos veces.`}>
        <Boton texto="Ver mis reservas" onPress={() => router.dismissTo('/reservas')} />
      </EstadoMensaje>
    );
  }

  const hayEjemplares = disponibles(libro) > 0;
  const devolucion = formatearFecha(sumarDias(new Date(), DIAS_PRESTAMO).toISOString());
  const posicion = personasEsperando(libro.isbn) + 1;

  function confirmar() {
    if (!libro) return;
    setConfirmado(true);
    reservar(libro);
    // dismissTo cierra el modal: "atrás" no vuelve a esta confirmación
    router.dismissTo('/reservas');
  }

  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.titulo}>{libro.titulo}</Text>
      <Text style={estilos.autor}>{libro.autor}</Text>

      <View style={estilos.caja}>
        {hayEjemplares ? (
          <Text style={estilos.texto}>
            Hay un ejemplar para vos. Te lo prestamos por {DIAS_PRESTAMO} días: lo devolvés el{' '}
            <Text style={estilos.resaltado}>{devolucion}</Text>.
          </Text>
        ) : (
          <Text style={estilos.texto}>
            No quedan ejemplares en el estante. Te anotamos en la lista de espera en el puesto{' '}
            <Text style={estilos.resaltado}>{posicion}</Text>.
          </Text>
        )}
      </View>

      <Boton
        texto={hayEjemplares ? 'Confirmar préstamo' : 'Anotarme en la lista'}
        onPress={confirmar}
        deshabilitado={confirmado}
      />
      <Boton texto="Cancelar" variante="secundario" onPress={() => router.back()} />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: espacio.xl,
    gap: espacio.m,
  },
  titulo: {
    color: colores.texto,
    fontSize: fuente.titulo,
    fontWeight: '800',
  },
  autor: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
    marginBottom: espacio.s,
  },
  caja: {
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    padding: espacio.l,
    marginBottom: espacio.m,
  },
  texto: {
    color: colores.texto,
    fontSize: fuente.normal,
    lineHeight: 22,
  },
  resaltado: {
    color: colores.acento,
    fontWeight: '700',
  },
});
