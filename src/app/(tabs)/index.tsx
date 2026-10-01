import { Text } from 'react-native';

import Pantalla from '../../components/pantalla';
import BotonLink from '../../components/botonLink';
import { estilos } from '../../components/estilos';

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
        href={{ pathname: '/(tabs)/menu' }}
        titulo="Ver menú"
      />

      <BotonLink
        href="/pedido"
        titulo="Ver pedidos"
      />
    </Pantalla>
  );
}