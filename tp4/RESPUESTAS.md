# Respuestas — TP 4 Biblioteca IPF

**Alumno: Colman Maximo**

Las rutas de archivos son relativas a `tp4/src/`. Lo marcado como *(comprobado)* lo verifiqué corriendo la app con `npx expo start --web`. Lo que depende del sistema del teléfono (diálogos de permisos, botón atrás de Android) está razonado con la documentación de Expo y de Android.

---

## Parte B · Estado, efectos y renderizado

### B1. El ciclo de vida de `useLibros`

**a) Render por render** (`hooks/useLibros.ts`)

Cuando sale todo bien:

| Render | `libros` | `cargando` | `error` | Qué lo provoca |
|---|---|---|---|---|
| 1 | `[]` | `true` | `null` | El montaje del Catálogo. El estado inicial ya arranca en `cargando: true` (línea 12). Después del render corre el efecto (líneas 16-37) y llama a `obtenerLibros()`. |
| 2 | 17 libros | `false` | `null` | A los ~800 ms llega la respuesta y el `.then` hace `setEstado` (línea 21). |

Son **2 renders**. Guardo los tres valores en un solo objeto de estado, así cada cambio es un solo `setEstado` y un solo render. Si fueran tres `useState` separados, React 18+ igual los agrupa (batching), pero con un objeto no puede quedar un estado intermedio raro, como `cargando: false` con `error: null` y la lista vacía.

Cuando falla y se toca "Reintentar":

| Render | `libros` | `cargando` | `error` | Qué lo provoca |
|---|---|---|---|---|
| 1 | `[]` | `true` | `null` | Montaje |
| 2 | `[]` | `false` | `"No pudimos conectarnos…"` | El `.catch` (líneas 23-31). Se ve el mensaje con el botón Reintentar |
| 3 | `[]` | `true` | `null` | `reintentar()` (líneas 39-42) hace dos `setState` en el mismo evento: `cargando: true` y `intento + 1`. React los junta en un render |
| 4 | 17 libros (o el error de nuevo) | `false` | `null` | Como `intento` cambió, corre la limpieza del efecto anterior y después el efecto otra vez, que hace el nuevo pedido |

**b) ¿Se desmonta el Catálogo?**

Para comprobarlo, en lugar de dejar un `console.log` (la entrega no puede tener ninguno), marqué una fila del Catálogo desde las herramientas del navegador y me fijé si seguía siendo el mismo elemento después de cada acción. La limpieza que escribí es el `return () => {...}` de la línea 34.

- **Cambiar a "Mis reservas":** no se desmonta. Las tabs mantienen montadas las pantallas que ya se visitaron, y solo cambia cuál se ve. *(Comprobado: marqué una fila del Catálogo, fui a "Mis reservas" y volví; la fila era el mismo elemento y no volvió a aparecer "Buscando en los estantes…", o sea, no hubo desmontaje ni pedido nuevo. Lo mismo al abrir un detalle y tocar atrás.)*
- **Abrir un detalle:** tampoco. El detalle se apila encima del Catálogo en el Stack de la tab, y el Catálogo queda abajo, montado.

Entonces la limpieza se ejecuta en dos casos reales:

1. Al tocar **Reintentar**: cambia `intento` y la limpieza marca `activo = false` en el pedido viejo.
2. Si la pantalla de verdad se desmonta, por ejemplo al cerrar la app, o si el navegador de tabs se saca de la pila mientras el pedido está en vuelo.

En esos casos evita que una respuesta tardía haga `setEstado` sobre algo que ya no corresponde.

**c) `async` en `useEffect`**

Una función `async` siempre devuelve una Promesa. `useEffect` espera que lo que devuelve el callback sea la función de limpieza o `undefined`. Si le pasás una promesa, React la toma como "limpieza", no puede ejecutarla, y además perdés la forma de cancelar. Por eso dentro del efecto uso `obtenerLibros().then(...).catch(...)` (líneas 19-31) y devuelvo la limpieza normal:

```ts
useEffect(() => {
  let activo = true;
  obtenerLibros()
    .then((libros) => { if (activo) setEstado({ libros, cargando: false, error: null }); })
    .catch(() => { if (activo) setEstado({ ... error: 'No pudimos conectarnos…' }); });
  return () => { activo = false; };
}, [intento]);
```

**d) Cómo funciona `reintentar`**

Hay un contador `intento` (línea 14) que está en el array de dependencias del efecto (línea 37). `reintentar()` lo incrementa, y como el valor cambió, React vuelve a ejecutar el efecto, o sea, se vuelve a pedir el catálogo.

Uso un número y no, por ejemplo, `error`. Si dependiera de `error`, el efecto correría también cuando el error vuelve a `null` después de una carga exitosa, y podría quedar en un bucle. El contador solo cambia cuando la persona pide reintentar, que es exactamente lo que quiero.

### B2. La condición de carrera del buscador

