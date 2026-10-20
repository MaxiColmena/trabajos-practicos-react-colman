import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import PlatoTarjeta from '../../components/platoTarjeta';
import Pantalla from '../../components/pantalla';
import { estilos } from '../../components/estilos';

import { platos } from '../../data/platos';

export default function CategoriaScreen() {
  const { categoria } = useLocalSearchParams<{ categoria: string }>();

  const platosCategoria = platos.filter(
    (plato) => plato.categoria === categoria
  );

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        {categoria}
      </Text>

      {platosCategoria.length === 0 ? (
        <Text style={estilos.texto}>
          No hay platos en esta categoría.
        </Text>
      ) : (
        platosCategoria.map((plato) => (
          <PlatoTarjeta
            key={plato.id}
            plato={plato}
          />
        ))
      )}
    </Pantalla>
  );
}