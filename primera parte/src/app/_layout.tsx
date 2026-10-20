import { Stack } from 'expo-router';
import { AppProvider, useApp } from '../context/appContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = { anchor: '(tabs)' };

function NavegacionRaiz() {
  const { usuario } = useApp();
  const conSesion = usuario !== null;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Stack.Screen name="categorias/[categoria]" options={{ title: 'Categoría' }} />
      <Stack.Screen name="turno/[numero]" options={{ title: 'Turno' }} />
      <Stack.Screen name="confirmar" options={{ presentation: 'modal', title: 'Confirmar' }} />
      <Stack.Screen name="ayuda" options={{ title: 'Ayuda' }} />
      <Stack.Screen name="+not-found" options={{ title: 'No Encontrado' }} />

      {/* Rutas protegidas */}
      <Stack.Protected guard={conSesion}>
        <Stack.Screen name="cocina" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!conSesion}>
        <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Iniciar Sesión' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavegacionRaiz />
      </AppProvider>
    </GestureHandlerRootView>
  );
}