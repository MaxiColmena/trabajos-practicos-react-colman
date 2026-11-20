import { ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import NavegacionRaiz from '../components/NavegacionRaiz';
import { temaNavegacion } from '../constants/navegacion';
import { BibliotecaProvider } from '../context/BibliotecaContext';
import '../lib/notificaciones';

// Un deep link a /buscar deja las pestañas debajo en la pila
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  return (
    <ThemeProvider value={temaNavegacion}>
      <BibliotecaProvider>
        <StatusBar style="light" />
        <NavegacionRaiz />
      </BibliotecaProvider>
    </ThemeProvider>
  );
}
