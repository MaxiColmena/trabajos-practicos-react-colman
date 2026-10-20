import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import Pantalla from '../components/pantalla';
import PlatoTarjeta from '../components/platoTarjeta';
import { estilos } from '../components/estilos';

import { platos } from '../data/platos';

const CATEGORIAS = ['almuerzo', 'desayuno', 'bebidas', 'kiosco'];

export default function Buscar() {
  const {
    q = '',
    categoria = '',
  } = useLocalSearchParams<{
    q?: string;
    categoria?: string;
  }>();

  const [texto, setTexto] = useState(q);

  const resultados = platos.filter(
    (plato) =>
      plato.nombre.toLowerCase().includes(q.toLowerCase()) &&
      (categoria === '' || plato.categoria === categoria)
  );

  return (
    <Pantalla>
      <Text style={estilos.titulo}>
        Buscar platos
      </Text>

      <TextInput
        style={estilos.input}
        placeholder="Buscar plato..."
        value={texto}
        onChangeText={(textoNuevo) => {
          setTexto(textoNuevo);
          router.setParams({ q: textoNuevo });
        }}
      />

      <View style={estilos.fila}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            style={[
              estilos.chip,
              categoria === cat && estilos.chipActivo,
            ]}
            onPress={() =>
              router.setParams({
                categoria: categoria === cat ? undefined : cat,
              })
            }
          >
            <Text
              style={{
                color: categoria === cat ? 'white' : 'black',
              }}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      {resultados.length === 0 && (
        <Text style={estilos.texto}>
          Sin resultados.
        </Text>
      )}

      {resultados.map((plato) => (
        <PlatoTarjeta
          key={plato.id}
          plato={plato}
        />
      ))}
    </Pantalla>
  );
}