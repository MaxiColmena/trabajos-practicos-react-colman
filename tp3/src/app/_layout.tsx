import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/nuevo" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/escanear" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/foto" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/ubicacion" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="ajustes-app" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
