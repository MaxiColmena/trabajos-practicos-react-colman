import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../components/AppHeader';
import { usePermiso } from '../../hooks/usePermiso';

export default function AdjuntarFotoScreen() {
  const router = useRouter();
  const { estado: estadoCamara, pedir: pedirCamara, abrirAjustes } = usePermiso('camara');
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [modo, setModo] = useState<'camara' | 'galeria_selector' | null>(null);

  // OPCIÓN 1: Elegir de la galería (CERO PERMISOS según G2.3)
  const handleElegirGaleria = async () => {
    try {
      // Se utiliza directamente el Photo Picker del sistema sin pedir READ_MEDIA_IMAGES
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setImagenSeleccionada(res.assets[0].uri);
        setModo('galeria_selector');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el selector de fotos.');
    }
  };

  // OPCIÓN 2: Sacar foto con la cámara (requiere permiso CAMERA)
  const handleSacarFoto = async () => {
    if (estadoCamara === 'bloqueado') {
      Alert.alert(
        'Cámara bloqueada',
        'El permiso de cámara fue bloqueado. Habilitalo en los Ajustes del dispositivo para tomar fotos en vivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Ajustes', onPress: abrirAjustes },
        ]
      );
      return;
    }

    if (estadoCamara !== 'concedido') {
      // Navegar a la pantalla previa modal antes de pedir
      router.push({
        pathname: '/permisos/[recurso]',
        params: { recurso: 'camara' },
      });
      return;
    }

    try {
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setImagenSeleccionada(res.assets[0].uri);
        setModo('camara');
      }
    } catch {
      Alert.alert('Error', 'No se pudo iniciar la cámara.');
    }
  };

  const handleConfirmarFoto = () => {
    if (!imagenSeleccionada) return;
    router.replace({
      pathname: '/reporte/nuevo',
      params: {
        fotoDetectada: imagenSeleccionada,
        fotoModoDetectado: modo || 'galeria_selector',
      },
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Adjuntar Fotografía"
        subtitulo="Evidencia visual del desperfecto"
        mostrarAtras={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner explicativo del Photo Picker sin permisos */}
        <View style={styles.bannerZero}>
          <Text style={styles.bannerZeroIcon}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerZeroTitulo}>Mínimo privilegio en fotos:</Text>
            <Text style={styles.bannerZeroTexto}>
              "Elegir de la galería" utiliza el selector del sistema sin requerir ningún permiso de almacenamiento ni acceso a tus fotos privadas.
            </Text>
          </View>
        </View>

        {/* Vista previa si ya hay foto */}
        {imagenSeleccionada ? (
          <View style={styles.previewCard}>
            <Image source={{ uri: imagenSeleccionada }} style={styles.previewImage} />
            <View style={styles.previewInfo}>
              <Text style={styles.previewBadge}>
                {modo === 'galeria_selector' ? '🖼️ Selector nativo (0 permisos)' : '📷 Cámara nativa'}
              </Text>
              <TouchableOpacity
                style={styles.btnQuitar}
                onPress={() => setImagenSeleccionada(null)}
              >
                <Text style={styles.btnQuitarTexto}>Cambiar foto</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.btnConfirmar}
              onPress={handleConfirmarFoto}
              activeOpacity={0.8}
            >
              <Text style={styles.btnConfirmarTexto}>✓ Usar esta foto en el reporte</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.opcionesBox}>
            {/* Opción 1: Selector de sistema */}
            <TouchableOpacity
              style={styles.opcionCard}
              onPress={handleElegirGaleria}
              activeOpacity={0.75}
            >
              <View style={styles.opcionIconoBg}>
                <Text style={styles.opcionEmoji}>🖼️</Text>
              </View>
              <View style={styles.opcionTextoContainer}>
                <Text style={styles.opcionTitulo}>Elegir de la galería</Text>
                <Text style={styles.opcionSub}>
                  Selector nativo del sistema. Cero permisos necesarios; seguro y privado.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Opción 2: Sacar foto con la cámara */}
            <TouchableOpacity
              style={styles.opcionCard}
              onPress={handleSacarFoto}
              activeOpacity={0.75}
            >
              <View style={[styles.opcionIconoBg, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.opcionEmoji}>📷</Text>
              </View>
              <View style={styles.opcionTextoContainer}>
                <Text style={styles.opcionTitulo}>Sacar foto en el momento</Text>
                <Text style={styles.opcionSub}>
                  Capturá el desperfecto con la cámara (requiere permiso de cámara).
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerZero: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  bannerZeroIcon: {
    fontSize: 24,
  },
  bannerZeroTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 2,
  },
  bannerZeroTexto: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 17,
  },
  opcionesBox: {
    gap: 14,
  },
  opcionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  opcionIconoBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opcionEmoji: {
    fontSize: 26,
  },
  opcionTextoContainer: {
    flex: 1,
  },
  opcionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  opcionSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 14,
  },
  previewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  previewBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  btnQuitar: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnQuitarTexto: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
  },
  btnConfirmar: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnConfirmarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
