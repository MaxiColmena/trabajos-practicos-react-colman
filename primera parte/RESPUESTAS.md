# Respuestas - Trabajo Práctico N° 2

## Parte A · Estructuras de datos: la pila y la cola

### A1. Conceptos
a) **LIFO**: Last In First Out (el último en entrar es el primero en salir). Corresponde a la **Pila**. 
**FIFO**: First In First Out (el primero en entrar es el primero en salir). Corresponde a la **Cola**.
b) **Pila**: entra por el tope y sale por el tope. **Cola**: entra por el final y sale por el frente.
c) **Pila**: Vida real: una pila de platos para lavar (se saca el de arriba). App móvil: el historial de navegación (pantallas apiladas). 
**Cola**: Vida real: fila para pagar en el supermercado. App móvil: cola de reproducción en Spotify o cola de descargas.

### A2. Seguimiento de una pila
1) `console.log(p.tope());` imprime **'Perfil'**
2) `console.log(p.pop());` imprime **'Perfil'** (lo saca de la pila)
3) `console.log(p.tope());` imprime **'Productos'**
4) `console.log(p.vacia);` imprime **false**

*Estado final (base a tope):* `['Inicio', 'Productos']`

### A3. Seguimiento de una cola
1) `console.log(c.frente());` imprime **'Beto'**
2) `console.log(c.desencolar());` imprime **'Beto'**
3) `console.log(c.vacia);` imprime **false**

*Estado final (frente a final):* `['Caro', 'Dani']`

### A4. Análisis de la implementación
a) El `#` indica que es un campo **privado**. Evita que código externo modifique el array de items de forma directa sin pasar por los métodos de la clase, protegiendo la integridad de la estructura de datos.
b) El método `shift()` de un array en JavaScript debe mover/reindexar todos los elementos restantes una posición hacia atrás, lo cual tiene un costo de rendimiento O(n). En colas grandes esto es lento. Las colas "serias" resuelven esto guardando el índice del frente y avanzando dicho índice (costo O(1)) en lugar de reindexar todo.
c) La pila usa `pop()` (saca del final del array) y la cola usa `shift()` (saca del principio). No pueden usar el mismo porque tienen distintos criterios de orden de salida (LIFO vs FIFO).

### A5. Programación: una cola eficiente
*(La implementación se encuentra en `src/estructuras/Cola.ts` del proyecto).*

### A6. Pila y cola dentro de Expo Router
a) El historial de un Stack usa una **Pila**. La pantalla visible es la del tope de la pila. La operación "atrás" realiza un **pop** en la pila.
b) Expo Router usa una **Cola** para las acciones de navegación en curso. Si el usuario toca dos links muy rápido, estas acciones se encolan y se procesan en orden para evitar condiciones de carrera o inconsistencias en la navegación.

---

## Parte B · Rutas basadas en archivos

### B1. Del archivo a la URL
| Archivo | URL que genera / función |
|---------|--------------------------|
| `src/app/(tabs)/index.tsx` | `/` (estando dentro del grupo tabs) |
| `src/app/acerca.tsx` | `/acerca` |
| `src/app/(tabs)/perfil.tsx` | `/perfil` (dentro del grupo tabs) |
| `src/app/(tabs)/productos/index.tsx` | `/productos` (dentro del grupo tabs) |
| `src/app/(tabs)/productos/[id].tsx` | `/productos/[id]` (ruta dinámica, ej. `/productos/1`) |
| `src/app/docs/[...slug].tsx` | `/docs/...` (catch-all para cualquier ruta bajo /docs) |
| `src/app/_layout.tsx` | **No genera URL.** Define el contenedor/navegador (layout) para las rutas de esa carpeta. |
| `src/app/+not-found.tsx` | **No genera URL propia.** Captura todas las rutas inexistentes (Error 404). |
| `src/app/Boton.tsx` | **Problema:** Generará una ruta `/Boton` si se exporta por defecto, pero como es un componente UI, es un error de arquitectura. Los componentes no deben ir en `app/`. |

### B2. De la URL al archivo
| URL | Archivo |
|-----|---------|
| `/categorias/bebidas` | `src/app/categorias/[categoria].tsx` |
| `/buscar?q=mate&categoria=kiosco` | `src/app/buscar.tsx` |
| `/ayuda/pagos/tarjeta` y `/ayuda/horarios` | `src/app/ayuda/[...slug].tsx` |
| `/ayuda` (con una pantalla propia) | `src/app/ayuda/index.tsx` |

