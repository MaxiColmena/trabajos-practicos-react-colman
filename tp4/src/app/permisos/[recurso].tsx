import { router, useLocalSearchParams } from 'expo-router';
import Boton from '../../components/Boton';
import EstadoMensaje from '../../components/EstadoMensaje';
import PreguntaPermiso from '../../components/PreguntaPermiso';
import { esRecurso } from '../../lib/permisos';

export default function Permiso() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  // Solo hay dos recursos válidos: camara y notificaciones
  if (!esRecurso(recurso)) {
    return (
      <EstadoMensaje
        icono="help-circle-outline"
        tono="error"
        titulo="Ese permiso no existe"
        detalle="La app solo usa la cámara y las notificaciones.">
        <Boton texto="Cerrar" variante="secundario" onPress={() => router.back()} />
      </EstadoMensaje>
    );
  }

  return <PreguntaPermiso recurso={recurso} />;
}
