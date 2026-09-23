import { Href, Link } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { estilos } from './estilos';

export default function BotonLink({
  href,
  titulo,
}: {
  href: Href;
  titulo: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={estilos.boton}>
        <Text style={estilos.botonTexto}>{titulo}</Text>
      </Pressable>
    </Link>
  );
}