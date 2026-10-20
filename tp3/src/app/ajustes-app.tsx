import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { AppHeader } from '../components/AppHeader';
import { EstadoBadge } from '../components/EstadoBadge';
import { usePermiso } from '../hooks/usePermiso';
import {
  obtenerConfigNotificaciones,
  guardarConfigNotificaciones,
} from '../lib/storage';
import { inicializarCanalNotificaciones } from '../lib/notificaciones';

export default function AjustesAppScreen() {
  const { estado, detalle, pedir, abrirAjustes, consultar } = usePermiso('notificaciones');
  const [avisosHabilitados, setAvisosHabilitados] = useState<boolean>(false);
  const [cargandoConfig, setCargandoConfig] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const config = await obtenerConfigNotificaciones();
      setAvisosHabilitados(config);
      setCargandoConfig(false);
    })();
  }, []);

  const handleToggle = async (nuevoValor: boolean) => {
    if (nuevoValor) {
      // Requisito G2.5: crear canal en Android antes de pedir
      await inicializarCanalNotificaciones();

      if (estado !== 'concedido') {
        const nuevoEstado = await pedir();
        if (nuevoEstado !== 'concedido') {
          setAvisosHabilitados(false);
          await guardarConfigNotificaciones(false);
          Alert.alert(
            'Notificaciones no concedidas',
            'No se otorgó el permiso para notificaciones del sistema. Podrás consultar las novedades de tus reportes en la pestaña "Avisos" dentro de la app.',
            [{ text: 'Entendido' }]
          );
          return;
        }
      }

      setAvisosHabilitados(true);
      await guardarConfigNotificaciones(true);
    } else {
      setAvisosHabilitados(false);
      await guardarConfigNotificaciones(false);
    }
  };

  const handleProbarNotificacion = async () => {
    if (estado !== 'concedido') {
      Alert.alert(
        'Permiso requerido',
        'Debés habilitar las notificaciones primero para probar esta función.',
        [{ text: 'OK' }]
      );
      return;
    }

    await inicializarCanalNotificaciones();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Notificación de prueba - IPF',
        body: 'El sistema de avisos de Mantenimiento IPF funciona correctamente.',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    Alert.alert('Notificación programada', 'Llegará en 2 segundos.');
  };

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Ajustes de la App"
        subtitulo="Configuración de notificaciones en contexto"
        mostrarAtras={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card principal del interruptor */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitulo}>
                Avisarme cuando se resuelva mi reporte
              </Text>
              <Text style={styles.switchDesc}>
                Recibí una alerta del sistema en tu dispositivo apenas el equipo técnico solucione el desperfecto que informaste.
              </Text>
            </View>
            <Switch
              value={avisosHabilitados}
              onValueChange={handleToggle}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={avisosHabilitados ? '#2563EB' : '#F1F5F9'}
              disabled={cargandoConfig}
            />
          </View>
        </View>

        {/* Estado actual del permiso */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Estado del sistema operativo</Text>

          <View style={styles.estadoRow}>
            <Text style={styles.estadoLabel}>Permiso de notificaciones:</Text>
            <EstadoBadge tipo="permiso" valor={estado} />
          </View>

          {Platform.OS === 'android' && (
            <View style={styles.infoDetalle}>
              <Text style={styles.infoDetalleTexto}>
                • Canal de Android: <Text style={styles.bold}>"reportes"</Text> (Alta prioridad con vibración y sonido).
              </Text>
            </View>
          )}

          {Platform.OS === 'ios' && detalle.provisional && (
            <View style={styles.infoDetalle}>
              <Text style={styles.infoDetalleTexto}>
                • Modo iOS: <Text style={styles.bold}>Autorización provisional</Text> (Entrega discreta sin sonido intrusivo).
              </Text>
            </View>
          )}

          {estado === 'bloqueado' && (
            <View style={styles.alertaBloqueado}>
              <Text style={styles.alertaTexto}>
                ⚠️ Las notificaciones están bloqueadas a nivel de sistema. Para recibirlas debés activarlas desde Ajustes.
              </Text>
              <TouchableOpacity
                style={styles.btnAjustes}
                onPress={abrirAjustes}
                activeOpacity={0.8}
              >
                <Text style={styles.btnAjustesTexto}>Abrir Ajustes del Teléfono</Text>
              </TouchableOpacity>
            </View>
          )}

          {estado === 'concedido' && (
            <TouchableOpacity
              style={styles.btnProbar}
              onPress={handleProbarNotificacion}
              activeOpacity={0.8}
            >
              <Text style={styles.btnProbarTexto}>🚀 Enviar notificación de prueba (2s)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Explicación de la consigna G2.5 */}
        <View style={styles.cardTeoria}>
          <Text style={styles.teoriaTitulo}>📖 Principio de "Pedir en contexto":</Text>
          <Text style={styles.teoriaTexto}>
            La app no solicita el permiso de notificaciones al inicio. Únicamente lo solicita cuando la persona activa explícitamente el interruptor superior, sabiendo exactamente qué beneficio obtendrá.
          </Text>
          <Text style={styles.teoriaTexto}>
            Si el permiso se rechaza, la aplicación nunca se rompe: las alertas se desvían de forma transparente a la pestaña <Text style={styles.bold}>/avisos</Text>.
          </Text>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  switchInfo: {
    flex: 1,
  },
  switchTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  switchDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  estadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estadoLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  infoDetalle: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  infoDetalleTexto: {
    fontSize: 12,
    color: '#475569',
  },
  bold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  alertaBloqueado: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 6,
  },
  alertaTexto: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
    marginBottom: 10,
  },
  btnAjustes: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAjustesTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  btnProbar: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnProbarTexto: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13,
  },
  cardTeoria: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teoriaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  teoriaTexto: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 6,
  },
});
