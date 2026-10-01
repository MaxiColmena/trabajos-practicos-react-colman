import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Menú' }} />
      <Stack.Screen name="[id]" options={{ title: 'Cargando...' }} />
    </Stack>
  );
}
