import { Text } from 'react-native';

import Pantalla from '../../components/pantalla';
import { estilos } from '../../components/estilos';
import { useApp } from '../../context/appContext';

export default function Atendidos() {
  const { atendidos } = useApp();

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Pedidos atendidos
      </Text>

      {atendidos.length === 0 && (
        <Text style={estilos.texto}>
          Todavía no se atendió ninguno.
        </Text>
      )}

      {atendidos.map((pedido) => (
        <Text
          key={pedido.numero}
          style={estilos.texto}
        >
          Turno N° {pedido.numero} — {pedido.items.length} ítems — ${pedido.total}
        </Text>
      ))}
    </Pantalla>
  );
}