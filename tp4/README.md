# Biblioteca IPF — TP 4 App integradora

**Alumno: Colman Maximo** · Taller Complementario React Native II · Instituto Politécnico Formosa

App para que los alumnos consulten el catálogo de la biblioteca, reserven libros y reciban un recordatorio antes de devolverlos. El personal entrega los libros respetando el orden de las listas de espera.

El catálogo es de fantasía y aventura (Tolkien, El Principito, Narnia, Harry Potter…), con un tema oscuro y acento **verde Comarca**.

- **SDK de Expo:** 58 (`expo ~58.0.26`, creado con `npx create-expo-app@latest`)
- **Navegación:** Expo Router con rutas tipadas
- **Módulos nativos:** solo `expo-camera` y `expo-notifications`

### Extras

- **Portadas reales:** cada tarjeta muestra la tapa del libro desde [Open Library](https://openlibrary.org) (`covers.openlibrary.org`), con `expo-image` y caché. Si no hay internet o la tapa no carga, se muestra una tapa con la inicial del título.
- **Scroll infinito:** al llegar al final del Catálogo se agrega otra tanda con los mismos libros en orden aleatorio (`hooks/useCatalogoInfinito.ts`). La `key` de cada fila es `ISBN-tanda`, nunca el índice.
- **Volver al Catálogo:** el modal de reserva y la pestaña Mis reservas tienen arriba un botón "Catálogo" que cierra lo que esté abierto y vuelve al menú principal.
- **Debounce:** el buscador espera 300 ms sin escribir antes de buscar.
- **Búsqueda por ISBN:** si se escriben números (el ISBN completo, con guiones o una parte), el buscador filtra el catálogo por código sin llamar a `buscarLibros`, porque esa función de la consigna solo busca por título o autor y se dejó tal cual.
- **Versión web:** el escáner usa solo el ingreso manual del ISBN. En la web, `expo-camera` lee códigos con un lector WebAssembly (`zxing-wasm`) que descarga de un CDN, y si la red lo bloquea la app tira errores. En el teléfono el lector es nativo.

---

## Cómo ejecutarlo

En PowerShell, desde la raíz del repositorio:

```powershell
Set-Location "tp4"
npm install
npx expo start
```

Escanear el QR con **Expo Go** (el teléfono y la compu tienen que estar en la misma red).

| Dato | Valor |
|---|---|
| Usuario de la app (aparece en las listas de espera) | `Maxi` |
| Usuario del personal | `bibliotecario` |
| Clave del personal | `comarca` |

---

## Árbol de rutas (`src/app`)

```
src/app/
├── _layout.tsx                 # Stack raíz + BibliotecaProvider (anchor: "(tabs)")
├── (tabs)/
│   ├── _layout.tsx             # Tabs (expo-router/js-tabs): Catálogo y Mis reservas
│   ├── (catalogo)/
│   │   ├── _layout.tsx         # Stack propio de la tab Catálogo (anchor: "index")
│   │   ├── index.tsx           # /                → Catálogo
│   │   ├── libro/[isbn].tsx    # /libro/[isbn]    → Detalle
│   │   └── escanear.tsx        # /escanear        → Escáner EAN-13
│   └── reservas.tsx            # /reservas        → Mis reservas
├── buscar.tsx                  # /buscar?q=       → Stack raíz
├── reservar/[isbn].tsx         # /reservar/[isbn] → modal
├── permisos/[recurso].tsx      # /permisos/camara y /permisos/notificaciones → modal
├── login.tsx                   # /login           → modal, Stack.Protected (sin sesión)
├── mostrador.tsx               # /mostrador       → Stack.Protected (con sesión)
├── reserva.tsx                 # /reserva         → <Redirect href="/reservas" />
└── +not-found.tsx              # cualquier otra   → 404 con la URL
```

| Layout | Navegador |
|---|---|
| `src/app/_layout.tsx` | `Stack` raíz (el `<Stack>` está en `src/components/NavegacionRaiz.tsx` porque lee la sesión del Context) |
| `src/app/(tabs)/_layout.tsx` | `Tabs` de `expo-router/js-tabs` (el import que corresponde a SDK 58) con íconos de `@expo/vector-icons` |
| `src/app/(tabs)/(catalogo)/_layout.tsx` | `Stack` de la tab Catálogo |

## Estructura de `src`

| Carpeta | Contenido |
|---|---|
| `app/` | Solo rutas |
| `components/` | Un componente por archivo (`Boton`, `FilaLibro`, `VisorCamara`…) |
| `hooks/` | `useLibros`, `useCatalogoInfinito`, `usePermiso`, `useRevisarAlVolver` |
| `lib/` | API simulada, notificaciones, permisos, catálogo (con la URL de la portada), fechas y mezcla aleatoria |
| `context/` | `BibliotecaContext`: sesión, recientes, préstamos, listas de espera y avisos |
| `estructuras/` | `Pila` y `Cola` (las del TP 2, con `#items`, `tamanio`, `aArray()` y `clonar()`) |
| `data/` | `libros.ts` (17 libros y las listas de espera iniciales) y `portadas.ts` (id de cada tapa en Open Library) |
| `types/` | Tipos de la app |
| `constants/` | `tema.ts` (colores, espacios, tamaños), `biblioteca.ts` y `navegacion.ts` |

---

## Plugins de `app.json`

```jsonc
"plugins": [
  "expo-router",
  // Pantalla de carga con el fondo oscuro de la app
  ["expo-splash-screen", { "backgroundColor": "#0E1311", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }],
  ["expo-camera", {
    // Texto de propósito (iOS): "Usamos tu [dato] para [beneficio concreto]"
    "cameraPermission": "Usamos tu cámara para leer el código de barras de la contratapa y abrir el libro sin escribir el ISBN.",
    // Mínimo privilegio: la app no graba video, no necesita micrófono
    "microphonePermission": false,  // no agrega NSMicrophoneUsageDescription en iOS
    "recordAudioAndroid": false,    // no agrega RECORD_AUDIO en Android
    "barcodeScannerEnabled": true   // se usa para leer EAN-13
  }],
  // Color del ícono de las notificaciones en Android (verde Comarca)
  ["expo-notifications", { "color": "#7FA35B" }]
]
```

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se niega |
|---|---|---|---|
| Cámara | `expo-camera` (`useCameraPermissions` dentro de `usePermiso`) | Al tocar "Usar la cámara" en `/escanear`, después de la pantalla previa `/permisos/camara` | Escribir el ISBN a mano en la misma pantalla |
| Notificaciones | `expo-notifications` | Solo al activar el interruptor "Recordarme" de un préstamo, después de `/permisos/notificaciones`. En Android se crea antes el canal `prestamos` | Los avisos aparecen dentro de la app, en "Mis reservas" |

### `blockedPermissions` (Android)

Algunas librerías pueden sumar permisos al manifiesto aunque la app no los use. Los bloqueamos para que la app pida **solo** cámara y notificaciones:

| Permiso bloqueado | Por qué |
|---|---|
| `RECORD_AUDIO` | La cámara solo lee códigos, no graba video con sonido |
| `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION` | La app no necesita saber dónde estás |
| `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` | No se leen ni guardan fotos o archivos |
| `READ_CONTACTS` | No se usan contactos |
| `SYSTEM_ALERT_WINDOW` | No se dibuja encima de otras apps |

---

## Deep links de prueba

En Expo Go se usa la forma `exp://IP:8081/--/ruta`. En una build propia, el esquema es `bibliotecaipf://`.

| Link | Qué se espera |
|---|---|
| `bibliotecaipf://libro/9789505472697` | Detalle de *El Hobbit*, con el Catálogo debajo |
| `bibliotecaipf://libro/123` | Mensaje "Ese ISBN no es válido" con botón al Catálogo |
| `bibliotecaipf://buscar?q=tolkien` | Buscador con los resultados de "tolkien" y las tabs debajo |
| `bibliotecaipf://mostrador` (sin sesión) | No se muestra el mostrador: la ruta está protegida |
| `bibliotecaipf://reserva` | Redirige a Mis reservas |
| `bibliotecaipf://escanear` (cámara bloqueada) | Escáner con "Abrir Ajustes" y el ingreso manual |

---

## Casos de error

| Situación | Qué ve la persona |
|---|---|
| `obtenerLibros()` falla | "No cargó el catálogo" con botón **Reintentar** |
| Se abre `/libro/abc` | "Ese ISBN no es válido" y botón **Ir al Catálogo** |
| Se escanea un ISBN que no está | Aviso "ese libro no está en la biblioteca" (una sola vez por código) y se sigue escaneando |
| Cámara bloqueada | Botón **Abrir Ajustes** + ingreso manual del ISBN |
| Notificaciones denegadas | Los avisos aparecen en Mis reservas |
| Reservar un libro ya reservado | "Ya lo tenés reservado" (y el botón del detalle queda deshabilitado) |
| Lista de espera vacía en el mostrador | "Nadie está esperando" (el libro no aparece) |
| Login con clave incorrecta | "El usuario o la clave no coinciden" |

---

## Verificación

```text
> npx expo lint
(sin errores ni advertencias)

> npx tsc --noEmit
(sin errores)
```

## Capturas

Tomadas de la versión web (`npx expo start --web`) con pantalla de teléfono (390 × 844). Están en [`capturas/`](capturas). Para la captura del error, la falla de `obtenerLibros()` se forzó haciendo que `Math.random` devuelva 0,1, que es lo mismo que pasa 1 de cada 5 veces.

| Catálogo cargando | Catálogo con error | Catálogo con datos | Buscador |
|---|---|---|---|
| ![](capturas/01-catalogo-cargando.png) | ![](capturas/02-catalogo-error.png) | ![](capturas/03-catalogo-con-datos.png) | ![](capturas/04-buscador.png) |

| Detalle | Detalle inexistente | Reserva con ejemplares | Reserva sin ejemplares |
|---|---|---|---|
| ![](capturas/05-detalle.png) | ![](capturas/06-detalle-inexistente.png) | ![](capturas/07-reserva-con-ejemplares.png) | ![](capturas/08-reserva-sin-ejemplares.png) |

| Mis reservas | Escáner (web: ingreso manual) | Permiso de notificaciones | Login con clave incorrecta |
|---|---|---|---|
| ![](capturas/09-mis-reservas.png) | ![](capturas/10-escaner-web-ingreso-manual.png) | ![](capturas/11-permiso-notificaciones.png) | ![](capturas/12-login-clave-incorrecta.png) |

| Mostrador antes | Mostrador después de "Entregar al siguiente" | Aviso dentro de la app | 404 |
|---|---|---|---|
| ![](capturas/13-mostrador-antes.png) | ![](capturas/14-mostrador-despues.png) | ![](capturas/15-aviso-dentro-de-la-app.png) | ![](capturas/16-pagina-404.png) |

### En el teléfono (Expo Go, Android)

Probado en un teléfono Android real con Expo Go. Están en [`capturas/telefono/`](capturas/telefono).

| Catálogo | Buscador vacío | Buscador con resultado | Detalle |
|---|---|---|---|
| ![](capturas/telefono/01-catalogo.jpg) | ![](capturas/telefono/02-buscador-vacio.jpg) | ![](capturas/telefono/03-buscador-resultado.jpg) | ![](capturas/telefono/04-detalle.jpg) |

| Reserva con ejemplares | Detalle ya reservado | Mis reservas (notificaciones apagadas) | Pantalla previa de la cámara |
|---|---|---|---|
| ![](capturas/telefono/05-reserva-con-ejemplares.jpg) | ![](capturas/telefono/06-detalle-ya-reservado.jpg) | ![](capturas/telefono/07-mis-reservas.jpg) | ![](capturas/telefono/08-permiso-camara-previa.jpg) |

| Escáner: preguntable | Escáner: concedido | Login del personal | Catálogo con sesión iniciada |
|---|---|---|---|
| ![](capturas/telefono/09-escaner-preguntable.jpg) | ![](capturas/telefono/10-escaner-concedido.jpg) | ![](capturas/telefono/11-login.jpg) | ![](capturas/telefono/12-catalogo-con-sesion.jpg) |

| Mostrador |
|---|
| ![](capturas/telefono/13-mostrador.jpg) |

**Faltan:** el escáner en los estados *cargando* y *bloqueado*, y la notificación recibida.
