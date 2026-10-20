import { Link, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import Pantalla from '../../components/pantalla';
import { estilos } from '../../components/estilos';

import { useApp } from '../../context/appContext';

const MINUTOS_POR_PEDIDO = 3;

export default function Turno() {
  const { numero } = useLocalSearchParams<{ numero: string }>();

  const {
    posicionEnCola,
    atendidos,
  } = useApp();

  const n = Number(numero);

  const posicion = Number.isInteger(n)
    ? posicionEnCola(n)
    : -1;

  const yaAtendido = atendidos.some(
    (pedido) => pedido.numero === n
  );

  if (posicion === -1 && !yaAtendido) {
    return (
      <Pantalla>
        <Text style={estilos.error}>
          No existe el turno "{numero}".
        </Text>
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Turno N° {n}
      </Text>

      {yaAtendido ? (
        <Text style={estilos.subtitulo}>
          ✅ Tu pedido ya fue atendido.
        </Text>
      ) : (
        <>
          <Text style={estilos.subtitulo}>
            Pedidos adelante tuyo: {posicion}
          </Text>

          <Text style={estilos.texto}>
            Espera estimada: {posicion * MINUTOS_POR_PEDIDO} minutos
          </Text>
        </>
      )}

      <Link
        href="../.."
        replace
        style={estilos.subtitulo}
      >
        Volver al inicio
      </Link>
    </Pantalla>
  );
}