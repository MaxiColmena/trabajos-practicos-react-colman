import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePermiso } from '../../hooks/usePermiso';
import { TipoRecurso } from '../../lib/types';
import { RECURSOS_INFO } from '../../lib/permisosConfig';

export default function PermisoModalScreen() {
  const router = useRouter();
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const tipo = (recurso as TipoRecurso) || 'camara';
  const info = RECURSOS_INFO[tipo] || RECURSOS_INFO.camara;

  const { estado, pedir, abrirAjustes } = usePermiso(tipo);

  const esBloqueado = estado === 'bloqueado';

  const handleAccion = async () => {
    if (esBloqueado) {
      abrirAjustes();
      return;
    }

    // Pedir permiso al sistema
    const res = await pedir();
    // Volver a la pantalla previa después de interactuar con el diálogo
    router.back();
  };

  const getEmoji = () => {
    switch (tipo) {
      case 'camara':
        return '📷';
      case 'ubicacion':
        return '📍';
      case 'notificaciones':
        return '🔔';
      case 'microfono':
        return '🎙️';
      case 'galeria':
        return '🖼️';
      default:
        return '🛡️';
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.cardModal}>
        <View style={styles.iconoCircle}>
          <Text style={styles.icono}>{getEmoji()}</Text>
        </View>

        <Text style={styles.titulo}>
          {esBloqueado ? `Habilitar ${info.titulo}` : `Permiso de ${info.titulo}`}
        </Text>

        <View style={styles.propositoBox}>
          <Text style={styles.propositoTexto}>"{info.proposito}"</Text>
        </View>

        {esBloqueado ? (
          <View style={styles.bloqueadoInfoBox}>
            <Text style={styles.bloqueadoTexto}>
              ⚠️ El permiso fue denegado anteriormente. Para utilizar esta función, debés habilitarlo manualmente desde los Ajustes del dispositivo.
            </Text>
            <Text style={styles.guiaAjustes}>
              {Platform.OS === 'android'
                ? 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos'
                : 'Ajustes > Mantenimiento IPF'}
            </Text>
          </View>
        ) : (
          <Text style={styles.beneficioExplicacion}>
            Al otorgar este acceso, la aplicación podrá operar de forma ágil y completar la información de tu reporte.
          </Text>
        )}

        <View style={styles.aclaracionBox}>
          <Text style={styles.aclaracionTexto}>
            🔒 Podés revocar o modificar este permiso en cualquier momento desde los Ajustes de tu teléfono.
          </Text>
        </View>

        {/* Único botón afirmativo según pauta 5.1.1(iv) de Apple y consigna */}
        <TouchableOpacity
          style={[styles.btnContinuar, esBloqueado && styles.btnAjustes]}
          onPress={handleAccion}
          activeOpacity={0.8}
        >
          <Text style={styles.btnContinuarTexto}>
            {esBloqueado ? 'Abrir Ajustes' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  icono: {
    fontSize: 32,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  propositoBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 14,
  },
  propositoTexto: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  beneficioExplicacion: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 14,
  },
  bloqueadoInfoBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bloqueadoTexto: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
    marginBottom: 6,
  },
  guiaAjustes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7F1D1D',
  },
  aclaracionBox: {
    marginBottom: 20,
  },
  aclaracionTexto: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  btnContinuar: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnAjustes: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
  },
  btnContinuarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
