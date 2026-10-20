import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { AppHeader } from '../../components/AppHeader';
import { EstadoBadge } from '../../components/EstadoBadge';
import { obtenerReportes } from '../../lib/storage';
import { Reporte, EstadoReporte } from '../../lib/types';

export default function InicioReportesScreen() {
  const router = useRouter();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [filtro, setFiltro] = useState<'todos' | EstadoReporte>('todos');

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    const lista = await obtenerReportes();
    setReportes(lista);
    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const filtrados = reportes.filter((r) => {
    if (filtro === 'todos') return true;
    return r.estado === filtro;
  });

  const getCategoriaEmoji = (cat: Reporte['categoria']) => {
    switch (cat) {
      case 'electricidad':
        return '⚡ Electricidad';
      case 'agua':
        return '💧 Agua / Plomería';
      case 'mobiliario':
        return '🪑 Mobiliario';
      case 'equipos':
        return '🖥️ Equipos / Proyector';
      default:
        return '🔧 General';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Reportes del Edificio"
        subtitulo="Gestión comunitaria de desperfectos - IPF"
        mostrarAjustes={true}
      />

      {/* Barra de Filtros */}
      <View style={styles.filtrosContainer}>
        {(['todos', 'pendiente', 'en curso', 'resuelto'] as const).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chipFiltro, filtro === cat && styles.chipFiltroActivo]}
            onPress={() => setFiltro(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.textoFiltro, filtro === cat && styles.textoFiltroActivo]}>
              {cat === 'todos' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de Reportes */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContent}
        refreshControl={<RefreshControl refreshing={cargando} onRefresh={cargarDatos} colors={['#2563EB']} />}
        ListEmptyComponent={
          !cargando ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyTitulo}>No hay reportes en esta sección</Text>
              <Text style={styles.emptySubtitulo}>
                Creá un nuevo reporte tocando el botón de abajo para informar un desperfecto en el edificio.
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/reporte/[id]', params: { id: item.id } })}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.categoriaTag}>{getCategoriaEmoji(item.categoria)}</Text>
              <EstadoBadge tipo="reporte" valor={item.estado} />
            </View>

            <Text style={styles.reporteTitulo}>{item.titulo}</Text>
            <Text style={styles.reporteDescripcion} numberOfLines={2}>
              {item.descripcion}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.aulaBadge}>
                <Text style={styles.aulaIcon}>📍</Text>
                <Text style={styles.aulaText}>{item.aula}</Text>
              </View>

              {item.ubicacion?.sector && (
                <View style={styles.sectorBadge}>
                  <Text style={styles.sectorText}>
                    {item.ubicacion.sector}
                    {item.ubicacion.esAproximada ? ' (Aprox.)' : ''}
                  </Text>
                </View>
              )}
            </View>

            {item.fotoUri ? (
              <View style={styles.fotoMiniaturaContainer}>
                <Image source={{ uri: item.fotoUri }} style={styles.fotoMiniatura} />
                <Text style={styles.fotoMiniaturaLabel}>
                  {item.fotoModo === 'galeria_selector' ? 'Foto de selector' : 'Foto de cámara'}
                </Text>
              </View>
            ) : null}

            <View style={styles.cardFooter}>
              <Text style={styles.fechaText}>
                {new Date(item.fechaCreacion).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text style={styles.verDetalleText}>Ver detalle →</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Botón flotante para nuevo reporte */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.btnNuevo}
          onPress={() => router.push('/reporte/nuevo')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnNuevoIcon}>＋</Text>
          <Text style={styles.btnNuevoTexto}>Nuevo Reporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chipFiltro: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  chipFiltroActivo: {
    backgroundColor: '#2563EB',
  },
  textoFiltro: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  textoFiltroActivo: {
    color: '#FFFFFF',
  },
  listaContent: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  reporteTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  reporteDescripcion: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  aulaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aulaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  aulaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  sectorBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  fotoMiniaturaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fotoMiniatura: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
  },
  fotoMiniaturaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  fechaText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  verDetalleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
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
    textAlign: 'center',
  },
  emptySubtitulo: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  },
  btnNuevo: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnNuevoIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 8,
  },
  btnNuevoTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
