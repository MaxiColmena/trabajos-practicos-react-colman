import { Text, TextInput } from 'react-native';

import Pantalla from '../../components/pantalla';
import BotonLink from '../../components/botonLink';
import { estilos } from '../../components/estilos';

import { useApp } from '../../context/appContext';

export default function Nota() {
  const { nota, setNota } = useApp();

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Nota del pedido
      </Text>

      <Text style={estilos.texto}>
        Escribí una nota para tu pedido:
      </Text>

      <TextInput
        value={nota}
        onChangeText={setNota}
        placeholder="Ej: Sin cebolla"
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#999',
          borderRadius: 8,
          padding: 10,
          minHeight: 100,
          textAlignVertical: 'top',
          marginBottom: 15,
        }}
      />

      <BotonLink
        href="/carrito"
        titulo="Volver al carrito"
      />
    </Pantalla>
  );
}