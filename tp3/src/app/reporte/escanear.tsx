import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { AppHeader } from '../../components/AppHeader';
import { useRevisarAlVolver } from '../../hooks/useRevisarAlVolver';

export default function EscanearQrScreen() {
  const router = useRouter();
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  const [aulaManual, setAulaManual] = useState<string>('');
  const [escaneado, setEscaneado] = useState<boolean>(false);

  // Reconsultar si el usuario fue a Ajustes y regresó a la app
  useRevisarAlVolver(() => {
    consultarPermiso();
  });

  const handleCodigoObtenido = (codigo: string) => {
    if (escaneado) return;
    setEscaneado(true);

    // Limpiar o formatear el código si viene con prefijos
    const aulaLimpia = codigo.replace(/^ipf-aula:/i, '').trim();

    Alert.alert('¡Código QR detectado!', `Aula identificada: ${aulaLimpia}`, [
      {
        text: 'Usar este aula',
        onPress: () => {
          router.replace({
            pathname: '/reporte/nuevo',
            params: { aulaDetectada: aulaLimpia },
          });
        },
      },
    ]);
  };

  const handleConfirmarManual = () => {
    if (!aulaManual.trim()) return;
    router.replace({
      pathname: '/reporte/nuevo',
      params: { aulaDetectada: aulaManual.trim() },
    });
  };

  // ESTADO 1: Cargando (evaluación asíncrona del hook)
  if (!permiso) {
    return (
      <View style={styles.container}>
        <AppHeader titulo="Escanear Código QR" subtitulo="Comprobando cámara..." mostrarAtras={true} />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.estadoTexto}>Verificando permisos del dispositivo...</Text>
        </View>
      </View>
    );
  }

  // ESTADO 2: Concedido (Renderiza la vista nativa de la cámara)
  if (permiso.status === 'granted') {
    return (
      <View style={styles.container}>
        <AppHeader
          titulo="Escanear QR del Aula"
          subtitulo="Apuntá al código pegado en la puerta"
          mostrarAtras={true}
        />

        <View style={styles.cameraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={({ data }) => {
              if (data) handleCodigoObtenido(data);
            }}
          />

          {/* Mira / visor del escáner */}
          <View style={styles.visorOverlay}>
            <View style={styles.cuadroVisor}>
              <View style={[styles.esquina, styles.topL]} />
              <View style={[styles.esquina, styles.topR]} />
              <View style={[styles.esquina, styles.botL]} />
              <View style={[styles.esquina, styles.botR]} />
            </View>
            <Text style={styles.visorTexto}>Centrá el código QR dentro del marco</Text>
          </View>
        </View>

        {/* Alternativa siempre presente para no bloquear */}
        <View style={styles.manualCard}>
          <Text style={styles.manualTitulo}>¿Problemas con la cámara?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ingresá el aula (ej: Aula 102)"
              value={aulaManual}
              onChangeText={setAulaManual}
            />
            <TouchableOpacity
              style={[styles.btnManual, !aulaManual.trim() && styles.btnDisabled]}
              onPress={handleConfirmarManual}
              disabled={!aulaManual.trim()}
            >
              <Text style={styles.btnManualTexto}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ESTADO 3: Bloqueado (se rechazó definitivamente; requiere Ajustes)
  if (permiso.status === 'denied' && !permiso.canAskAgain) {
    return (
      <View style={styles.container}>
        <AppHeader
          titulo="Escanear QR del Aula"
          subtitulo="Cámara deshabilitada"
          mostrarAtras={true}
        />

        <View style={styles.centerBox}>
          <View style={styles.iconoBloqueado}>
            <Text style={{ fontSize: 32 }}>🚫</Text>
          </View>
          <Text style={styles.tituloEstado}>Acceso a la cámara bloqueado</Text>
          <Text style={styles.descEstado}>
            El permiso fue denegado en el sistema operativo. Para utilizar el escáner debés habilitar la cámara en los Ajustes del dispositivo.
          </Text>

          <TouchableOpacity
            style={styles.btnAjustes}
            onPress={() => Linking.openSettings()}
            activeOpacity={0.8}
          >
            <Text style={styles.btnAjustesTexto}>Abrir Ajustes</Text>
          </TouchableOpacity>

          <View style={styles.separador} />

          {/* Alternativa sin cámara (Requisito G2.7: La app nunca se bloquea) */}
          <View style={styles.alternativaBox}>
            <Text style={styles.alternativaTitulo}>Alternativa: Ingresar aula a mano</Text>
            <Text style={styles.alternativaSub}>
              Podés continuar cargando tu reporte sin usar la cámara escribiendo el aula:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Laboratorio 2, Aula 301"
              value={aulaManual}
              onChangeText={setAulaManual}
            />
            <TouchableOpacity
              style={[styles.btnConfirmar, !aulaManual.trim() && styles.btnDisabled]}
              onPress={handleConfirmarManual}
              disabled={!aulaManual.trim()}
            >
              <Text style={styles.btnConfirmarTexto}>Confirmar aula manual</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ESTADO 4: Preguntable (Sin decidir o denegado 1 vez en Android)
  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Escanear QR del Aula"
        subtitulo="Permiso requerido"
        mostrarAtras={true}
      />

      <View style={styles.centerBox}>
        <View style={styles.iconoPermiso}>
          <Text style={{ fontSize: 32 }}>📷</Text>
        </View>
        <Text style={styles.tituloEstado}>Uso de la cámara</Text>
        <Text style={styles.descEstado}>
          Usamos tu cámara para escanear el código QR pegado en la puerta del aula y autocompletar la ubicación del reporte.
        </Text>

        <TouchableOpacity
          style={styles.btnContinuar}
          onPress={pedirPermiso}
          activeOpacity={0.8}
        >
          <Text style={styles.btnContinuarTexto}>Continuar</Text>
        </TouchableOpacity>

        <View style={styles.separador} />

        <View style={styles.alternativaBox}>
          <Text style={styles.alternativaTitulo}>O escribir el aula a mano:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Aula Magna, Taller 1"
            value={aulaManual}
            onChangeText={setAulaManual}
          />
          <TouchableOpacity
            style={[styles.btnConfirmar, !aulaManual.trim() && styles.btnDisabled]}
            onPress={handleConfirmarManual}
            disabled={!aulaManual.trim()}
          >
            <Text style={styles.btnConfirmarTexto}>Usar aula escrita a mano</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  visorOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuadroVisor: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  esquina: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#38BDF8',
  },
  topL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  botL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  botR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  visorTexto: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  manualCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  manualTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  btnManual: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnManualTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  iconoBloqueado: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconoPermiso: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloEstado: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  descEstado: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    maxWidth: 320,
  },
  estadoTexto: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
  btnContinuar: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  btnContinuarTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  btnAjustes: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  btnAjustesTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  separador: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  alternativaBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alternativaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  alternativaSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 16,
  },
  btnConfirmar: {
    backgroundColor: '#0F172A',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnConfirmarTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
