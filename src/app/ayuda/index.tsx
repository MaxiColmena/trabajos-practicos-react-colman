import { Text } from 'react-native';
import Pantalla from '../../components/pantalla';
import { estilos } from '../../components/estilos';
import BotonLink from '../../components/botonLink';

export default function AyudaIndex() {
  return (
    <Pantalla>
      <Text style={estilos.titulo}>Ayuda</Text>
      
      <Text style={estilos.texto}>
        Seleccione un tema de ayuda:
      </Text>

      <BotonLink href={{ pathname: '/ayuda/[...slug]', params: { slug: ['pagos', 'efectivo'] } }} titulo="Pagos en efectivo" />
      <BotonLink href={{ pathname: '/ayuda/[...slug]', params: { slug: ['pagos', 'tarjeta'] } }} titulo="Pagos con tarjeta" />
      <BotonLink href={{ pathname: '/ayuda/[...slug]', params: { slug: ['horarios'] } }} titulo="Horarios" />
    </Pantalla>
  );
}
