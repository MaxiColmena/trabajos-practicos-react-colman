import { Pressable, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { colores, espacio, fuente, TOQUE_MINIMO } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';

// Link "Personal" del header: lleva al login o, si ya hay sesión, al mostrador
export default function LinkPersonal() {
  const { sesion } = useBiblioteca();

  return (
    <Link href={sesion ? '/mostrador' : '/login'} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={sesion ? 'Ir al mostrador' : 'Ingreso del personal'}
        style={estilos.boton}>
        <Text style={estilos.texto}>{sesion ? 'Mostrador' : 'Personal'}</Text>
      </Pressable>
    </Link>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: TOQUE_MINIMO,
    minWidth: TOQUE_MINIMO,
    justifyContent: 'center',
    paddingHorizontal: espacio.s,
  },
  texto: {
    color: colores.acento,
    fontSize: fuente.normal,
    fontWeight: '600',
  },
});
