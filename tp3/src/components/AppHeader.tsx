import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  titulo: string;
  subtitulo?: string;
  mostrarAtras?: boolean;
  mostrarAjustes?: boolean;
}

export function AppHeader({ titulo, subtitulo, mostrarAtras, mostrarAjustes }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {mostrarAtras ? (
          <TouchableOpacity
            style={styles.btnAtras}
            onPress={() => router.back()}
            accessibilityLabel="Volver atrás"
            activeOpacity={0.7}
          >
            <Text style={styles.iconoAtras}>←</Text>
            <Text style={styles.textoAtras}>Volver</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.brandContainer}>
            <View style={styles.logoPill}>
              <Text style={styles.logoText}>IPF</Text>
            </View>
            <Text style={styles.brandTitle}>Mantenimiento Edilicio</Text>
          </View>
        )}

        {mostrarAjustes && (
          <TouchableOpacity
            style={styles.btnAjustes}
            onPress={() => router.push('/ajustes-app')}
            accessibilityLabel="Configuración de notificaciones"
            activeOpacity={0.7}
          >
            <Text style={styles.iconoAjustes}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E3A8A',
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPill: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  logoText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTitle: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
  },
  btnAtras: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  iconoAtras: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  textoAtras: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  btnAjustes: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconoAjustes: {
    fontSize: 18,
  },
  titleContainer: {
    marginTop: 4,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitulo: {
    color: '#BFDBFE',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});