| Momento | Qué pasa | Sin limpieza: qué se ve | Con mi código: qué se ve |
|---|---|---|---|
| t = 0 ms | Escribe "bor" | "Buscando…" | "Buscando…". Con el debounce de 300 ms ni siquiera se manda el pedido todavía |
| t = 200 ms | Escribe "borges" | "Buscando…" (hay dos pedidos en vuelo) | "Buscando…". Se cancela el temporizador de "bor" y arranca uno nuevo para "borges" |
| t = 500 ms | Llega "borges" | Resultados de **borges** | Sigue "Buscando…". El pedido de "borges" sale recién a los 500 ms (200 + 300 de debounce) |
| t = 1.400 ms | Llega "bor" | Resultados de **bor** con "borges" escrito (**incorrecto**) | El pedido de "bor" nunca se hizo. Aunque llegara, se descarta. Se ven solo los resultados de "borges" |

**a) Qué hace la limpieza** (`app/buscar.tsx`, líneas 31-51)

Cada ejecución del efecto tiene su propia variable `vigente` y su propio `temporizador`. Cuando cambia `consulta`, React ejecuta **primero la limpieza del efecto anterior** y después el efecto nuevo. La limpieza hace dos cosas:

- `clearTimeout(temporizador)`: si la persona sigue escribiendo, el pedido viejo ni se manda (debounce).
- `vigente = false`: si el pedido ya salió, cuando vuelva el `.then` ve `vigente === false` y no hace `setRespuesta`.

Además, cada respuesta guarda para qué texto es (`para`), y en la línea 58 `alDia` compara con la consulta actual. Así no se muestra un resultado viejo ni por un instante.

**b) La propuesta `if (texto === q)`**

No funciona. El `.then` es una clausura creada en el render en que se armó el efecto, y "ve" el `q` **de ese render**, no el actual. `texto` y `q` salieron del mismo render, así que siempre son iguales y la condición siempre da `true`. La respuesta vieja de "bor" igual pisa a "borges". Para que funcione habría que leer el valor actual desde algo que no quede congelado en la clausura (un `useRef`) o usar la limpieza, como hice yo.

**c) URL y botón atrás**

Con `router.setParams({ q: texto })` (línea 73) la URL cambia a `/buscar?q=b`, `/buscar?q=bo`… pero **se reemplazan los parámetros de la misma pantalla**, sin agregar entradas a la pila. "Atrás" vuelve directo a donde estaba antes del buscador. Con `router.push` se apilaría una pantalla `/buscar` por cada letra, y para salir habría que tocar atrás una vez por letra.

### B3. Mutar o reemplazar

**a)** Muestra **"Personas en espera: 0"**. `encolar` modifica la cola por dentro (`#items.push`), pero la referencia que guarda `useState` es la misma. Nadie llamó a un `setState`, así que React no tiene motivo para volver a renderizar y el texto queda con el valor viejo.

**b)** Al escribir en el `TextInput` controlado se hace un `setState`, y eso sí provoca un render. En ese render `espera.tamanio` se lee de nuevo y ya vale 3, así que el número "salta". Un error que aparece "a veces" es peor porque depende de que otra cosa provoque un render. Cuesta reproducirlo, parece que "se arregla solo", y puede pasar en producción sin que lo veas en las pruebas.

**c) Cómo lo resolví** (`context/BibliotecaContext.tsx`)

Nunca muto la Pila ni la Cola que están en el estado. Hago una copia con `clonar()` (lo agregué a las dos clases), cambio la copia y la guardo con el setter:

```ts
// línea 125-127
const cola = esperas[libro.isbn]?.clonar() ?? new Cola<string>();
cola.encolar(USUARIO_APP);
setEsperas((anteriores) => ({ ...anteriores, [libro.isbn]: cola }));
```

Lo mismo en `verLibro` (líneas 84-92) y en `entregarSiguiente` (líneas 162-164).

| Alternativa | Ventaja | Costo |
|---|---|---|
| **Copia nueva (lo que usé)** | React ve una referencia nueva y renderiza siempre. Encaja con el React Compiler y con `Object.is` | Copiar la cola en cada cambio (O(n)). Con listas de 2 o 3 personas no importa |
| **Contador de versión** (lo que hice en el TP 2: `useRef` + `refrescar()` con `setVersion`) | No copia nada | Hay que acordarse de llamar `refrescar()` después de cada mutación. Si te olvidás, vuelve el bug de "a veces". Y leer `ref.current` durante el render rompe las reglas del React Compiler |
| **`useReducer`** | Todos los cambios pasan por un solo lugar y es fácil de testear | Más código. Igual tenés que devolver un estado nuevo, o sea, también copiar |

### B4. ¿Dónde vive cada dato?

| Dato | Dónde vive | Por qué ahí |
|---|---|---|
| Texto del buscador | **URL** (`?q=`) | Así se puede compartir o abrir por deep link (`bibliotecaipf://buscar?q=borges`) y no se pierde al volver. No hace falta un `useState` aparte |
| Préstamos y reservas | **Context** (`prestamos`, línea 69) | Lo usan Detalle, Reservar, Mis reservas y Mostrador, que están en pantallas y navegadores distintos |
| Listas de espera | **Context** (`esperas`, línea 68, una `Cola` por ISBN) | Las modifica el alumno al reservar y el personal en el mostrador. Tienen que ver lo mismo |
| Vistos recientemente | **Context** (Pila de ISBN, línea 67) | Se agregan en el Detalle y se muestran en el Catálogo |
| Sesión del personal | **Context** (`sesion`) | La necesita el layout raíz para los `Stack.Protected` y el link "Personal" del header |
| Ejemplares disponibles | **Se calcula** (`disponibles()`, líneas 95-98) | Es `ejemplares - préstamos del estante`. Si lo guardara aparte, podría desincronizarse con los préstamos |
| Estado del permiso de cámara | **Sistema operativo**, leído con `useCameraPermissions` dentro de `usePermiso` | El dueño del dato es el sistema: la persona lo puede cambiar en Ajustes sin pasar por la app. Guardarlo sería tener una copia vieja |
| ID de la notificación programada | **Context**, dentro de cada `Prestamo` (`notificacionId`) | Se necesita para cancelarla al devolver o al apagar el interruptor, y va pegado al préstamo |

