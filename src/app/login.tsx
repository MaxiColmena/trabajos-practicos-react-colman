import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { router } from 'expo-router';

import Pantalla from '../components/pantalla';
import Boton from '../components/boton';
import { estilos } from '../components/estilos';
import { useApp } from '../context/appContext';

export default function Login() {
  const { ingresar } = useApp();

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const entrar = () => {
    const correcto = ingresar(usuario, clave);

    if (!correcto) {
      setError('Usuario o contraseña incorrectos');
      return;
    }

    setError('');
    router.replace('/');
  };

  return (
    <Pantalla>
      <Text style={estilos.titulo}>Comedor IPF</Text>

      <Text style={estilos.subtitulo}>
        Iniciar sesión
      </Text>

      <TextInput
        style={estilos.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />

      <TextInput
        style={estilos.input}
        placeholder="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
      />

      {error !== '' && (
        <Text style={estilos.error}>
          {error}
        </Text>
      )}

      <Boton
        titulo="Ingresar"
        onPress={entrar}
      />
    </Pantalla>
  );
}