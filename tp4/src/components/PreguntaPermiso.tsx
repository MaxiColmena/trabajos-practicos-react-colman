import { Platform, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { colores, espacio, fuente } from '../constants/tema';
import { usePermiso } from '../hooks/usePermiso';
import { INFO_PERMISOS } from '../lib/permisos';
import type { Recurso } from '../types';
import Boton from './Boton';
import EstadoCargando from './EstadoCargando';

// Pantalla previa al diálogo del sistema: beneficio en una frase y un único botón
export default function PreguntaPermiso({ recurso }: { recurso: Recurso }) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const info = INFO_PERMISOS[recurso];

  if (estado === 'cargando') {
    return <EstadoCargando mensaje="Un segundo…" />;
  }

  async function continuar() {
    await pedir();
    router.back();
  }

  const rutaAjustes =
    Platform.OS === 'android'
      ? 'Ajustes > Apps > Expo Go > Permisos'
      : 'Ajustes > Expo Go';

  return (
    <View style={estilos.pantalla}>
      <Ionicons name={info.icono} size={56} color={colores.acento} />
      <Text style={estilos.titulo}>{info.titulo}</Text>
      <Text style={estilos.beneficio}>{info.beneficio}</Text>

      {estado === 'concedido' && (
        <>
          <Text style={estilos.nota}>Ya está activado. Podés volver.</Text>
          <Boton texto="Listo" onPress={() => router.back()} />
        </>
      )}

      {estado === 'preguntable' && <Boton texto="Continuar" onPress={continuar} />}

      {estado === 'bloqueado' && (
        <>
          <Text style={estilos.nota}>
            Lo bloqueaste antes, así que el teléfono ya no nos deja preguntarte. Activalo en{' '}
            {rutaAjustes}.
          </Text>
          <Boton texto="Abrir Ajustes" onPress={abrirAjustes} />
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: espacio.xl,
    gap: espacio.l,
    justifyContent: 'center',
  },
  titulo: {
    color: colores.texto,
    fontSize: fuente.titulo,
    fontWeight: '800',
  },
  beneficio: {
    color: colores.texto,
    fontSize: fuente.media,
    lineHeight: 25,
  },
  nota: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
    lineHeight: 21,
  },
});
