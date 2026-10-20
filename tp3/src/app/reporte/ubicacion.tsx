import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../components/AppHeader';
import { usePermiso } from '../../hooks/usePermiso';
import { UbicacionReporte } from '../../lib/types';

const SECTORES_PREDEFINIDOS = [
  'Patio Central',
  'Estacionamiento Principal',
  'Pasillo Planta Baja (Aulas 101-110)',
  'Pasillo 1° Piso (Aulas 201-210)',
  'Pasillo 2° Piso (Laboratorios)',
  'Biblioteca / Sala de Estudio',
  'Comedor / Cantina',
  'Baños de Alumnos PB',
  'Gimnasio / Campo de Deportes',
];

export default function MarcarUbicacionScreen() {
  const router = useRouter();
  const { estado, detalle, pedir, abrirAjustes } = usePermiso('ubicacion');

  const [obteniendoGps, setObteniendoGps] = useState<boolean>(false);
  const [ubicacionDetectada, setUbicacionDetectada] = useState<UbicacionReporte | null>(null);
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string>('');

  const handleObtenerGps = async () => {
    if (estado === 'bloqueado') {
      Alert.alert(
        'Ubicación bloqueada',
        'El permiso de ubicación fue denegado permanentemente. Podés elegir el sector a mano o habilitar la ubicación en Ajustes.',
        [
          { text: 'Elegir a mano', style: 'cancel' },
          { text: 'Abrir Ajustes', onPress: abrirAjustes },
        ]
      );
      return;
    }

    if (estado !== 'concedido') {
      // Mostrar pantalla previa antes de pedir
      router.push({
        pathname: '/permisos/[recurso]',
        params: { recurso: 'ubicacion' },
      });
      return;
    }

    setObteniendoGps(true);
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Evaluar si es aproximada según precisión
      const esAprox =
        detalle.accuracy === 'coarse' ||
        (pos.coords.accuracy !== null && pos.coords.accuracy > 100);

      const nuevaUbicacion: UbicacionReporte = {
        latitud: esAprox ? undefined : pos.coords.latitude,
        longitud: esAprox ? undefined : pos.coords.longitude,
        sector: sectorSeleccionado || 'Sector detectado por GPS',
        esAproximada: Boolean(esAprox),
      };

      setUbicacionDetectada(nuevaUbicacion);
    } catch {
      Alert.alert(
        'Aviso de GPS',
        'No se pudo obtener la posición del sensor. Podés seleccionar el sector del edificio a mano.'
      );
    } finally {
      setObteniendoGps(false);
    }
  };

  const handleConfirmar = () => {
    const sectorFinal = sectorSeleccionado || ubicacionDetectada?.sector;
    if (!sectorFinal) {
      Alert.alert('Selección requerida', 'Por favor elegí un sector del edificio.');
      return;
    }

    const resultado: UbicacionReporte = {
      latitud: ubicacionDetectada?.latitud,
      longitud: ubicacionDetectada?.longitud,
      sector: sectorFinal,
      esAproximada: ubicacionDetectada ? ubicacionDetectada.esAproximada : true,
    };

    router.replace({
      pathname: '/reporte/nuevo',
      params: {
        ubicacionSector: resultado.sector,
        ubicacionEsAprox: resultado.esAproximada ? 'true' : 'false',
        ubicacionLat: resultado.latitud ? String(resultado.latitud) : '',
        ubicacionLng: resultado.longitud ? String(resultado.longitud) : '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Marcar Ubicación"
        subtitulo="Ubicación respetuosa en primer plano"
        mostrarAtras={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner explicativo de ubicación respetuosa (G2.4) */}
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitulo}>Ubicación respetuosa (Mínimo Privilegio):</Text>
            <Text style={styles.bannerTexto}>
              Solo solicitamos ubicación en primer plano. Si elegís precisión aproximada, no registramos coordenadas exactas. Si la denegás, la app nunca se traba: podés elegir el sector a mano.
            </Text>
          </View>
        </View>

        {/* Sección 1: Detección por GPS */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>1. Detección automática por GPS</Text>
          <Text style={styles.cardSub}>
            Usa el sensor del dispositivo en primer plano para asociar el reporte a tu posición actual.
          </Text>

          <TouchableOpacity
            style={[styles.btnGps, obteniendoGps && styles.btnDisabled]}
            onPress={handleObtenerGps}
            disabled={obteniendoGps}
            activeOpacity={0.8}
          >
            {obteniendoGps ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnGpsTexto}>📡 Obtener mi ubicación actual</Text>
            )}
          </TouchableOpacity>

          {ubicacionDetectada && (
            <View style={styles.resultadoGps}>
              <Text style={styles.resultadoTitulo}>✓ Ubicación registrada:</Text>
              {ubicacionDetectada.esAproximada ? (
                <View style={styles.tagAprox}>
                  <Text style={styles.tagAproxTexto}>⚠️ Ubicación aproximada (Sin coordenadas exactas)</Text>
                </View>
              ) : (
                <Text style={styles.coordsTexto}>
                  Lat: {ubicacionDetectada.latitud?.toFixed(4)} | Lng:{' '}
                  {ubicacionDetectada.longitud?.toFixed(4)} (Precisión GPS)
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Sección 2: Selección manual del sector (Alternativa cuando se deniega) */}
        <View style={styles.card}>
          <View style={styles.rowHeaderSector}>
            <Text style={styles.cardTitulo}>2. Elegir sector edilicio a mano</Text>
            <Text style={styles.badgeAlternativa}>Camino alternativo</Text>
          </View>
          <Text style={styles.cardSub}>
            Seleccioná en qué área del edificio se encuentra el desperfecto:
          </Text>

          <View style={styles.gridSectores}>
            {SECTORES_PREDEFINIDOS.map((sector) => {
              const seleccionado = sectorSeleccionado === sector;
              return (
                <TouchableOpacity
                  key={sector}
                  style={[styles.chipSector, seleccionado && styles.chipSectorActivo]}
                  onPress={() => setSectorSeleccionado(sector)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.textoSector, seleccionado && styles.textoSectorActivo]}>
                    {sector}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Botón de Confirmación */}
        <TouchableOpacity
          style={[
            styles.btnConfirmar,
            (!sectorSeleccionado && !ubicacionDetectada) && styles.btnDisabled,
          ]}
          onPress={handleConfirmar}
          disabled={!sectorSeleccionado && !ubicacionDetectada}
          activeOpacity={0.85}
        >
          <Text style={styles.btnConfirmarTexto}>Confirmar Ubicación / Sector</Text>
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
    paddingBottom: 40,
  },
  bannerInfo: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
    alignItems: 'center',
    gap: 12,
  },
  bannerIcon: {
    fontSize: 24,
  },
  bannerTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  bannerTexto: {
    fontSize: 12,
    color: '#1D4ED8',
    lineHeight: 17,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  rowHeaderSector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeAlternativa: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 18,
  },
  btnGps: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnGpsTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  resultadoGps: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultadoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  tagAprox: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  tagAproxTexto: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  coordsTexto: {
    fontSize: 12,
    color: '#475569',
  },
  gridSectores: {
    gap: 8,
  },
  chipSector: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSectorActivo: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  textoSector: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  textoSectorActivo: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  btnConfirmar: {
    backgroundColor: '#0F172A',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnConfirmarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
