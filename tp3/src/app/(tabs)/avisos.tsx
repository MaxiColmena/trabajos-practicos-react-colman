import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { AppHeader } from '../../components/AppHeader';
import { obtenerAvisos, marcarAvisoLeido, eliminarAviso } from '../../lib/storage';
import { Aviso } from '../../lib/types';

export default function AvisosScreen() {
  const router = useRouter();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const cargarAvisos = useCallback(async () => {
    setCargando(true);
    const lista = await obtenerAvisos();
    setAvisos(lista);
    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarAvisos();
    }, [cargarAvisos])
  );

  const handleMarcarLeido = async (id: string) => {
    await marcarAvisoLeido(id);
    setAvisos((prev) => prev.map((a) => (a.id === id ? { ...a, leido: true } : a)));
  };

  const handleEliminar = async (id: string) => {
    Alert.alert('Eliminar aviso', '¿Querés eliminar este aviso de la bandeja?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await eliminarAviso(id);
          setAvisos((prev) => prev.filter((a) => a.id !== id));
        },
      },
    ]);
  };

  const abrirReporteAsociado = (reporteId: string) => {
    if (reporteId) {
      router.push({ pathname: '/reporte/[id]', params: { id: reporteId } });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Bandeja de Avisos"
        subtitulo="Canal alternativo e historial de notificaciones"
        mostrarAjustes={true}
      />

      {/* Banner explicativo de arquitectura */}
      <View style={styles.bannerInfo}>
        <Text style={styles.bannerIcon}>💡</Text>
        <Text style={styles.bannerTexto}>
          <Text style={styles.bannerBold}>Canal alternativo:</Text> Si las notificaciones del sistema están
          deshabilitadas, los avisos de resolución se reciben automáticamente en esta bandeja para que nunca
          pierdas una actualización.
        </Text>
      </View>

      <FlatList
        data={avisos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContent}
        refreshControl={<RefreshControl refreshing={cargando} onRefresh={cargarAvisos} colors={['#2563EB']} />}
        ListEmptyComponent={
          !cargando ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitulo}>No tenés avisos pendientes</Text>
              <Text style={styles.emptySubtitulo}>
                Cuando un reporte sea resuelto por el equipo técnico, verás el aviso aquí reflejado.
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={[styles.avisoCard, !item.leido && styles.avisoNoLeido]}>
            <View style={styles.avisoHeader}>
              <View style={styles.tituloRow}>
                {!item.leido && <View style={styles.indicadorNoLeido} />}
                <Text style={styles.avisoTitulo}>{item.titulo}</Text>
              </View>
              <Text style={styles.avisoFecha}>
                {new Date(item.fecha).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>

            <Text style={styles.avisoMensaje}>{item.mensaje}</Text>

            <View style={styles.accionesRow}>
              {item.reporteId ? (
                <TouchableOpacity
                  style={styles.btnVerReporte}
                  onPress={() => abrirReporteAsociado(item.reporteId)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnVerReporteTexto}>Ver reporte #{item.reporteId}</Text>
                </TouchableOpacity>
              ) : null}

              <View style={styles.botonesDerecha}>
                {!item.leido && (
                  <TouchableOpacity
                    style={styles.btnLeido}
                    onPress={() => handleMarcarLeido(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnLeidoTexto}>✓ Marcar leído</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.btnEliminar}
                  onPress={() => handleEliminar(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnEliminarTexto}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bannerInfo: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    margin: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  bannerTexto: {
    flex: 1,
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  bannerBold: {
    fontWeight: '700',
  },
  listaContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  avisoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avisoNoLeido: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    backgroundColor: '#FAFCFF',
  },
  avisoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicadorNoLeido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 8,
  },
  avisoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  avisoFecha: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 8,
  },
  avisoMensaje: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  accionesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  btnVerReporte: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  btnVerReporteTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  botonesDerecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnLeido: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnLeidoTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  btnEliminar: {
    padding: 4,
  },
  btnEliminarTexto: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitulo: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
