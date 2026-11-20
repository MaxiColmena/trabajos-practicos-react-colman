import { Tabs } from 'expo-router/js-tabs';
import IconoTab from '../../components/IconoTab';
import { opcionesTabs } from '../../constants/navegacion';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={opcionesTabs}>
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          headerShown: false, // el Catálogo tiene su propio Stack con header
          tabBarIcon: ({ color, size }) => <IconoTab nombre="library-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: ({ color, size }) => <IconoTab nombre="bookmark-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
