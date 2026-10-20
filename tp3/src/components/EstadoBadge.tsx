import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EstadoReporte, EstadoPermiso } from '../lib/types';

interface EstadoBadgeProps {
  tipo: 'reporte' | 'permiso';
  valor: EstadoReporte | EstadoPermiso | 'parcial';
}

export function EstadoBadge({ tipo, valor }: EstadoBadgeProps) {
  let bg = '#F3F4F6';
  let color = '#4B5563';
  let border = '#E5E7EB';
  let label = String(valor);

  if (tipo === 'reporte') {
    if (valor === 'pendiente') {
      bg = '#FEF3C7';
      color = '#B45309';
      border = '#FDE68A';
      label = 'Pendiente';
    } else if (valor === 'en curso') {
      bg = '#E0F2FE';
      color = '#0369A1';
      border = '#BAE6FD';
      label = 'En curso';
    } else if (valor === 'resuelto') {
      bg = '#D1FAE5';
      color = '#047857';
      border = '#A7F3D0';
      label = 'Resuelto';
    }
  } else {
    if (valor === 'concedido') {
      bg = '#D1FAE5';
      color = '#047857';
      border = '#A7F3D0';
      label = 'Concedido';
    } else if (valor === 'preguntable') {
      bg = '#EEF2FF';
      color = '#4338CA';
      border = '#C7D2FE';
      label = 'Preguntable';
    } else if (valor === 'bloqueado') {
      bg = '#FEE2E2';
      color = '#B91C1C';
      border = '#FECACA';
      label = 'Bloqueado';
    } else if (valor === 'parcial') {
      bg = '#F3E8FF';
      color = '#7E22CE';
      border = '#E9D5FF';
      label = 'Parcial';
    } else if (valor === 'cargando') {
      bg = '#F3F4F6';
      color = '#6B7280';
      border = '#E5E7EB';
      label = 'Consultando...';
    }
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
