import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { colores, espacio, fuente, TOQUE_MINIMO } from '../constants/tema';

// Cierra lo que esté encima de las tabs (por ejemplo el modal de reserva) y cambia a la tab Catálogo
function volverAlCatalogo() {
  if (router.canDismiss()) router.dismissAll();
  router.navigate('/');
}

// Botón del header para volver al menú principal (el Catálogo) desde cualquier punto de la reserva
export default function BotonVolverCatalogo() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver al Catálogo"
      onPress={volverAlCatalogo}
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
      <Ionicons name="home-outline" size={20} color={colores.acento} />
      <Text style={estilos.texto}>Catálogo</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: TOQUE_MINIMO,
    minWidth: TOQUE_MINIMO,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xs,
    paddingHorizontal: espacio.s,
  },
  presionado: {
    opacity: 0.7,
  },
  texto: {
    color: colores.acento,
    fontSize: fuente.normal,
    fontWeight: '600',
  },
});
