import { Stack } from 'expo-router';
import LinkPersonal from '../../../components/LinkPersonal';
import { opcionesHeader } from '../../../constants/navegacion';

// Si se entra por deep link a /libro/..., el Catálogo queda debajo
export const unstable_settings = { anchor: 'index' };

export default function CatalogoLayout() {
  return (
    <Stack screenOptions={opcionesHeader}>
      <Stack.Screen name="index" options={{ title: 'Biblioteca IPF', headerRight: LinkPersonal }} />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear' }} />
    </Stack>
  );
}
