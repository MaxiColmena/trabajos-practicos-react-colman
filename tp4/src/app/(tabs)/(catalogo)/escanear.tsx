import { useCallback, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import type { BarcodeScanningResult } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import Boton from '../../../components/Boton';
import EntradaIsbn from '../../../components/EntradaIsbn';
import EstadoCargando from '../../../components/EstadoCargando';
import TarjetaAviso from '../../../components/TarjetaAviso';
import VisorCamara from '../../../components/VisorCamara';
import { espacio } from '../../../constants/tema';
import { usePermiso } from '../../../hooks/usePermiso';
import { buscarLibroPorIsbn, esIsbnValido } from '../../../lib/catalogo';

// En la web, expo-camera lee códigos con un lector WebAssembly que se descarga de un CDN.
// Si esa descarga falla (red del instituto, sin internet) la app tira errores, así que ahí
// usamos solo el ingreso manual. En el teléfono el lector es nativo y no descarga nada.
const LECTOR_DISPONIBLE = Platform.OS !== 'web';

export default function Escanear() {
  const { estado, consultar, abrirAjustes } = usePermiso('camara');
  const [aviso, setAviso] = useState<string | null>(null);

  // useRef y no useState: cambia al instante, sin esperar un render.
  // onBarcodeScanned se dispara muchas veces por segundo.
  const yaNavego = useRef(false);
  const ultimoDesconocido = useRef<string | null>(null);

  // Al volver de /permisos/camara se vuelve a mirar el permiso
  useFocusEffect(
    useCallback(() => {
      consultar();
    }, [consultar]),
  );

  function abrir(isbn: string) {
    yaNavego.current = true;
    // replace: "atrás" desde el detalle no vuelve a la cámara
    router.replace({ pathname: '/libro/[isbn]', params: { isbn } });
  }

  function alLeer({ data }: BarcodeScanningResult) {
    if (yaNavego.current) return;
    // El mismo código desconocido sigue frente a la cámara: no repetimos el aviso
    if (data === ultimoDesconocido.current) return;

    if (buscarLibroPorIsbn(data)) {
      abrir(data);
    } else {
      ultimoDesconocido.current = data;
      setAviso(`Leímos ${data}, pero ese libro no está en la biblioteca. Podés probar con otro.`);
    }
  }

  function buscarManual(isbn: string) {
    if (!esIsbnValido(isbn)) {
      setAviso('El ISBN tiene que tener 13 números. Fijate debajo del código de barras.');
    } else if (!buscarLibroPorIsbn(isbn)) {
      setAviso(`No tenemos ningún libro con el ISBN ${isbn}.`);
    } else {
      abrir(isbn);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
      {!LECTOR_DISPONIBLE && (
        <TarjetaAviso texto="En la versión web no se puede leer el código de barras. Escribí el ISBN abajo, o abrí la app en el teléfono para usar la cámara." />
      )}

      {LECTOR_DISPONIBLE && estado === 'cargando' && (
        <EstadoCargando mensaje="Revisando el permiso de la cámara…" />
      )}

      {LECTOR_DISPONIBLE && estado === 'concedido' && <VisorCamara onLeer={alLeer} />}

      {LECTOR_DISPONIBLE && estado === 'preguntable' && (
        <TarjetaAviso texto="Para leer el código de barras necesitamos usar la cámara. Si preferís, escribí el ISBN abajo.">
          <Boton texto="Usar la cámara" onPress={() => router.push('/permisos/camara')} />
        </TarjetaAviso>
      )}

      {LECTOR_DISPONIBLE && estado === 'bloqueado' && (
        <TarjetaAviso
          tono="alerta"
          texto="La cámara está bloqueada para esta app. Podés activarla en Ajustes o escribir el ISBN a mano.">
          <Boton texto="Abrir Ajustes" variante="secundario" onPress={abrirAjustes} />
        </TarjetaAviso>
      )}

      {aviso ? <TarjetaAviso tono="alerta" texto={aviso} /> : null}

      <EntradaIsbn onBuscar={buscarManual} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: espacio.l,
    gap: espacio.l,
    flexGrow: 1,
  },
});
