import { Text } from 'react-native';

import Pantalla from '../components/pantalla';
import Boton from '../components/boton';
import BotonLink from '../components/botonLink';
import { estilos } from '../components/estilos';

import { useApp } from '../context/appContext';

export default function Pedidos() {
  const {
    frente,
    enEspera,
    atenderSiguiente,
  } = useApp();

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Pedidos en espera
      </Text>

      <Text style={estilos.texto}>
        Pedidos en cola: {enEspera}
      </Text>

      {frente ? (
        <>
          <Text style={estilos.subtitulo}>
            Pedido #{frente.numero}
          </Text>

          <Text style={estilos.texto}>
            Total: ${frente.total}
          </Text>

          <Boton
            titulo="Atender siguiente"
            onPress={atenderSiguiente}
          />
        </>
      ) : (
        <Text style={estilos.texto}>
          No hay pedidos pendientes.
        </Text>
      )}

      <BotonLink
        href="/"
        titulo="Volver al inicio"
      />
    </Pantalla>
  );
}