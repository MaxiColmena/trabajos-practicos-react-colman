import {
  useLocalSearchParams,
  usePathname,
  useSegments,
} from 'expo-router';

import { Text, View } from 'react-native';

import { estilos } from './estilos';

export const DEBUG = true;

export default function DondeEstoy() {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();

  if (!DEBUG) return null;

  return (
    <View style={estilos.debug}>
      <Text style={estilos.texto}>
        Ruta: {pathname}
      </Text>

      <Text style={estilos.texto}>
        Segmentos: {segments.join(' / ')}
      </Text>

      <Text style={estilos.texto}>
        Parámetros: {JSON.stringify(params)}
      </Text>
    </View>
  );
}