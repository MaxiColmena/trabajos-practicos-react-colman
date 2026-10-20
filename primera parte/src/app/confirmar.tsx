import { router } from 'expo-router';
import { Text } from 'react-native';

import Boton from '../components/boton';
import Pantalla from '../components/pantalla';
import { estilos } from '../components/estilos';
import { useApp } from '../context/appContext';

export default function Confirmar() {
  const { carrito, total, nota, confirmarPedido } = useApp();

  const onConfirmar = () => {
    const pedido = confirmarPedido();

    if (pedido) {
      router.replace({
        pathname: '/turno/[numero]',
        params: {
          numero: String(pedido.numero),
        },
      });
    }
  };

  return (
    <Pantalla>
      <Text style={estilos.titulo}>Resumen del pedido</Text>

      {carrito.map((p, i) => (
        <Text key={i} style={estilos.texto}>
          • {p.nombre} — ${p.precio}
        </Text>
      ))}

      <Text style={estilos.subtitulo}>Total: ${total}</Text>

      {nota !== '' && (
        <Text style={estilos.texto}>
          Nota: {nota}
        </Text>
      )}

      <Boton
        titulo="Confirmar"
        onPress={onConfirmar}
        deshabilitado={carrito.length === 0}
      />

      <Boton
        titulo="Cancelar"
        onPress={() => router.back()}
      />
    </Pantalla>
  );
}