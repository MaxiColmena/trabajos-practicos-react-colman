import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { Plato } from '../data/platos';
import { estilos } from './estilos';

export default function PlatoTarjeta({
  plato,
}: {
  plato: Plato;
}) {
  return (
    <Link
      href={{
        pathname: '/menu/[id]',
        params: { id: String(plato.id) },
      }}
      asChild
    >
      <Pressable style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>
          {plato.nombre}
        </Text>

        <Text style={estilos.texto}>
          ${plato.precio}
        </Text>
      </Pressable>
    </Link>
  );
}