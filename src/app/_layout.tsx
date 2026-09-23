import { Stack } from 'expo-router';
import { AppProvider } from '../context/appContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack />
    </AppProvider>
  );
}