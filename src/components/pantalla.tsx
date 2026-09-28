import { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import DondeEstoy from './dondeEstoy';
import { estilos } from './estilos';

export default function Pantalla({ children }: { children: ReactNode }) {
  return (
    <ScrollView contentContainerStyle={estilos.pantalla}>
      {children}

      <DondeEstoy />
    </ScrollView>
  );
}