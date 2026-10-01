import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import Pantalla from '../../components/pantalla';
import { estilos } from '../../components/estilos';

export default function AyudaArticulo() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Ayuda: {slug?.join(' > ')}
      </Text>

      <Text style={estilos.texto}>
        Estás viendo el artículo de ayuda para la ruta seleccionada.
      </Text>
    </Pantalla>
  );
}
