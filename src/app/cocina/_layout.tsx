import { Drawer } from 'expo-router/drawer';
import { useApp } from '../../context/appContext';

export default function CocinaLayout() {
  const { cerrarSesion } = useApp();

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          title: 'Pedidos en Cola',
          drawerLabel: 'En Cola',
        }}
      />
      <Drawer.Screen
        name="atendidos"
        options={{
          title: 'Pedidos Atendidos',
          drawerLabel: 'Atendidos',
        }}
      />
    </Drawer>
  );
}
