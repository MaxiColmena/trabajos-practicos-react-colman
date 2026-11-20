import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import { colores, espacio, fuente } from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';

export default function Login() {
  const { ingresar } = useBiblioteca();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  function enviar() {
    // Si los datos son correctos, Stack.Protected saca esta pantalla sola
    const ok = ingresar(usuario, clave);
    if (!ok) {
      setError('El usuario o la clave no coinciden. Revisalos y probá otra vez.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={estilos.titulo}>Mostrador de la biblioteca</Text>
      <Text style={estilos.subtitulo}>Solo para el personal del IPF.</Text>

      <CampoTexto
        etiqueta="Usuario"
        value={usuario}
        onChangeText={(t) => {
          setUsuario(t);
          setError(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <CampoTexto
        etiqueta="Clave"
        value={clave}
        onChangeText={(t) => {
          setClave(t);
          setError(null);
        }}
        secureTextEntry
        onSubmitEditing={enviar}
      />

      {error ? (
        <Text style={estilos.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <Boton texto="Ingresar" onPress={enviar} deshabilitado={!usuario || !clave} />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: espacio.xl,
    gap: espacio.l,
  },
  titulo: {
    color: colores.texto,
    fontSize: fuente.titulo,
    fontWeight: '700',
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: fuente.normal,
  },
  error: {
    color: colores.peligro,
    fontSize: fuente.normal,
  },
});
