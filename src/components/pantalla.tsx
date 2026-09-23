import { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';
import { estilos } from './estilos';

export default function Pantalla({ children }: PropsWithChildren) {
  return (
    <ScrollView contentContainerStyle={estilos.pantalla}>
      {children}
    </ScrollView>
  );
}