**¿Qué se re-renderiza cuando cambia el `value`?** Todos los componentes que llaman a `useBiblioteca()`: el Catálogo (a través de `VistosRecientes` y `LinkPersonal`), Mis reservas, el Detalle, etc. Si el Catálogo solo usa `recientes`, igual se re-renderiza al activar un recordatorio en otra pestaña, porque cambia `prestamos` y con eso cambia el objeto `value`.

Para evitarlo se podría dividir en varios contextos (uno para sesión, otro para recientes, otro para préstamos) o usar una librería con selectores. En una app de este tamaño **no vale la pena**: son pocas pantallas, listas cortas, y el React Compiler (activado en `app.json`) ya evita trabajo en los hijos que no cambian.

---

## Parte C · Navegación y rutas

### C1. La pila en mi app

| # | Acción | Pilas resultantes (base → tope) |
|---|---|---|
| 1 | Abre la app | Stack raíz: `[(tabs)]` · Stack Catálogo: `[index]` |
| 2 | Toca un libro | Raíz: `[(tabs)]` · Catálogo: `[index, libro/X]` |
| 3 | Toca "Reservar" | Raíz: `[(tabs), reservar/X (modal)]` · Catálogo: `[index, libro/X]` |
| 4 | Toca "Confirmar" | Raíz: `[(tabs)]` con la tab "Mis reservas" activa · Catálogo: `[index, libro/X]` |
| 5 | Atrás (Android) | Raíz: `[(tabs)]`, vuelve a la tab Catálogo · Catálogo: `[index]`. *(Comprobado en web: atrás llevó a `/`, el listado del Catálogo; no volvió ni a la confirmación ni al modal.)* |
| 6 | Toca la tab "Catálogo" | Raíz: `[(tabs)]` · Catálogo: `[index]`. Se queda en el listado. *(Comprobado)* |

**a)** En el paso 4 uso `router.dismissTo('/reservas')` (`app/reservar/[isbn].tsx`, línea 47). `dismissTo` va cerrando pantallas del Stack raíz hasta llegar a la ruta que contiene `/reservas`, que son las tabs, y ahí activa "Mis reservas".

- **`push`:** abre "Mis reservas" **encima** del modal. Atrás volvería a la confirmación y se podría confirmar dos veces.
- **`replace`:** cambia el modal por la ruta nueva, así que la confirmación no queda. Pero en el Stack raíz puede quedar una segunda copia de `(tabs)` encima de la primera.
- **`dismissTo`:** cierra el modal y reutiliza las tabs que ya estaban. Por eso lo elegí.

**b)** En mi prueba la persona ve **el Catálogo (el listado)**, no el detalle. Cada tab tiene su propio Stack y, si solo se cambia de pestaña, el detalle se conserva arriba. Pero en este recorrido el atrás saca el detalle, y además tocar la tab que ya está activa hace "pop to top" y vuelve al inicio de su Stack.

Me parece el comportamiento correcto para esta app: después de reservar, lo más probable es que la persona quiera seguir buscando libros, no volver a la ficha del que ya reservó (que además ahora dice "Ya lo reservaste"). Si quisiera volver a verlo, lo tiene en "Vistos recientemente".

### C2. El escáner que dispara de más

**a)** `onBarcodeScanned` se llama muchas veces por segundo mientras el código está frente a la cámara. Sin protección, cada llamada haría un `router.push`, y las acciones de navegación se encolan y se procesan una tras otra, como la cola de acciones del TP 2. Quedarían 5, 10 o más detalles iguales apilados, y habría que tocar atrás muchas veces.

**b)** Usé **`useRef`** (`app/(tabs)/(catalogo)/escanear.tsx`, línea 25: `yaNavego`). Un `useState` puesto en `true` no alcanza: `setState` no cambia la variable al instante, sino que programa un render nuevo. Las llamadas a `onBarcodeScanned` que llegan antes de ese render siguen viendo `false` en su clausura y vuelven a navegar. El `ref.current = true` (línea 36) cambia en el momento, así que la línea 42 corta todas las llamadas siguientes.

**c)** Con `replace` (línea 38) el escáner **se reemplaza** por el detalle: atrás vuelve al Catálogo. Con `push`, atrás volvería a la cámara, que seguiría apuntando al mismo código y te mandaría al detalle otra vez.

**d)** Si el ISBN no está, la app muestra un aviso ("Leímos 978…, pero ese libro no está en la biblioteca") y la cámara sigue activa para probar con otro. Para que el aviso no salga diez veces, guardo el último código desconocido en otro `useRef` (`ultimoDesconocido`, líneas 26, 44 y 49). Si llega el mismo código, se ignora.

### C3. Deep links y rutas protegidas

En Expo Go: `exp://IP:8081/--/libro/9789505472697`, etc.

