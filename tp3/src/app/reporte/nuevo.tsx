import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import { AppHeader } from '../../components/AppHeader';
import { guardarReporte } from '../../lib/storage';
import { Reporte, CategoriaReporte } from '../../lib/types';

export default function NuevoReporteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    aulaDetectada?: string;
    fotoDetectada?: string;
    fotoModoDetectado?: 'camara' | 'galeria_selector';
    ubicacionSector?: string;
    ubicacionEsAprox?: string;
    ubicacionLat?: string;
    ubicacionLng?: string;
  }>();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [aula, setAula] = useState('');
  const [categoria, setCategoria] = useState<CategoriaReporte>('electricidad');

  const [fotoUri, setFotoUri] = useState<string | undefined>(undefined);
  const [fotoModo, setFotoModo] = useState<'camara' | 'galeria_selector' | undefined>(undefined);

  const [sector, setSector] = useState<string>('');
  const [esAproximada, setEsAproximada] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number } | undefined>(undefined);

  // Desafío opcional: Nota de voz con micrófono en contexto
  const [grabandoAudio, setGrabandoAudio] = useState(false);
  const [audioGrabadoUri, setAudioGrabadoUri] = useState<string | null>(null);

  // Recibir valores retornados por las pantallas de utilidades
  useEffect(() => {
    if (params.aulaDetectada) {
      setAula(params.aulaDetectada);
    }
  }, [params.aulaDetectada]);

  useEffect(() => {
    if (params.fotoDetectada) {
      setFotoUri(params.fotoDetectada);
      setFotoModo(params.fotoModoDetectado || 'galeria_selector');
    }
  }, [params.fotoDetectada, params.fotoModoDetectado]);

  useEffect(() => {
    if (params.ubicacionSector) {
      setSector(params.ubicacionSector);
      setEsAproximada(params.ubicacionEsAprox === 'true');
      if (params.ubicacionLat && params.ubicacionLng) {
        setCoords({
          lat: parseFloat(params.ubicacionLat),
          lng: parseFloat(params.ubicacionLng),
        });
      }
    }
  }, [params.ubicacionSector, params.ubicacionEsAprox, params.ubicacionLat, params.ubicacionLng]);

  // Manejo de grabación de audio (Desafío opcional G4)
  const handleToggleAudio = async () => {
    if (audioGrabadoUri) {
      Alert.alert('Nota de voz grabada', 'Ya tenés una nota de voz adjunta.', [
        { text: 'Eliminar audio', style: 'destructive', onPress: () => setAudioGrabadoUri(null) },
        { text: 'Conservar' },
      ]);
      return;
    }

    // Pedir permiso en contexto únicamente al tocar la función
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Micrófono denegado',
        'Podés redactar la descripción del problema con el teclado en el campo de texto.'
      );
      return;
    }

    if (!grabandoAudio) {
      setGrabandoAudio(true);
      // Simulación de captura de audio interactiva en contexto
      setTimeout(() => {
        setGrabandoAudio(false);
        setAudioGrabadoUri('mock-audio://nota-voz-reporte.m4a');
        Alert.alert('Nota de voz guardada', 'Se grabó un audio descriptivo de 5 segundos.');
      }, 3500);
    }
  };

  const handleGuardar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo obligatorio', 'Por favor ingresá un título para el reporte.');
      return;
    }
    if (!descripcion.trim() && !audioGrabadoUri) {
      Alert.alert('Campo obligatorio', 'Ingresá una descripción o grabá una nota de voz.');
      return;
    }
    if (!aula.trim()) {
      Alert.alert('Aula requerida', 'Escaneá el código QR del aula o escribila manualmente.');
      return;
    }

    const nuevoReporte: Reporte = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      aula: aula.trim(),
      categoria,
      fotoUri,
      fotoModo,
      ubicacion: sector
        ? {
            sector,
            esAproximada,
            latitud: coords?.lat,
            longitud: coords?.lng,
          }
        : undefined,
      audioUri: audioGrabadoUri || undefined,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString(),
    };

    await guardarReporte(nuevoReporte);

    Alert.alert('¡Reporte Creado!', 'El desperfecto fue registrado y notificado al equipo de mantenimiento.', [
      {
        text: 'Ver en la lista',
        onPress: () => router.replace('/'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Nuevo Reporte"
        subtitulo="Cero permisos al abrir; solicitados solo al usarlos"
        mostrarAtras={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner Pedir en Contexto (G2.1) */}
        <View style={styles.bannerZero}>
          <Text style={styles.bannerZeroIcon}>💡</Text>
          <Text style={styles.bannerZeroTexto}>
            <Text style={{ fontWeight: '700' }}>Sin permisos al abrir:</Text> Cada recurso (cámara, ubicación, selector) se activa únicamente cuando tocás su botón correspondiente.
          </Text>
        </View>

        {/* Título */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título del desperfecto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Luz rota, Canilla goteando, Proyector sin señal"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        {/* Categoría */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriasGrid}>
            {(
              [
                { id: 'electricidad', label: '⚡ Electricidad' },
                { id: 'agua', label: '💧 Agua' },
                { id: 'mobiliario', label: '🪑 Mobiliario' },
                { id: 'equipos', label: '🖥️ Equipos' },
              ] as const
            ).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoriaChip, categoria === cat.id && styles.categoriaChipActivo]}
                onPress={() => setCategoria(cat.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.categoriaTexto, categoria === cat.id && styles.categoriaTextoActivo]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Aula con botón de escaneo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aula o Espacio *</Text>
          <View style={styles.aulaRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Ej: Aula 102, Lab 1"
              value={aula}
              onChangeText={setAula}
            />
            <TouchableOpacity
              style={styles.btnEscanear}
              onPress={() => router.push('/reporte/escanear')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnEscanearTexto}>📷 Escanear QR</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helpText}>Podés escanear el QR de la puerta o escribir el aula a mano.</Text>
        </View>

        {/* Botones de Funciones Especiales: Foto y Ubicación */}
        <View style={styles.seccionAcciones}>
          <Text style={styles.label}>Evidencias y Ubicación</Text>
          <View style={styles.botonesAccionRow}>
            <TouchableOpacity
              style={[styles.btnAccion, fotoUri ? styles.btnAccionActivo : null]}
              onPress={() => router.push('/reporte/foto')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnAccionEmoji}>{fotoUri ? '✓' : '🖼️'}</Text>
              <Text style={styles.btnAccionTexto}>
                {fotoUri ? 'Foto Adjunta' : 'Adjuntar Foto'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAccion, sector ? styles.btnAccionActivo : null]}
              onPress={() => router.push('/reporte/ubicacion')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnAccionEmoji}>{sector ? '✓' : '📍'}</Text>
              <Text style={styles.btnAccionTexto}>
                {sector ? 'Ubicación Lista' : 'Marcar Ubicación'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Desafío opcional: Nota de voz */}
          <TouchableOpacity
            style={[styles.btnAudio, audioGrabadoUri ? styles.btnAudioActivo : null]}
            onPress={handleToggleAudio}
            activeOpacity={0.8}
          >
            <Text style={styles.btnAudioTexto}>
              {grabandoAudio
                ? '🎙️ Grabando descripción... (soltá para guardar)'
                : audioGrabadoUri
                ? '✓ Nota de voz adjunta (tocá para administrar)'
                : '🎙️ Grabar nota de voz (Desafío opcional)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Vista previa de los adjuntos */}
        {(fotoUri || sector || audioGrabadoUri) && (
          <View style={styles.resumenCard}>
            <Text style={styles.resumenTitulo}>Adjuntos en este reporte:</Text>
            {fotoUri && (
              <View style={styles.adjuntoFila}>
                <Image source={{ uri: fotoUri }} style={styles.thumbMini} />
                <Text style={styles.adjuntoTexto}>
                  Fotografía ({fotoModo === 'galeria_selector' ? 'Selector sin permiso' : 'Cámara'})
                </Text>
              </View>
            )}
            {sector && (
              <View style={styles.adjuntoFila}>
                <Text style={styles.adjuntoIcono}>📍</Text>
                <Text style={styles.adjuntoTexto}>
                  Sector: {sector} {esAproximada ? '(Aproximada)' : ''}
                </Text>
              </View>
            )}
            {audioGrabadoUri && (
              <View style={styles.adjuntoFila}>
                <Text style={styles.adjuntoIcono}>🎙️</Text>
                <Text style={styles.adjuntoTexto}>Nota de voz grabada (Audio descriptivo)</Text>
              </View>
            )}
          </View>
        )}

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción detallada *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describí con claridad qué problema ocurre, hace cuánto y cualquier detalle de seguridad."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botón Guardar Reporte */}
        <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar} activeOpacity={0.85}>
          <Text style={styles.btnGuardarTexto}>Guardar y Enviar Reporte</Text>
        </TouchableOpacity>
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
    paddingBottom: 50,
  },
  bannerZero: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bannerZeroIcon: {
    fontSize: 20,
  },
  bannerZeroTexto: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 100,
  },
  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriaChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  categoriaChipActivo: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  categoriaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoriaTextoActivo: {
    color: '#FFFFFF',
  },
  aulaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnEscanear: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEscanearTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  helpText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  seccionAcciones: {
    marginBottom: 16,
  },
  botonesAccionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  btnAccion: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  btnAccionActivo: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  btnAccionEmoji: {
    fontSize: 16,
  },
  btnAccionTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  btnAudio: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnAudioActivo: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
    borderStyle: 'solid',
  },
  btnAudioTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  resumenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  resumenTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  adjuntoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumbMini: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  adjuntoIcono: {
    fontSize: 16,
  },
  adjuntoTexto: {
    fontSize: 13,
    color: '#334155',
  },
  btnGuardar: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnGuardarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
