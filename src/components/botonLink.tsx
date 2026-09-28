import { Href, Link } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { estilos } from './estilos';

type Props = {
  href: Href | '/';
  titulo: string;
};

export default function BotonLink({
  href,
  titulo,
}: Props) {
  return (
    <Link href={href as Href} asChild>
      <Pressable style={estilos.boton}>
        <Text style={estilos.botonTexto}>
          {titulo}
        </Text>
      </Pressable>
    </Link>
  );
}