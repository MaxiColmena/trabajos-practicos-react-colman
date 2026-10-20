import { Text } from 'react-native';

import Boton from '../../components/boton';
import Pantalla from '../../components/pantalla';
import { estilos } from '../../components/estilos';

import { useApp } from '../../context/appContext';

export default function Cocina() {
  const {
    frente,
    enEspera,
    atenderSiguiente,
  } = useApp();

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Pedido actual
      </Text>

      {frente ? (
        <>
          <Text style={estilos.subtitulo}>
            Turno N° {frente.numero}
          </Text>

          {frente.items.map((plato, index) => (
            <Text
              key={index}
              style={estilos.texto}
            >
              • {plato.nombre}
            </Text>
          ))}

          {frente.nota !== '' && (
            <Text style={estilos.texto}>
              Nota: {frente.nota}
            </Text>
          )}
        </>
      ) : (
        <Text style={estilos.texto}>
          No hay pedidos en espera 🎉
        </Text>
      )}

      <Text style={estilos.texto}>
        En espera: {enEspera}
      </Text>

      <Boton
        titulo="Atender siguiente"
        onPress={atenderSiguiente}
        deshabilitado={!frente}
      />
    </Pantalla>
  );
}