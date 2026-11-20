import { DarkTheme, type Theme } from 'expo-router';
import { colores } from './tema';

// Tema de React Navigation con los colores de la app (evita fondos blancos al navegar)
export const temaNavegacion: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colores.acento,
    background: colores.fondo,
    card: colores.superficie,
    text: colores.texto,
    border: colores.borde,
  },
};

export const opcionesHeader = {
  headerStyle: { backgroundColor: colores.superficie },
  headerTintColor: colores.texto,
  headerTitleStyle: { fontWeight: '700' as const },
  contentStyle: { backgroundColor: colores.fondo },
};

export const opcionesTabs = {
  tabBarActiveTintColor: colores.acento,
  tabBarInactiveTintColor: colores.textoSuave,
  tabBarStyle: { backgroundColor: colores.superficie, borderTopColor: colores.borde },
  headerStyle: opcionesHeader.headerStyle,
  headerTintColor: opcionesHeader.headerTintColor,
};
