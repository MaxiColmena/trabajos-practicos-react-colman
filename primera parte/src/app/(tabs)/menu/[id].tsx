import { Text, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import Pantalla from '../../../components/pantalla';
import Boton from '../../../components/boton';
import { estilos } from '../../../components/estilos';
import { platos } from '../../../data/platos';
import { useApp } from '../../../context/appContext';

export default function PlatoDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plato = platos.find((p) => p.id === Number(id));
  const { agregar } = useApp();

  if (!plato) {
    return (
      <Pantalla>
        <Stack.Screen options={{ title: 'No encontrado' }} />
        <Text style={estilos.texto}>No existe el producto {id}</Text>
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Stack.Screen options={{ title: plato.nombre }} />
      <Text style={estilos.titulo}>{plato.nombre}</Text>
      <Text style={estilos.subtitulo}>${plato.precio}</Text>
      {plato.descripcion && (
        <Text style={estilos.texto}>{plato.descripcion}</Text>
      )}
      <View style={{ marginTop: 20 }}>
        <Boton titulo="Agregar al carrito" onPress={() => agregar(plato)} />
      </View>
    </Pantalla>
  );
}
