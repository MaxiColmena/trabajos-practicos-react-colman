import { Text } from 'react-native';
import { router } from 'expo-router';

import Pantalla from '../components/pantalla';
import Boton from '../components/boton';
import BotonLink from '../components/botonLink';
import { estilos } from '../components/estilos';

import { useApp } from '../context/appContext';

export default function Carrito() {
  const {
    carrito,
    total,
    puedeDeshacer,
    deshacerUltimo,
    confirmarPedido,
  } = useApp();

const confirmar = () => {
  const pedido = confirmarPedido();

  if (pedido) {
    alert(`Pedido #${pedido.numero} confirmado`);
    router.push('/pedidos');
  }
};
  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Mi pedido
      </Text>

      {carrito.length === 0 ? (
        <Text style={estilos.texto}>
          El carrito está vacío.
        </Text>
      ) : (
        carrito.map((plato, index) => (
          <Text
            key={`${plato.id}-${index}`}
            style={estilos.texto}
          >
            {plato.nombre} - ${plato.precio}
          </Text>
        ))
      )}

      <Text style={estilos.subtitulo}>
        Total: ${total}
      </Text>

      <Boton
        titulo="Deshacer último"
        onPress={deshacerUltimo}
        deshabilitado={!puedeDeshacer}
      />

      <Boton
        titulo="Confirmar pedido"
        onPress={confirmar}
        deshabilitado={carrito.length === 0}
      />

      <BotonLink
        href="/menu"
        titulo="Volver al menú"
      />
    </Pantalla>
  );
}