### B3. Verdadero o falso
a) **F**. Expo Router funciona mediante el sistema de archivos: crear el archivo crea la ruta. No hay tabla central de configuración.
b) **F**. Los `_layout.tsx` proveen la estructura de UI compartida (como headers o tabs) para las rutas hijas, no son pantallas independientes que se puedan navegar por sí mismas.
c) **V**.
d) **F**. Conviene usar `npx expo install` para que instale la versión de la librería compatible con la versión de Expo SDK del proyecto, evitando conflictos.
e) **V**.
f) **V**.
g) **V**.
h) **V**.

---

## Parte C · Navegar: `<Link>`, router y la pila

### C1. Métodos de router
| Método | Qué le hace a la pila |
|--------|-----------------------|
| `router.push(href)` | Agrega (apila/push) la nueva pantalla al tope de la pila. |
| `router.navigate(href)` | Apila la pantalla si no existe. Si ya está en la pila o es un tab, navega hacia ella adaptándose al contexto en lugar de duplicarla. |
| `router.replace(href)` | Reemplaza la pantalla actual en el tope de la pila por la nueva (hace pop y luego push). |
| `router.back()` | Elimina la pantalla actual del tope de la pila (pop) y vuelve a la anterior. |
| `router.dismissTo(href)` | Hace múltiples pop hasta que la pantalla deseada quede en el tope. |
| `router.dismissAll()` | Vacía la pila dejando solo la pantalla raíz (hace pop de todas menos la base). |
| `router.canGoBack()` | No modifica la pila. Devuelve true/false indicando si hay pantallas debajo del tope para volver. |
| `router.setParams({...})` | No modifica la altura de la pila. Solo altera los parámetros de búsqueda de la pantalla en el tope. |

### C2. Simulación de la pila
1) `router.push("/productos/1")` -> `[ /productos, /productos/1 ]`
2) `router.push("/productos/2")` -> `[ /productos, /productos/1, /productos/2 ]`
3) `router.navigate("/productos/5")` -> `[ /productos, /productos/1, /productos/2, /productos/5 ]`
4) `router.push("/perfil")` -> `[ /productos, /productos/1, /productos/2, /productos/5, /perfil ]`
5) `router.replace("/buscar")` -> `[ /productos, /productos/1, /productos/2, /productos/5, /buscar ]`
6) `router.back()` -> `[ /productos, /productos/1, /productos/2, /productos/5 ]`
7) `router.dismissTo("/productos")` -> `[ /productos ]`
8) `router.canGoBack()` -> **Falso (`false`)**

### C3. ¿Link o router?
a) **Link**. Es una interacción directa del usuario tocando un elemento para navegar, por lo que usar el componente declarativo es mejor para semántica y accesibilidad.
b) **router** (con `replace`). Se requiere navegación imperativa dentro de la lógica asincrónica de la API.
c) **router.back()**. Acción imperativa para deshacer un evento.
d) **router.replace("/")**. Acción imperativa tras la lógica del login. Se usa `replace` para no poder volver al login con el botón de atrás.
e) **router.dismissTo()** o **router.navigate**. Al volver a una pantalla específica antigua del stack, dismissTo imperativamente limpia las pantallas intermedias.

### C4. Escribí el código
a) `<Link href={{ pathname: "/productos/[id]", params: { id: 8 } }}>Producto</Link>`
b) `<Link href="/perfil" push>Perfil</Link>`
c) `<Link href="/carrito" asChild><Pressable><Text>Carrito</Text></Pressable></Link>`

### C5. Pensar
- **Web**: Facilita el SEO, permite "abrir en pestaña nueva", copiar enlace, y herramientas de accesibilidad nativas pueden interpretar el ancla.
- **Celular**: Habilita el Deep Linking permitiendo abrir esa misma vista desde fuera de la app (ej: mail, otra app), y estandariza la accesibilidad para lectores de pantalla.

---

## Parte D · Navegadores: Stack, Tabs y Drawer

### D1. Comparación
| | Stack | Tabs | Drawer |
|---|---|---|---|
| ¿Apila pantallas? | Sí | No | No |
| ¿Cómo cambia de pantalla el usuario? | Botones de navegación, links o gesto atrás | Barra de pestañas (bottom tabs) | Menú lateral deslizable |
| ¿Desde dónde se importa en SDK 57? | `expo-router` | `expo-router/js-tabs` | `expo-router/drawer` |
| Un caso de uso típico | Detalles de elementos (ej. detalle de un producto), checkout. | Navegación principal / secciones base de la app. | Configuraciones, opciones secundarias o perfiles. |