| Link | Qué ve la persona | Qué queda debajo | Qué parte del código lo decide |
|---|---|---|---|
| `libro/9789505472697` | Detalle de *El Hobbit* | El Catálogo (en el Stack de la tab) | `unstable_settings = { anchor: 'index' }` en `app/(tabs)/(catalogo)/_layout.tsx` (línea 6) |
| `libro/123` | "Ese ISBN no es válido" con botón al Catálogo | El Catálogo | La validación `esIsbnValido` en `app/(tabs)/(catalogo)/libro/[isbn].tsx` (línea 17) |
| `buscar?q=borges` | Buscador con "borges" y sus resultados (o "No encontramos nada") | Las tabs | `unstable_settings = { anchor: '(tabs)' }` en `app/_layout.tsx` (línea 9) |
| `mostrador` (sin sesión) | El Catálogo: sin sesión la ruta no existe y el router cae en el anchor *(comprobado)* | Nada: el Catálogo es la base | `Stack.Protected guard={conSesion}` en `components/NavegacionRaiz.tsx` (línea 29) y `anchor: '(tabs)'` en `app/_layout.tsx` |
| `reserva` | Mis reservas | Las tabs | `<Redirect href="/reservas" />` en `app/reserva.tsx` |
| `escanear` (cámara bloqueada) | Escáner con el aviso "La cámara está bloqueada", el botón Abrir Ajustes y el ingreso manual | El Catálogo | `usePermiso('camara')` y el bloque `estado === 'bloqueado'` en `escanear.tsx` (línea 82) |

**¿Por qué `/libro/123` llega al detalle?** Porque `[isbn]` es un segmento dinámico: el router acepta **cualquier** texto en esa posición, no sabe qué ISBN existen. La responsabilidad de responder bien es de **la pantalla**, que valida el formato y que el libro exista (líneas 17-18) y muestra un mensaje con salida.

### C4. Foco, montaje y primer plano

**a)**
- `useEffect` con `[]`: se ejecuta **al montar** el componente, una sola vez.
- `useFocusEffect`: se ejecuta cada vez que la pantalla **gana el foco** dentro de la navegación (volver a la tab, cerrar un modal que estaba encima).
- `AppState`: detecta cuando **la app entera** pasa entre primer plano y segundo plano (`active` / `background`).

**b)**
- Vuelve de Ajustes: se entera **AppState**. La pantalla no cambió de foco ni se montó de nuevo, fue la app la que volvió.
- Va a Catálogo y vuelve a Mis reservas: se entera **`useFocusEffect`**. La app nunca salió de primer plano, y el `useEffect` con `[]` no corre porque la pantalla sigue montada.

**c)** Uso **las dos**:
- `useFocusEffect` en `app/(tabs)/reservas.tsx` (línea 20), que también cubre volver del modal de permisos.
- `AppState` a través de `useRevisarAlVolver` (el hook del TP 3), que `usePermiso` usa en la línea 55 de `hooks/usePermiso.ts`.

Si usara solo `useEffect` con `[]`, la pestaña mostraría "Notificaciones apagadas" aunque la persona las haya activado en Ajustes, hasta cerrar y abrir la app.

---

## Parte D · Permisos en mi app

### D1. Recorrido completo de la cámara (Android 14)

| # | Acción | Qué muestra mi app | `status` | `canAskAgain` |
|---|---|---|---|---|
| 1 | Toca "Escanear" por primera vez | Escáner con la tarjeta "Para leer el código de barras necesitamos usar la cámara", el botón **Usar la cámara** y el ingreso manual. Al tocar el botón se abre `/permisos/camara` con el beneficio y **Continuar** | `undetermined` | `true` |
| 2 | Continuar → No permitir | Se cierra el modal y vuelve la misma tarjeta (preguntable) | `denied` | `true` |
| 3 | Toca "Escanear" otra vez | Igual que el paso 1: tarjeta y "Usar la cámara" | `denied` | `true` |
| 4 | Continuar → No permitir | La tarjeta cambia a "La cámara está bloqueada…" con **Abrir Ajustes** | `denied` | `false` |
| 5 | Toca "Escanear" otra vez | Bloqueado: Abrir Ajustes + ingreso manual | `denied` | `false` |
| 6 | Abrir Ajustes → habilita → vuelve | Aparece la cámara | `granted` | `true` |

La clave está en el paso 4: desde Android 11, si la persona niega el mismo permiso dos veces, el sistema lo deja como "no volver a preguntar". Por eso ahí `canAskAgain` pasa a `false` y mi app muestra "Abrir Ajustes" en lugar de "Continuar".

**a) iOS:** cambia en el **paso 2**. En iOS el diálogo del sistema aparece **una sola vez**. Al tocar "No permitir" queda `denied` con `canAskAgain: false`, así que en el paso 3 mi app ya muestra la tarjeta de bloqueado con "Abrir Ajustes". Los pasos 3 y 4 de Android no existen.

**b) La línea que decide** (`lib/permisos.ts`, líneas 29-33):

```ts
if (respuesta.granted) return 'concedido';
if (respuesta.canAskAgain) return 'preguntable';
return 'bloqueado';
```

Y en `components/PreguntaPermiso.tsx` el botón es "Continuar" si el estado es `preguntable` (línea 43) y "Abrir Ajustes" si es `bloqueado` (línea 45).

