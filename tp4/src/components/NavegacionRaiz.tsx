import { Stack } from 'expo-router';
import { opcionesHeader } from '../constants/navegacion';
import { useBiblioteca } from '../context/BibliotecaContext';

// Stack raíz. Está fuera de _layout porque necesita leer la sesión del Context,
// y el Provider se monta en el layout.
export default function NavegacionRaiz() {
  const { sesion } = useBiblioteca();
  const conSesion = sesion !== null;

  return (
    <Stack screenOptions={opcionesHeader}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Stack.Screen
        name="reservar/[isbn]"
        options={{ presentation: 'modal', title: 'Confirmar reserva' }}
      />
      <Stack.Screen name="permisos/[recurso]" options={{ presentation: 'modal', title: 'Permiso' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Página no encontrada' }} />

      {/* Solo existe sin sesión: al ingresar se cierra solo */}
      <Stack.Protected guard={!conSesion}>
        <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Ingreso del personal' }} />
      </Stack.Protected>

      {/* Solo existe con sesión: al cerrarla desaparece del historial */}
      <Stack.Protected guard={conSesion}>
        <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
      </Stack.Protected>
    </Stack>
  );
}