### D2. Cada tab tiene su pila
Ve la pantalla **Detalle del producto 4**. 
**¿Por qué?** Porque cada tab que contiene un Stack mantiene su propia pila de navegación intacta cuando se cambia de tab (estado preservado).
**App ejemplo:** Instagram (puedes ver un post, ir al feed principal y al volver al perfil sigues viendo el post), o Twitter.

### D3. ¿Dónde va cada pantalla?
a) **Dentro de una tab** (para que se apile dentro del tab y mantenga las bottom tabs visibles).
b) **Stack raíz** (para que superponga y cubra la barra de tabs).
c) **Stack raíz** (con presentation modal, para tapar todo).
d) **Dentro de una tab** (en el Stack correspondiente a la sección Perfil).

### D4. Configurar el Stack
a) `screenOptions` aplica configuraciones globales a todas las pantallas de ese Stack. `options` de `Stack.Screen` aplica solo a esa pantalla individual.
b) Porque `(tabs)` es en sí mismo otro layout. Si `headerShown` no fuera `false`, veríamos dos headers: el del Stack raíz y el de las tabs internas.
c) Sí, la pantalla existe y es accesible por el sistema de archivos. Declararla sirve para poder asignarle configuraciones específicas (`options`), como títulos o estilos de presentación.
d) Cuatro posibles: `modal`, `transparentModal`, `formSheet`, `containedModal`. Para una hoja inferior al 50% usaría **`formSheet`** con `sheetAllowedDetents`.
e) Utilizando el componente `<Stack.Screen options={{ title: 'Producto 7' }} />` dentro del render de la pantalla de detalle.

### D5. Tabs y Drawer en SDK 57
a) Se importan desde `expo-router/js-tabs` en lugar de `expo-router/tabs`. La alternativa experimental en SDK 57 son las bottom tabs nativas (`expo-router/tabs`).
b) Se necesitan `react-native-gesture-handler` y `react-native-reanimated`. Se debe colocar `<GestureHandlerRootView>` en el layout raíz para los gestos.
c) En Expo SDK 57, los paquetes subyacentes son manejados por Expo Router si están en sus dependencias directas. No obstante, si se requiere personalización específica puede que se necesiten instalar los paquetes de gesture-handler y reanimated. 
d) `router.back()` actúa en el navegador que esté actualmente activo/en foco (usualmente el Stack anidado más profundo que tenga historial).

---

## Parte E · Rutas dinámicas, parámetros y hooks

### E1. Encontrá el error
Los parámetros de `useLocalSearchParams` siempre devuelven **strings**, ya provengan de URL o parámetros pasados.
La comparación `p.id === id` utiliza igualdad estricta entre un número (del array) y un string (de params), por lo que siempre será `false`.
**Solución:** Convertir el parámetro a número: `const producto = productos.find((p) => p.id === Number(id));`.

### E2. Catch-all
| URL | slug |
|-----|------|
| `/docs/react` | `["react"]` |
| `/docs/react/hooks/useState` | `["react", "hooks", "useState"]` |
| `/docs` | Podría no matchear si es `[...slug]` estricto, o devolver un array vacío / dar error. |

### E3. Anatomía de una URL
a) Scheme: `rutasipf://`, Ruta: `/buscar`, Parámetros de búsqueda: `q=mate` y `categoria=bebidas`.
b) `{ q: "mate", categoria: "bebidas" }`.
c) No, los parámetros de query string (ej: `?q=...`) se procesan automáticamente sin necesidad de crear archivos con corchetes.
d) 1. Para actualizar el estado en la URL sin apilar una nueva pantalla idéntica en el historial. 2. Para no re-renderizar todo montando la pantalla desde cero (perdiendo el foco del teclado, por ejemplo).

### E4. ¿Dónde estoy?
| Hook | En `/productos/3` | En `/buscar?q=chipa` |
|------|-------------------|----------------------|
| `usePathname()` | `"/productos/3"` | `"/buscar"` |
| `useSegments()` | `["(tabs)", "productos", "3"]` | `["buscar"]` |
| `useLocalSearchParams()` | `{ id: "3" }` | `{ q: "chipa" }` |

