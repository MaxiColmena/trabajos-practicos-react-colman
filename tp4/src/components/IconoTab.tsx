import type { ColorValue } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../constants/tema';

type Props = {
  nombre: keyof typeof Ionicons.glyphMap;
  color: ColorValue;
  size: number;
};

// Las tabs pasan un ColorValue, pero Ionicons solo acepta texto
export default function IconoTab({ nombre, color, size }: Props) {
  return <Ionicons name={nombre} size={size} color={typeof color === 'string' ? color : colores.textoSuave} />;
}
