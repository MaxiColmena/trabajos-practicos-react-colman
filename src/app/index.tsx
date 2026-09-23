import { Text } from 'react-native';
import { Link } from 'expo-router';

import Pantalla from '../components/pantalla';
import BotonLink from '../components/botonLink';
import { estilos } from '../components/estilos';

export default function Inicio() {
  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Comedor IPF
      </Text>

      <Text style={estilos.texto}>
        Bienvenido al comedor.
      </Text>

      <BotonLink
        href="/login"
        titulo="Iniciar sesión"
      />
      <BotonLink
        href="/menu"
        titulo="Ver menú"
      />
    </Pantalla>
  );
}