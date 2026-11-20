import { Pressable, StyleSheet, Text } from 'react-native';
import { colores, espacio, fuente, radio, TOQUE_MINIMO } from '../constants/tema';

type Props = {
  texto: string;
  onPress: () => void;
  variante?: 'principal' | 'secundario' | 'peligro';
  deshabilitado?: boolean;
};

export default function Boton({ texto, onPress, variante = 'principal', deshabilitado = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        pressed && estilos.presionado,
        deshabilitado && estilos.deshabilitado,
      ]}>
      <Text style={[estilos.texto, variante === 'principal' && estilos.textoPrincipal]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: TOQUE_MINIMO,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.m,
    borderRadius: radio.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  principal: {
    backgroundColor: colores.acento,
  },
  secundario: {
    backgroundColor: colores.superficieAlta,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  peligro: {
    backgroundColor: colores.superficieAlta,
    borderWidth: 1,
    borderColor: colores.peligro,
  },
  presionado: {
    opacity: 0.8,
  },
  deshabilitado: {
    opacity: 0.4,
  },
  texto: {
    color: colores.texto,
    fontSize: fuente.normal,
    fontWeight: '600',
  },
  textoPrincipal: {
    color: colores.sobreAcento,
  },
});