### E5. Local vs global
a) `useLocalSearchParams` devuelve parámetros solo de la ruta hoja actual. `useGlobalSearchParams` devuelve todos los parámetros activos de cualquier parte de la jerarquía de URLs. Por defecto se usa la versión local para mantener componentes aislados e independientes.
b) `useFocusEffect` se utiliza para disparar efectos (como recargar datos de una API) únicamente cuando el usuario entra/visualiza activamente esa pantalla particular, y limpiarlo cuando la pantalla deja de estar enfocada.
c) Es responsabilidad del **desarrollador de la pantalla**. Expo Router simplemente enruta hacia allí. La pantalla debe verificar la existencia del contenido dinámico y actuar (ej: mostrando pantalla de error, redirigiendo).

---

## Parte F · Redirecciones, rutas protegidas y deep links

### F1. Redirect
a) Redirige declarativamente a `/productos` al momento de montarse. Equivale a usar imperativamente `router.replace("/productos")`.
b) Si se usara `push`, la pantalla original con la condición quedaría en el historial de navegación. Al presionar "Atrás", se volvería a esa pantalla, la cual volvería a redirigir inmediatamente, creando un loop imposible de salir.

### F2. Stack.Protected
- Guard privado: `conSesion`
- Guard login: `!conSesion`
a) La pantalla deja de existir para el Router. Si se intenta navegar, arrojará un error de que no se manejó la acción, o redirigirá. Si estaba renderizada, el Router la desmonta.
b) Porque al actualizarse la variable `conSesion` a `true`, `!conSesion` pasa a `false`. La pantalla `login` pierde acceso al Guard, por lo que el Router la desmonta y desecha del stack automáticamente, mostrando la pantalla anterior en la pila.
c) La causa es intentar navegar (hacer `router.push` o `Link`) a una pantalla bloqueada por el Guard. Se evita deshabilitando el acceso visual a esos enlaces según el mismo estado, o redirigiendo.
d) Aporta escalabilidad y seguridad. Evita que la pantalla se instancie de fondo siquiera o se intente precargar, aislando a las vistas completamente del sistema de enrutamiento si no se cumplen los requisitos.

### F3. 404, anchor y rutas tipadas
a) `+not-found.tsx`: Se encarga de atrapar las rutas que no tienen archivo correspondiente. Se utiliza para proveer una pantalla de error genérica tipo 404. Se define generalmente en la raíz (`src/app`).
b) `unstable_settings = { anchor: "(tabs)" }`: Se define típicamente en los layouts. Fuerza a que un Deep Link hacia una ruta anidada coloque implícitamente al navegador indicado (como el contenedor principal de la app) por debajo en la pila. Esto permite que el usuario tenga un historial correcto (botón atrás válido) en lugar de una pila vacía.
c) `typedRoutes`: Al escribir mal una ruta en `<Link>`, el compilador de TypeScript marcará un error. Los tipos se generan automáticamente en la carpeta `.expo/types` referenciado en `expo-env.d.ts`.

### F4. Deep links
| Dónde | URL |
|-------|-----|
| App instalada | `comedoripf://menu/7` |
| Expo Go en desarrollo | `exp://192.168.1.20:8081/--/menu/7` |
| Web | `http://localhost:8081/menu/7` |

La parte `/--/` en Expo Go le indica a la app anfitriona (Expo Go) que los parámetros siguientes corresponden al path interno de nuestra aplicación de desarrollo y no a instrucciones propias de Expo Go. El scheme propio no funciona de forma nativa en Expo Go porque la que intercepta y maneja el scheme del SO es la propia app de Expo Go.

### F5. Errores comunes
a) **Causa:** `asChild` inyecta las props de `<Link>` directamente en su único hijo, y utiliza el componente `Slot` que requiere un estilo objeto, no array. **Solución:** Consolidar estilos (aplanándolos o unificando a un objeto) o quitar `asChild` y usar componentes de Link directos.
b) **Causa:** En el sistema de Expo Router, todo archivo en `src/app` genera una ruta. **Solución:** Mover `TarjetaProducto.tsx` a un directorio `src/components`.
c) **Causa:** Usar `router.push` agrega la pantalla al tope, manteniendo al login en la pila. **Solución:** Usar `router.replace("/")` o `router.dismissAll()`.
d) **Causa:** `npm install` puede instalar dependencias subyacentes con versiones no compatibles con la versión actual de Expo SDK. **Solución:** Usar siempre `npx expo install <paquete>` (o `npx expo install --fix` para reparar).
