import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import Pantalla from '../../components/pantalla';
import BotonLink from '../../components/botonLink';
import { estilos } from '../../components/estilos';

import { platos } from '../../data/platos';

export default function DetallePlato() {
  const { id } = useLocalSearchParams();

  const plato = platos.find((p) => p.id === Number(id));

  if (!plato) {
    return (
      <Pantalla>
        <Text style={estilos.titulo}>
          Plato no encontrado
        </Text>

        <BotonLink
          href="/menu"
          titulo="Volver al menú"
        />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        {plato.nombre}
      </Text>

      <Text style={estilos.texto}>
        Precio: ${plato.precio}
      </Text>

      <BotonLink
        href="/menu"
        titulo="Volver al menú"
      />
    </Pantalla>
  );
}