Usa `canAskAgain`, porque `status` solo no alcanza: en los pasos 2 y 4 `status` vale `denied` las dos veces, pero en el 2 todavía se puede preguntar y en el 4 no. Si solo mirara `status`, en el paso 4 mostraría "Continuar" y el botón no haría nada, porque el sistema ya no muestra el diálogo.

**c)** Se entera `useRevisarAlVolver` (`hooks/useRevisarAlVolver.ts`), que `usePermiso` llama en la línea 55 con `consultar`. Escucha `AppState` y cuando la app pasa de `background` a `active` vuelve a consultar el permiso. Además, el escáner tiene un `useFocusEffect` (línea 29) que consulta al recuperar el foco. Sin eso, la app seguiría mostrando "La cámara está bloqueada" aunque ya esté habilitada, hasta salir y volver a entrar a la pantalla.

### D2. Notificaciones y consistencia

**a)** Si no la cancelara, a los 15 segundos llegaría "Acordate de devolver tu libro" de un libro que **ya devolví**. Eso confunde y hace que la persona deje de confiar en las notificaciones. Por eso `devolver` (`context/BibliotecaContext.tsx`, líneas 131-137) llama a `cancelarRecordatorio` con el ID antes de sacar el préstamo.

**b)** El ID se guarda en el **Context**, dentro del préstamo (`notificacionId`). Si la app se cierra antes de que llegue:

- **La notificación** sigue programada en el sistema operativo y llega igual.
- **El identificador** se pierde, porque estaba en memoria. Y como no hay persistencia, también se pierde el préstamo.

El problema es que la persona recibe un recordatorio de un préstamo que la app ya no muestra, y no hay forma de cancelarlo desde la app. Lo resolvería guardando préstamos e IDs con `AsyncStorage` (el desafío de persistencia). Al iniciar, compararía con `Notifications.getAllScheduledNotificationsAsync()` y cancelaría las que no correspondan a ningún préstamo.

**c)** En Android 13 o superior las notificaciones necesitan el permiso `POST_NOTIFICATIONS` en tiempo de ejecución, y el sistema asocia el diálogo a que la app tenga al menos un canal creado. Si se pide sin canal, puede que el diálogo no aparezca. Por eso `usePermiso` llama a `crearCanalPrestamos()` antes de `requestPermissionsAsync` (`hooks/usePermiso.ts`, línea 48).

En **Android 12** no existe el permiso en tiempo de ejecución: las notificaciones vienen habilitadas, `requestPermissionsAsync` devuelve `granted` sin mostrar diálogo, y el canal se sigue necesitando (desde Android 8) para mostrarlas.

**d)** Si el permiso está denegado, me entero con un **aviso dentro de la app**, en la parte de arriba de "Mis reservas", con el texto "¡Te tocó …! Ya lo tenés en préstamo" y un botón "Entendido". El código que decide está en `context/BibliotecaContext.tsx`, líneas 175-185:

```ts
// Se consulta el permiso ahora: pudo haber cambiado desde Ajustes
if (await notificacionesPermitidas()) {
  await avisarEntrega(libro.titulo);
} else {
  setAvisos((lista) => [...lista, { id: ..., texto: `¡Te tocó "${libro.titulo}"! ...` }]);
}
```

**Consulta el permiso en ese momento** (`lib/notificaciones.ts`, líneas 27-30, `getPermissionsAsync()`), no usa un valor guardado. Importa porque la persona puede haber cambiado el permiso en Ajustes. Con un valor viejo podría mandar una notificación que no se muestra, y la persona no se enteraría de nada, o mostrar un aviso cuando en realidad sí había permiso.

### D3. Lo que mi app pide y lo que no

| Plataforma | Permiso o clave | Función que lo justifica | ¿Quién lo agrega? |
|---|---|---|---|
| Android | `android.permission.CAMERA` | Escanear el código de barras | El plugin de `expo-camera` |
| Android | `android.permission.POST_NOTIFICATIONS` | Recordatorio de devolución y aviso de entrega | `expo-notifications` |
| Android | `android.permission.RECEIVE_BOOT_COMPLETED` | Que las notificaciones programadas sobrevivan a un reinicio del teléfono (sin diálogo) | `expo-notifications` |
| Android | `android.permission.VIBRATE` | Vibrar al llegar la notificación (sin diálogo) | Expo (lo agrega el proyecto base) |
| Android | `android.permission.INTERNET` | Cargar las portadas desde Open Library y conectarse con Metro en desarrollo (sin diálogo) | Expo (proyecto base) |
| iOS | `NSCameraUsageDescription` ("Usamos tu cámara para leer el código de barras…") | Escanear | El plugin de `expo-camera`, con el texto de `cameraPermission` |
| iOS | Notificaciones (no lleva clave en Info.plist, se pide en tiempo de ejecución) | Recordatorios | `expo-notifications` |

Lo comprobé generando el proyecto nativo con `npx expo prebuild -p android` (después lo borré). En `android/app/src/main/AndroidManifest.xml` quedan `CAMERA`, `INTERNET` y `VIBRATE`, y los 10 permisos de `blockedPermissions` aparecen con `tools:node="remove"`, o sea que se eliminan al compilar. `POST_NOTIFICATIONS` y `RECEIVE_BOOT_COMPLETED` vienen en el manifiesto de la librería `expo-notifications` y se suman al compilar.

