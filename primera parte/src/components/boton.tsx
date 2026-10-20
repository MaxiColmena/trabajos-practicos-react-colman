import { Pressable, Text } from 'react-native';
import { estilos } from './estilos';

type Props = {
  titulo: string;
  onPress: () => void;
  deshabilitado?: boolean;
};

export default function Boton({
  titulo,
  onPress,
  deshabilitado,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      style={[estilos.boton, deshabilitado && estilos.botonOff]}
    >
      <Text style={estilos.botonTexto}>{titulo}</Text>
    </Pressable>
  );
}