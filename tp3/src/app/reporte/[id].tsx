import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader } from '../../components/AppHeader';
import { EstadoBadge } from '../../components/EstadoBadge';
import { obtenerReportePorId, actualizarEstadoReporte } from '../../lib/storage';
import { programarResolucionSimulada } from '../../lib/notificaciones';
import { Reporte } from '../../lib/types';

export default function DetalleReporteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [simulando, setSimulando] = useState<boolean>(false);

  const cargar = useCallback(async () => {
    if (!id) {
      setCargando(false);
      return;
    }
    const item = await obtenerReportePorId(id);
    setReporte(item);
    setCargando(false);
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleSimularResolucion = async () => {
    if (!reporte) return;

    setSimulando(true);
    try {
      // 1. Actualizar el estado del reporte a 'resuelto'
      const actualizado = await actualizarEstadoReporte(reporte.id, 'resuelto');
      if (actualizado) {
        setReporte({ ...actualizado });
      }

      // 2. Programar la notificación a 10s o enviar a /avisos si el permiso está denegado
      const resultado = await programarResolucionSimulada(
        reporte.id,
        reporte.titulo,
        reporte.aula
      );

      if (resultado.metodo === 'notificacion_local') {
        Alert.alert(
          '🛠️ Resolución Simulada',
          'El reporte fue marcado como "Resuelto". Se programó una notificación local para dentro de 10 segundos. Podés minimizar la app para verla llegar.',
          [
            {
              text: 'Ir a Bandeja de Avisos',
              onPress: () => router.push('/avisos'),
            },
            { text: 'Permanecer aquí' },
          ]
        );
      } else {
        Alert.alert(
          '🛠️ Resolución Simulada (Sin Notificación)',
          'El reporte fue marcado como "Resuelto". Dado que las notificaciones del sistema están desactivadas, el aviso fue depositado en tu bandeja interna /avisos.',
          [
            {
              text: 'Ir a /avisos',
              onPress: () => router.push('/avisos'),
            },
            { text: 'Entendido' },
          ]
        );
      }
    } catch {
      Alert.alert('Error', 'No se pudo completar la simulación de resolución.');
    } finally {
      setSimulando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <AppHeader titulo="Detalle del Reporte" mostrarAtras={true} />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.cargandoTexto}>Cargando reporte #{id}...</Text>
        </View>
      </View>
    );
  }

  // Validación de id inexistente (G1: "Validar el id; mensaje si no existe")
  if (!reporte) {
    return (
      <View style={styles.container}>
        <AppHeader titulo="Reporte No Encontrado" mostrarAtras={true} />
        <View style={styles.centerBox}>
          <Text style={styles.errorIcon}>🔍</Text>
          <Text style={styles.errorTitulo}>El reporte solicitado no existe</Text>
          <Text style={styles.errorSub}>
            No se encontró ningún reporte con el identificador "{id}" en el sistema de almacenamiento.
          </Text>
          <TouchableOpacity
            style={styles.btnVolver}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnVolverTexto}>Volver a la lista de reportes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getCategoriaTexto = (cat: Reporte['categoria']) => {
    switch (cat) {
      case 'electricidad':
        return '⚡ Electricidad';
      case 'agua':
        return '💧 Agua / Sanitarios';
      case 'mobiliario':
        return '🪑 Mobiliario';
      case 'equipos':
        return '🖥️ Equipos / Audiovisual';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo={`Reporte #${reporte.id}`}
        subtitulo={getCategoriaTexto(reporte.categoria)}
        mostrarAtras={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Encabezado con estado y título */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.aulaBadgeText}>📍 {reporte.aula}</Text>
            <EstadoBadge tipo="reporte" valor={reporte.estado} />
          </View>

          <Text style={styles.titulo}>{reporte.titulo}</Text>
          <Text style={styles.descripcion}>{reporte.descripcion}</Text>

          <Text style={styles.fechaCreacion}>
            Creado el{' '}
            {new Date(reporte.fechaCreacion).toLocaleString('es-AR', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </Text>
        </View>

        {/* Fotografía adjunta */}
        {reporte.fotoUri && (
          <View style={styles.card}>
            <Text style={styles.seccionTitulo}>Fotografía del Desperfecto</Text>
            <Image source={{ uri: reporte.fotoUri }} style={styles.fotoGrande} />
            <Text style={styles.fotoMetadato}>
              Método de captura:{' '}
              {reporte.fotoModo === 'galeria_selector'
                ? 'Selector nativo (Zero-permission)'
                : 'Cámara nativa'}
            </Text>
          </View>
        )}

        {/* Ubicación y sector */}
        {reporte.ubicacion && (
          <View style={styles.card}>
            <Text style={styles.seccionTitulo}>Ubicación en el Instituto</Text>
            <View style={styles.ubicacionFila}>
              <Text style={styles.ubicacionEmoji}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectorNombre}>{reporte.ubicacion.sector}</Text>
                {reporte.ubicacion.esAproximada ? (
                  <Text style={styles.ubicacionTipo}>
                    Ubicación aproximada (Margen de privacidad respetado)
                  </Text>
                ) : (
                  <Text style={styles.ubicacionTipo}>
                    Coordenadas exactas: {reporte.ubicacion.latitud?.toFixed(5)},{' '}
                    {reporte.ubicacion.longitud?.toFixed(5)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Nota de voz (Desafío opcional) */}
        {reporte.audioUri && (
          <View style={styles.card}>
            <Text style={styles.seccionTitulo}>Nota de Voz Adjunta</Text>
            <View style={styles.audioFila}>
              <Text style={{ fontSize: 24 }}>🎙️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.audioTexto}>Audio descriptivo grabado por el usuario</Text>
                <Text style={styles.audioSub}>Micrófono solicitado en contexto</Text>
              </View>
            </View>
          </View>
        )}

        {/* Botón de prueba: Simular Resolución (G1 y G2.5) */}
        <View style={styles.simulacionCard}>
          <Text style={styles.simulacionTitulo}>Prueba de Notificación y Avisos</Text>
          <Text style={styles.simulacionSub}>
            Tocar este botón marca el reporte como "Resuelto" y programa una notificación a los 10 segundos (o genera un aviso en /avisos si las notificaciones están denegadas).
          </Text>

          <TouchableOpacity
            style={[styles.btnSimular, simulando && styles.btnDisabled]}
            onPress={handleSimularResolucion}
            disabled={simulando}
            activeOpacity={0.85}
          >
            {simulando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnSimularTexto}>⚡ Simular Resolución</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cargandoTexto: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  btnVolver: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnVolverTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aulaBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  descripcion: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 14,
  },
  fechaCreacion: {
    fontSize: 12,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  seccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  fotoGrande: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 8,
  },
  fotoMetadato: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  ubicacionFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ubicacionEmoji: {
    fontSize: 28,
  },
  sectorNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  ubicacionTipo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  audioFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
  },
  audioTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  audioSub: {
    fontSize: 11,
    color: '#64748B',
  },
  simulacionCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 6,
  },
  simulacionTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  simulacionSub: {
    fontSize: 13,
    color: '#1D4ED8',
    lineHeight: 18,
    marginBottom: 14,
  },
  btnSimular: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnSimularTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
