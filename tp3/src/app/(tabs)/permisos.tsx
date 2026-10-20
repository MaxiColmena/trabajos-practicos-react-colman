import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../components/AppHeader';
import { EstadoBadge } from '../../components/EstadoBadge';
import { usePermiso } from '../../hooks/usePermiso';
import { TipoRecurso } from '../../lib/types';
import { RECURSOS_INFO } from '../../lib/permisosConfig';

function FilaPermiso({ recurso }: { recurso: TipoRecurso }) {
  const router = useRouter();
  const info = RECURSOS_INFO[recurso];
  const { estado, parcial, detalle, pedir, abrirAjustes, consultar } = usePermiso(recurso);
  const [solicitando, setSolicitando] = useState(false);

  const handleBotonAccion = async () => {
    if (estado === 'bloqueado') {
      abrirAjustes();
      return;
    }

    if (estado === 'concedido') {
      Alert.alert(info.titulo, 'El permiso ya se encuentra otorgado correctamente.');
      return;
    }

    // Navegar primero a la pantalla previa modal /permisos/[recurso] como exige la consigna
    router.push({
      pathname: '/permisos/[recurso]',
      params: { recurso },
    });
  };

  const getEmojiRecurso = (r: TipoRecurso) => {
    switch (r) {
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
        return '⚙️';
    }
  };

  return (
    <View style={styles.cardPermiso}>
      <View style={styles.cardTop}>
        <View style={styles.iconoTituloRow}>
          <Text style={styles.recursoEmoji}>{getEmojiRecurso(recurso)}</Text>
          <View>
            <Text style={styles.recursoTitulo}>{info.titulo}</Text>
            <Text style={styles.moduloSub}>{info.modulo}</Text>
          </View>
        </View>

        <View style={styles.badgesCol}>
          <EstadoBadge tipo="permiso" valor={estado} />
          {parcial && (
            <View style={{ marginTop: 4 }}>
              <EstadoBadge tipo="permiso" valor="parcial" />
            </View>
          )}
        </View>
      </View>

      <Text style={styles.propositoTexto}>"{info.proposito}"</Text>

      {/* Matices específicos de la plataforma */}
      <View style={styles.detallesBox}>
        <View style={styles.detalleItem}>
          <Text style={styles.detalleLabel}>Cuándo se pide:</Text>
          <Text style={styles.detalleValor}>{info.cuandoSePide}</Text>
        </View>
        <View style={styles.detalleItem}>
          <Text style={styles.detalleLabel}>Alternativa si se deniega:</Text>
          <Text style={styles.detalleValor}>{info.alternativa}</Text>
        </View>

        {recurso === 'ubicacion' && detalle.accuracy && (
          <View style={styles.matizRow}>
            <Text style={styles.matizTag}>
              Matiz GPS: {detalle.accuracy === 'coarse' ? 'Aproximada (coarse)' : 'Precisa (fine)'}
            </Text>
          </View>
        )}

        {recurso === 'galeria' && (
          <View style={styles.matizRow}>
            <Text style={styles.matizTagVerde}>
              Acceso: Photo Picker del SO (0 permisos declarados)
            </Text>
          </View>
        )}

        {recurso === 'notificaciones' && detalle.provisional && (
          <View style={styles.matizRow}>
            <Text style={styles.matizTagProvisional}>
              Matiz iOS: Notificaciones provisionales activas (entrega discreta)
            </Text>
          </View>
        )}
      </View>

      {/* Botones de acción */}
      <View style={styles.accionesRow}>
        <TouchableOpacity
          style={styles.btnSecundario}
          onPress={() => consultar()}
          activeOpacity={0.7}
        >
          <Text style={styles.btnSecundarioTexto}>🔄 Reconsultar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnPrincipal,
            estado === 'bloqueado' && styles.btnAjustes,
            estado === 'concedido' && styles.btnConcedido,
          ]}
          onPress={handleBotonAccion}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPrincipalTexto}>
            {estado === 'bloqueado'
              ? 'Abrir Ajustes'
              : estado === 'concedido'
              ? '✓ Otorgado'
              : 'Ver Pantalla Previa'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PermisosPanelScreen() {
  const recursos: TipoRecurso[] = ['camara', 'ubicacion', 'notificaciones', 'galeria', 'microfono'];

  return (
    <View style={styles.container}>
      <AppHeader
        titulo="Panel de Permisos"
        subtitulo="Gestión transparente y mínimo privilegio"
        mostrarAjustes={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner de Plataforma */}
        <View style={styles.plataformaBanner}>
          <View style={styles.plataformaPill}>
            <Text style={styles.plataformaText}>SO: {Platform.OS.toUpperCase()}</Text>
          </View>
          <Text style={styles.plataformaDesc}>
            Este panel lee en vivo las APIs nativas del dispositivo y se refresca automáticamente al volver de Ajustes usando AppState.
          </Text>
        </View>

        {/* Lista de Recursos */}
        {recursos.map((rec) => (
          <FilaPermiso key={rec} recurso={rec} />
        ))}

        {/* Desafío opcional: Bloqueo por plataforma e instructivo */}
        <View style={styles.bloqueoGuiaBox}>
          <Text style={styles.bloqueoTitulo}>📌 Camino exacto en Ajustes para desbloquear:</Text>
          {Platform.OS === 'android' ? (
            <View style={styles.guiaPaso}>
              <Text style={styles.guiaTexto}>
                <Text style={styles.guiaBold}>Android:</Text> Ajustes del sistema ➔ Aplicaciones ➔ Mantenimiento IPF ➔ Permisos ➔ Seleccionar el permiso ➔ Marcar "Permitir solo mientras la app está en uso".
              </Text>
            </View>
          ) : (
            <View style={styles.guiaPaso}>
              <Text style={styles.guiaTexto}>
                <Text style={styles.guiaBold}>iOS:</Text> Ajustes ➔ Mantenimiento IPF ➔ Activar el interruptor del permiso correspondiente (Cámara / Ubicación / Notificaciones).
              </Text>
            </View>
          )}
          <Text style={styles.guiaNota}>
            Al regresar a la aplicación, el hook useRevisarAlVolver detecta el cambio de AppState y actualiza el estado inmediatamente sin necesidad de reiniciar la app.
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  plataformaBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  plataformaPill: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  plataformaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  plataformaDesc: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  cardPermiso: {
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconoTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  recursoEmoji: {
    fontSize: 26,
  },
  recursoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  moduloSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  badgesCol: {
    alignItems: 'flex-end',
  },
  propositoTexto: {
    fontSize: 13,
    color: '#1E293B',
    fontStyle: 'italic',
    lineHeight: 19,
    marginBottom: 12,
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
  },
  detallesBox: {
    gap: 8,
    marginBottom: 14,
  },
  detalleItem: {
    flexDirection: 'column',
  },
  detalleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detalleValor: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  matizRow: {
    marginTop: 4,
  },
  matizTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  matizTagVerde: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  matizTagProvisional: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  accionesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  btnSecundario: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  btnSecundarioTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  btnPrincipal: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAjustes: {
    backgroundColor: '#DC2626',
  },
  btnConcedido: {
    backgroundColor: '#059669',
  },
  btnPrincipalTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  bloqueoGuiaBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 8,
  },
  bloqueoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  guiaPaso: {
    marginBottom: 8,
  },
  guiaTexto: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
  },
  guiaBold: {
    fontWeight: '700',
  },
  guiaNota: {
    fontSize: 12,
    color: '#B45309',
    fontStyle: 'italic',
    lineHeight: 17,
  },
});