**a)** `expo-camera` por defecto agrega `RECORD_AUDIO` porque también puede grabar video con sonido. Mi app solo lee códigos, así que lo saco:

```json
["expo-camera", {
  "cameraPermission": "Usamos tu cámara para leer el código de barras de la contratapa y abrir el libro sin escribir el ISBN.",
  "microphonePermission": false,
  "recordAudioAndroid": false
}]
```

Además está en `android.blockedPermissions` (`"android.permission.RECORD_AUDIO"`), por si otra librería lo agrega.

**b)** Usaría `expo-image-picker` con `launchImageLibraryAsync`. En Android 13+ y en iOS 14+ abre el **selector de fotos del sistema**, que no necesita permiso: la persona elige una foto y la app solo recibe esa. Habría que sacar `READ_MEDIA_IMAGES` de mi lista solo si quisiera leer toda la galería, que no es el caso.

**No alcanza con OTA:** `expo-image-picker` tiene código nativo, y una actualización OTA solo cambia el JavaScript. El binario instalado no tiene ese módulo, así que hace falta **una build nueva**. En Expo Go funcionaría porque ya lo trae incluido, pero eso no pasa en la app real.

**c)** En Expo Go no pude verificar del todo:

- **El texto de propósito:** el diálogo muestra el texto de Expo Go, no el mío, porque Expo Go es otra app con su propio Info.plist y manifiesto.
- **`blockedPermissions`, `microphonePermission` y `recordAudioAndroid`:** se aplican al generar el binario, y Expo Go ya está compilado.
- **Los permisos en Ajustes:** aparecen bajo "Expo Go", no bajo "Biblioteca IPF".

El canal `prestamos` sí se crea en tiempo de ejecución, pero dentro de Expo Go: aparece en Ajustes > Apps > Expo Go > Notificaciones, mezclado con los canales de Expo Go, y no en una app "Biblioteca IPF".

Para verificarlo haría una **development build** (`npx expo run:android` o `eas build --profile development`) y revisaría el diálogo, el manifiesto generado y los permisos de la app instalada.

---

## Parte E · Buenas prácticas y decisiones de diseño

### E1. Revisión de código

**a) Problemas**

| # | Línea | Tipo | Problema y por qué pasa | Cómo lo corrijo |
|---|---|---|---|---|
| 1 | 18-20 | Rendimiento / error | `useEffect` sin array de dependencias: corre después de **cada** render. `setLibros` provoca un render, que vuelve a pedir, y así en un bucle infinito de pedidos | Array de dependencias (`[intento]` en mi `useLibros`) |
| 2 | 19 | Error de ejecución | No hay `.catch`. Cuando `obtenerLibros()` falla (1 de cada 5 veces) queda una promesa rechazada sin manejar y la persona no ve nada | `.catch` con estado de error y botón Reintentar |
| 3 | 19 | Advertencia | Sin limpieza: si la pantalla se desmonta antes de la respuesta, se hace `setLibros` igual | Flag `activo` en la limpieza |
| 4 | 13-16 | Mala práctica | Pide cámara y notificaciones **al abrir el Catálogo**, sin contexto y antes de que la persona quiera escanear. Lo más probable es que lo niegue | Pedir cada permiso al usar la función, con pantalla previa (`/permisos/[recurso]`) |
| 5 | 14-15 | Advertencia | Las promesas de los permisos no se esperan ni se manejan, y `pedirPermiso` falta en el array (`react-hooks/exhaustive-deps`). En Android 13+ además no se crea el canal antes de pedir | Hook `usePermiso` y canal antes del pedido |
| 6 | 10 y 22 | Mala práctica | `any[]` y `libro: any`: se pierde el tipado (si escribís `libro.titlo` no avisa) | `Libro[]` y props tipadas |
| 7 | 22-30 | Rendimiento | `Fila` está declarado **dentro** de `Catalogo`: en cada render es un componente nuevo, así que React desmonta y vuelve a montar todas las filas | Declararlo a nivel de módulo, en su propio archivo (`components/FilaLibro.tsx`) |
| 8 | 33-36 | Rendimiento | `ScrollView` + `map` renderiza todos los libros juntos, sin virtualización | `FlatList` |
| 9 | 35 | Advertencia / mala práctica | `key={i}`: el índice no es estable. Si cambia el orden, React confunde las filas | `keyExtractor={(l) => l.isbn}` |
| 10 | 24 | Mala práctica | `'/libro/' + libro.isbn` arma la ruta a mano, y si cambia la ruta no hay error de tipos | `router.push({ pathname: '/libro/[isbn]', params: { isbn } })` con rutas tipadas |
| 11 | 25 | Mala práctica | Estilos en línea con colores sueltos (`'#333'`, sobre fondo oscuro ni se lee) | `StyleSheet.create` y colores de `tema.ts` |
| 12 | 37-39 | Accesibilidad | Botón que solo tiene un ícono, sin `accessibilityRole` ni `accessibilityLabel`. El lector de pantalla dice "botón" sin decir qué hace | `accessibilityRole="button"`, `accessibilityLabel="Escanear código"` y área de 44×44 |
| 13 | — | Mala práctica | No hay estados de carga, error ni vacío: mientras carga se ve una pantalla en blanco | `EstadoCargando`, `EstadoMensaje` y `ListEmptyComponent` |
| 14 | 11 | Advertencia | `permiso` se declara y no se usa (lint `no-unused-vars`) | Sacarlo |

