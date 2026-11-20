import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import EncabezadoReservas from '../../components/EncabezadoReservas';
import EstadoMensaje from '../../components/EstadoMensaje';
import FilaPrestamo from '../../components/FilaPrestamo';
import ListaEsperas from '../../components/ListaEsperas';
import Separador from '../../components/Separador';
import { espacio } from '../../constants/tema';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { usePermiso } from '../../hooks/usePermiso';
import type { Prestamo } from '../../types';

export default function MisReservas() {
  const { prestamos, devolver, activarRecordatorio, desactivarRecordatorio } = useBiblioteca();
  const { estado, consultar } = usePermiso('notificaciones');
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Al entrar a la pestaña (o volver del modal de permisos) se vuelve a consultar
  useFocusEffect(
    useCallback(() => {
      consultar();
    }, [consultar]),
  );

  async function cambiarRecordatorio(prestamo: Prestamo, activar: boolean) {
    setMensaje(null);
    if (!activar) {
      await desactivarRecordatorio(prestamo.isbn);
      return;
    }
    // El permiso se pide recién acá, al activar "Recordarme"
    if (estado === 'concedido') {
      await activarRecordatorio(prestamo.isbn);
    } else {
      setMensaje('Para recordarte necesitamos las notificaciones. Si no querés activarlas, igual te avisamos acá.');
      router.push('/permisos/notificaciones');
    }
  }

  return (
    <FlatList
      data={prestamos}
      keyExtractor={(p) => p.isbn}
      renderItem={({ item }) => (
        <FilaPrestamo
          prestamo={item}
          onRecordar={(activar) => cambiarRecordatorio(item, activar)}
          onDevolver={() => devolver(item.isbn)}
        />
      )}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={<EncabezadoReservas permisoNotificaciones={estado} mensaje={mensaje} />}
      ListEmptyComponent={
        <EstadoMensaje
          icono="book-outline"
          titulo="No tenés libros prestados"
          detalle="Buscá uno en el Catálogo y tocá Reservar."
        />
      }
      ListFooterComponent={ListaEsperas}
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
