import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { espacio } from '../constants/tema';
import Boton from './Boton';
import CampoTexto from './CampoTexto';

// Alternativa a la cámara: escribir el ISBN a mano
export default function EntradaIsbn({ onBuscar }: { onBuscar: (isbn: string) => void }) {
  const [texto, setTexto] = useState('');

  function enviar() {
    // Se aceptan guiones y espacios, como viene impreso en el libro
    onBuscar(texto.replace(/[-\s]/g, ''));
  }

  return (
    <View style={estilos.contenedor}>
      <CampoTexto
        etiqueta="O escribí el ISBN (13 números)"
        placeholder="978-950-547-269-7"
        value={texto}
        onChangeText={setTexto}
        keyboardType="number-pad"
        onSubmitEditing={enviar}
        returnKeyType="go"
      />
      <Boton texto="Abrir libro" variante="secundario" onPress={enviar} deshabilitado={!texto.trim()} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.m,
  },
});