**b) Primer minuto con el efecto sin dependencias**

1. Render 1 con `libros = []`. Corre el efecto y pide los libros.
2. A los 800 ms llega un array **nuevo** (copias). `setLibros` lo guarda y, como es otra referencia, React re-renderiza.
3. Después de ese render corre el efecto de nuevo: otro pedido. Así cada ~800 ms. En un minuto son unos **75 pedidos**, de los cuales ~15 fallan y dejan errores sin manejar. Gasta batería y datos.

Si `obtenerLibros()` devolviera **siempre el mismo array**, en el segundo pedido `setLibros` recibiría la misma referencia. React compara con `Object.is`, ve que no cambió y no re-renderiza, así que no hay más efectos y el bucle se corta. El bug sigue ahí, pero escondido: aparecería en cuanto la API devuelva objetos nuevos, que es lo normal en una API real.

**c) Reescrita con mi app** (es mi `app/(tabs)/(catalogo)/index.tsx`)

```tsx
export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();

  if (cargando) return <EstadoCargando mensaje="Buscando en los estantes…" />;

  if (error) {
    return (
      <EstadoMensaje icono="cloud-offline-outline" tono="error" titulo="No cargó el catálogo" detalle={error}>
        <Boton texto="Reintentar" onPress={reintentar} />
      </EstadoMensaje>
    );
  }

  return (
    <FlatList
      data={items} // useCatalogoInfinito: los libros + tandas mezcladas al llegar al final
      keyExtractor={(item) => item.clave} // ISBN + número de tanda, nunca el índice
      renderItem={({ item }) => <FilaLibro libro={item.libro} />}
      onEndReached={cargarMas}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={EncabezadoCatalogo} // recientes + Buscar y Escanear (con accessibilityRole)
      ListEmptyComponent={<EstadoMensaje icono="book-outline" titulo="Los estantes están vacíos" ... />}
      contentContainerStyle={estilos.lista}
    />
  );
}
```

Los permisos ya no se piden acá: la cámara se pide en `/escanear` y las notificaciones al activar "Recordarme".

**d)**
- **Rechazo en la tienda:** pedir cámara y notificaciones al abrir la app, sin relación con lo que la persona está haciendo. Las guías de Apple (5.1.1) piden solicitar los datos cuando hacen falta y con un propósito claro. Pedir la cámara en una pantalla que no la usa es motivo de rechazo.
- **Desinstalación:** también los dos diálogos de permisos apenas abre la app. Es lo primero que ve la persona y da desconfianza ("¿para qué quiere mi cámara una biblioteca?"). El bucle de pedidos se notaría después, con la batería y los datos.

### E2. Organización y acoplamiento

**a) Quién importa a quién**

```
app ─────────► components, hooks, context, lib, constants, types
components ──► components, context, hooks, lib, constants, types
context ─────► estructuras, data, lib, constants, types
hooks ───────► lib, hooks, types
lib ─────────► data, constants, types
data ────────► types
estructuras ─► (nada)
constants ───► constants
types ───────► (nada)
```

No hay importaciones "hacia arriba": nada fuera de `app/` importa algo de `app/`. Sería un problema porque `app/` son rutas. Si un hook importara una pantalla, se mezclaría navegación con lógica, se podrían armar dependencias circulares y, al mover o renombrar una ruta (que cambia la URL), se romperían archivos que no tienen nada que ver.

**b) API real:** cambiarían

- `lib/api.ts` (el `fetch` real),
- `lib/catalogo.ts` (`buscarLibroPorIsbn` lee `LIBROS` directo),
- `context/BibliotecaContext.tsx` (`misEsperas` y `listasMostrador` recorren `LIBROS`),
- y probablemente el Detalle y Reservar, que hoy buscan el libro de forma sincrónica y pasarían a esperar un pedido.

Son más de dos archivos. Eso dice que **hay acoplamiento con los datos locales**: algunas partes leen `data/libros.ts` directamente en vez de pasar siempre por `lib/api.ts`. Para mejorarlo, todo acceso al catálogo tendría que ir por un solo módulo (por ejemplo, un `useLibro(isbn)` que use la API).

**c) `<ConPermiso recurso="camara">`**

- **Gano:** menos código repetido en la pantalla. El envoltorio decide qué mostrar en cada estado (cargando, preguntar, bloqueado) y solo renderiza los hijos cuando hay permiso.
- **Pierdo:** flexibilidad. En mi escáner el ingreso manual **siempre** está visible, aunque no haya permiso. Con un envoltorio que tapa todo, eso se complica. También es más difícil mostrar la pantalla previa como modal aparte.
- **Para notificaciones no sirve:** no hay una pantalla que "envolver". El permiso se pide desde un `Switch` en medio de la lista de préstamos, y la decisión se toma en un evento (`cambiarRecordatorio`), no al renderizar. Ahí conviene un hook como `usePermiso`, que da el estado y la función `pedir` para usarlos donde haga falta.

