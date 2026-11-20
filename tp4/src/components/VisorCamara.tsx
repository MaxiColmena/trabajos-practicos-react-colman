import { StyleSheet, Text, View } from 'react-native';
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { colores, espacio, fuente, radio } from '../constants/tema';

type Props = {
  onLeer: (resultado: BarcodeScanningResult) => void;
};

// Solo lee EAN-13, el código de barras de la contratapa
export default function VisorCamara({ onLeer }: Props) {
  return (
    <View style={estilos.contenedor}>
      <CameraView
        style={estilos.camara}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
        onBarcodeScanned={onLeer}
      />
      <View style={estilos.marco} pointerEvents="none" />
      <Text style={estilos.ayuda}>Apuntá al código de barras de la contratapa</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    height: 320,
    borderRadius: radio.l,
    overflow: 'hidden',
    backgroundColor: colores.superficie,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camara: {
    ...StyleSheet.absoluteFill,
  },
  marco: {
    width: '80%',
    height: 110,
    borderWidth: 2,
    borderColor: colores.acento,
    borderRadius: radio.m,
  },
  ayuda: {
    position: 'absolute',
    bottom: espacio.m,
    color: colores.texto,
    fontSize: fuente.chica,
    backgroundColor: colores.overlay,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.xs,
    borderRadius: radio.s,
  },
});
