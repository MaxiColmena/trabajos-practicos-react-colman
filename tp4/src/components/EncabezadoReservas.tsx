import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio, fuente } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';
import type { EstadoPermiso } from '../types';
import Boton from './Boton';
import TarjetaAviso from './TarjetaAviso';

type Props = {
  permisoNotificaciones: EstadoPermiso;
  mensaje: string | null;
};

const TEXTO_PERMISO: Record<EstadoPermiso, string> = {
  cargando: 'Revisando las notificaciones…',
  concedido: 'Notificaciones activadas: te avisamos aunque cierres la app.',
  preguntable: 'Notificaciones apagadas: los avisos te aparecen acá.',
  bloqueado: 'Notificaciones bloqueadas: los avisos te aparecen acá.',
};

export default function EncabezadoReservas({ permisoNotificaciones, mensaje }: Props) {
  const { avisos, descartarAviso } = useBiblioteca();

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.permiso}>{TEXTO_PERMISO[permisoNotificaciones]}</Text>

      {mensaje ? <TarjetaAviso tono="alerta" texto={mensaje} /> : null}

      {avisos.map((aviso) => (
        <TarjetaAviso key={aviso.id} texto={aviso.texto}>
          <Boton texto="Entendido" variante="secundario" onPress={() => descartarAviso(aviso.id)} />
        </TarjetaAviso>
      ))}

      <Text style={estilos.titulo}>Mis préstamos</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.m,
    marginBottom: espacio.s,
  },
  permiso: {
    color: colores.textoSuave,
    fontSize: fuente.chica,
  },
  titulo: {
    color: colores.textoSuave,
    fontSize: fuente.chica,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: espacio.s,
  },
});