### E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja |
|---|---|---|
| `obtenerLibros()` falla | "No cargó el catálogo" + el mensaje + botón **Reintentar** | `hooks/useLibros.ts` 23-31 · `app/(tabs)/(catalogo)/index.tsx` (bloque `if (error)`) |
| Se abre `/libro/abc` | "Ese ISBN no es válido" con la explicación y **Ir al Catálogo** | `app/(tabs)/(catalogo)/libro/[isbn].tsx` 17-41 |
| Se escanea un ISBN que no está | "Leímos …, pero ese libro no está en la biblioteca". Se sigue escaneando, y el aviso sale una sola vez por código | `app/(tabs)/(catalogo)/escanear.tsx` 41-52 |
| La cámara está bloqueada | "La cámara está bloqueada…" + **Abrir Ajustes** + ingreso manual del ISBN | `escanear.tsx` 82-88 · `components/PreguntaPermiso.tsx` 45-53 |
| Las notificaciones están denegadas | En Mis reservas: "Notificaciones apagadas: los avisos te aparecen acá". Las entregas llegan como aviso dentro de la app | `components/EncabezadoReservas.tsx` · `context/BibliotecaContext.tsx` 175-185 |
| Reservar un libro ya reservado | El botón del detalle dice "Ya lo reservaste" (deshabilitado). Si se llega al modal por URL: "Ya lo tenés reservado" | `context/BibliotecaContext.tsx` 113-114 · `app/reservar/[isbn].tsx` 26-35 |
| "Entregar al siguiente" con la lista vacía | El libro no aparece en el mostrador. Si no hay ninguna lista: "Nadie está esperando". La función igual se protege | `context/BibliotecaContext.tsx` 159-160 · `app/mostrador.tsx` (`ListEmptyComponent`) |
| Login con clave incorrecta | "El usuario o la clave no coinciden. Revisalos y probá otra vez." | `app/login.tsx` (función `enviar`) |

### E4. Decisiones con argumentos

**a) Identificador: ISBN.**

Lo uso como parámetro de ruta y como `key`:

- Es un dato **real** que está impreso en el libro, así el escáner lleva directo al detalle sin tablas de traducción.
- Es único por edición: dos ediciones del mismo título tienen ISBN distintos, y eso está bien porque son ejemplares distintos.
- `useLocalSearchParams` devuelve **strings**. El ISBN ya es un string, mientras que con un id numérico habría que hacer `Number(id)` y validar `NaN`, como en el ejercicio E1 del TP 2. Además, si guardara el ISBN como número perdería los ceros a la izquierda.
- **El caso del scroll infinito:** el Catálogo repite los libros en tandas mezcladas (`hooks/useCatalogoInfinito.ts`), así que el mismo ISBN aparece varias veces y no puede ser la `key` solo. Uso `` `${isbn}-${tanda}` ``: sigue saliendo del ISBN y es estable, porque una tanda ya agregada no cambia de lugar. El índice de la fila no sirve porque no identifica al libro.
- **La contra:** un libro sin ISBN (un apunte, un libro muy viejo) no tendría identificador. En ese caso usaría un código interno de la biblioteca con el mismo formato de 13 dígitos (un prefijo que no exista, como hacen los supermercados con sus códigos internos).

**b) Estructuras: clase `Pila` con `#items`.**

- **Lo que me dio:** encapsulamiento. Desde afuera solo se puede `push`/`pop`/`tope`, nadie puede hacer `items.splice` en el medio, y la Cola mantiene su índice `#inicio` sin que nadie lo toque.
- **Lo que me complicó:** React detecta cambios por referencia, y la clase está hecha para mutar. Tuve que agregar `clonar()` y acordarme de clonar antes de cada cambio (`BibliotecaContext.tsx` 84-92, 125-127). Con un array en el estado (`[...pila, x]`) eso sale natural. En el TP 2 lo resolví con un contador de versión, que es más frágil.

**c) Memorización.**

El proyecto tiene activado el **React Compiler** (`"reactCompiler": true` en `app.json`), que memoriza automáticamente valores y funciones en componentes y hooks. Por eso **no** puse `useMemo` en el `value` del Context.

- **Donde sí aportan:** usé `useCallback` en `consultar` y `pedir` de `hooks/usePermiso.ts`. `consultar` va como dependencia de `useRevisarAlVolver` y de `useFocusEffect`, y si cambiara en cada render, el listener de `AppState` se daría de baja y de alta todo el tiempo.
- **Donde serían ruido:** un `useCallback` en el `onPress` de `Boton` o un `useMemo` sobre `libro.ejemplares - delEstante`: son operaciones baratísimas y el componente igual se re-renderiza.
- **Cómo comprobarlo:** con el **Profiler de React DevTools** (Expo dev tools, tecla `j`) y la opción "Highlight updates", comparando cuántos componentes se renderizan al activar un recordatorio con y sin la memorización.

**d) Datos duplicados: los ejemplares disponibles se calculan.**

`disponibles()` en `BibliotecaContext.tsx` (líneas 95-98) hace `libro.ejemplares - préstamos del estante`. Si los guardara en el estado, habría que acordarse de actualizarlos en cada préstamo y en cada devolución. Si una de las dos actualizaciones falla (por ejemplo, devolver resta el préstamo pero no suma el ejemplar), los dos datos se contradicen: el detalle diría "0 disponibles" aunque nadie tenga el libro. Calculándolo, hay **una sola fuente de verdad** (la lista de préstamos) y no puede quedar inconsistente.
