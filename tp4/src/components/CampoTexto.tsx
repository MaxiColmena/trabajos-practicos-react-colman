import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colores, espacio, fuente, radio, TOQUE_MINIMO } from '../constants/tema';

type Props = TextInputProps & { etiqueta: string };

export default function CampoTexto({ etiqueta, ...resto }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        accessibilityLabel={etiqueta}
        placeholderTextColor={colores.textoSuave}
        style={estilos.campo}
        {...resto}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.xs,
  },
  etiqueta: {
    color: colores.textoSuave,
    fontSize: fuente.chica,
  },
  campo: {
    minHeight: TOQUE_MINIMO,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
    paddingHorizontal: espacio.m,
    color: colores.texto,
    fontSize: fuente.normal,
  },
});
