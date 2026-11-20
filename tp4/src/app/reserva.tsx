import { Redirect } from 'expo-router';

// URL de la versión anterior de la app: la mandamos a la nueva
export default function ReservaVieja() {
  return <Redirect href="/reservas" />;
}
