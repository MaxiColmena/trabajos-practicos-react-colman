import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import Pantalla from '../../../components/pantalla';
import Boton from '../../../components/boton';
import BotonLink from '../../../components/botonLink';
import { estilos } from '../../../components/estilos';
import { useApp } from '../../../context/appContext';

export default function Nota() {
  const { nota, setNota } = useApp();

  return (
    <Pantalla>
      <Text style={estilos.titulo}>Nota para la cocina</Text>
      
      <TextInput
        style={estilos.input}
        value={nota}
        onChangeText={setNota}
        placeholder="Ej. Sin sal, extra queso..."
        multiline
      />

      <Boton 
        titulo="Guardar nota"
        onPress={() => router.back()}
      />

      <BotonLink href={{ pathname: '/(tabs)/carrito' }} titulo="Volver al carrito" />
    </Pantalla>
  );
}
