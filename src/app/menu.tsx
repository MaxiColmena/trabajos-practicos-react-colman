import { Text, View } from 'react-native';

import Pantalla from '../components/pantalla';
import Boton from '../components/boton';
import BotonLink from '../components/botonLink';
import { estilos } from '../components/estilos';

import { platos } from '../data/platos';
import { useApp } from '../context/appContext';

export default function Menu() {
  const { agregar } = useApp();

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Menú
      </Text>

      {platos.map((plato) => (
        <View key={plato.id} style={estilos.tarjeta}>
          <Text style={estilos.subtitulo}>
            {plato.nombre}
          </Text>

          <Text style={estilos.texto}>
            ${plato.precio}
          </Text>

          <Boton
            titulo="Agregar"
            onPress={() => agregar(plato)}
          />
        </View>
      ))}

      <BotonLink
        href="/carrito"
        titulo="Ver carrito"
      />

      <BotonLink
        href="/"
        titulo="Volver al inicio"
      />
    </Pantalla>
  );
}