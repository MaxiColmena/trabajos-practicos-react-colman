import { Text } from 'react-native';

import Pantalla from '../components/pantalla';
import BotonLink from '../components/botonLink';
import { estilos } from '../components/estilos';

export default function NotFound() {
  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Página no encontrada
      </Text>

      <Text style={estilos.texto}>
        La ruta que intentaste abrir no existe.
      </Text>

      <BotonLink
        href="/"
        titulo="Volver al inicio"
      />
    </Pantalla>
  );
}