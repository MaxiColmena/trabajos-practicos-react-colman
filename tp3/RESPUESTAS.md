# Trabajo Práctico N° 3 — Permisos móviles: Android, iOS y Expo
## Respuestas a las Partes A a F

- **Carrera:** Tecnicatura Superior en Desarrollo de Software Multiplataforma
- **Institución:** Instituto Politécnico Formosa
- **Materia:** Taller Complementario – React Native II
- **Alumno/a:** Equipo de Desarrollo Mantenimiento IPF
- **Fecha:** Octubre 2026

---

## Parte A · ¿Qué es un permiso y por qué existe?

### A1. Conceptos

#### a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?
Un **permiso** es un mecanismo de seguridad y control de acceso implementado a nivel de sistema operativo para restringir el uso de recursos sensibles del dispositivo (sensores de hardware como cámara, micrófono, GPS, conectividad de red local) y datos privados (fotografías, contactos, calendario, registros de llamadas).

Los tres actores cumplen roles fundamentales:
1. **La aplicación (App):** Es el actor *solicitante*. Su responsabilidad es justificar la necesidad del recurso en el momento adecuado (*in-context*), solicitar formalmente el acceso mediante las APIs provistas por la plataforma o Expo, y contemplar siempre caminos alternativos de ejecución en caso de que el usuario decida no otorgarlo, garantizando que la aplicación nunca se rompa ni quede bloqueada.
2. **El sistema operativo (SO):** Es el actor *árbitro y garante de seguridad* (*gatekeeper*). Aplica las políticas del sistema, dibuja de forma aislada e inalterable los diálogos nativos de solicitud, almacena el estado de autorización asignado al paquete o bundle ID, aísla los procesos (sandbox) y rechaza o interrumpe cualquier invocación a funciones privilegiadas si el permiso no fue concedido.
3. **La persona usuaria:** Es la *propietaria de los datos y del dispositivo*. Tiene la soberanía de decidir de manera consciente e informada si confía en la aplicación para cederle acceso a su privacidad o recursos, con la potestad de revocar o modificar dicha decisión en cualquier momento desde los Ajustes del sistema.

#### b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?
- **La caja de arena (*sandbox*):** Es una arquitectura de aislamiento de procesos que confina a cada aplicación en su propio espacio virtualizado de ejecución. En Android, a cada aplicación se le asigna un Identificador de Usuario de Linux (`UID`) exclusivo y un directorio privado de datos; en iOS, cada app corre en un contenedor cerrado (*app container*). Ninguna aplicación puede leer la memoria, base de datos o archivos privados de otra app, ni acceder directamente al hardware del dispositivo.
- **Relación con los permisos:** El sandbox constituye la barrera restrictiva predeterminada; los permisos representan las **excepciones explícitas y controladas** que el sistema operativo habilita para perforar esa barrera y permitir la comunicación de la app con el hardware sensible o APIs protegidas.
- **¿Qué puede hacer una app sin ningún permiso?:**
  - Ejecutar toda su lógica de negocio y cómputo JavaScript/TypeScript.
  - Almacenar datos en su propio directorio privado y aislado (AsyncStorage, SQLite interno, cache de la app).
  - Diseñar e interactuar con su interfaz gráfica de usuario completa (renderizar vistas, animaciones, responder a toques y gestos).
  - Realizar peticiones de red salientes a APIs web seguras (en iOS y Android las peticiones HTTPS normales no requieren interacción en runtime; en Android `INTERNET` es un permiso normal que se concede automáticamente al instalar).
  - Abrir enlaces externos en el navegador mediante `Linking.openURL()`.
  - Usar selectores del sistema (*Photo Picker* o *Document Picker*), donde la persona usuaria elige un archivo puntual y el sistema entrega únicamente ese elemento a la app sin que ésta requiera acceso a la galería completa.

#### c) Nombrá las cuatro razones por las que existen los permisos y dá un ejemplo concreto de cada una.
1. **Privacidad y protección de datos personales:** Evitar que aplicaciones maliciosas o desproporcionadas recopilen información confidencial e identificable de la vida privada del usuario sin su conocimiento.  
   *Ejemplo:* Acceso a la libreta de contactos (`READ_CONTACTS`) o a la ubicación geográfica exacta en tiempo real (`ACCESS_FINE_LOCATION`).
2. **Seguridad e integridad del sistema y de otras aplicaciones:** Prevenir ataques que comprometan el funcionamiento del dispositivo, intercepten toques o modifiquen el entorno de otras apps.  
   *Ejemplo:* `SYSTEM_ALERT_WINDOW` (permiso para superponerse a otras apps, previniendo ataques de tipo *clickjacking* o pantallas de phishing).
3. **Consumo y control de recursos físicos (batería, CPU y sensores):** Evitar la degradación del rendimiento general, calentamiento del equipo o drenaje acelerado de la batería debido a procesos desmedidos.  
   *Ejemplo:* Ubicación en segundo plano (`ACCESS_BACKGROUND_LOCATION`) o programación de alarmas exactas continuas (`SCHEDULE_EXACT_ALARM`).
4. **Protección financiera y prevención de costos económicos:** Evitar que una aplicación incurra en gastos monetarios involuntarios para la persona usuaria sin su expresa autorización.  
   *Ejemplo:* Envío directo de mensajes de texto SMS (`SEND_SMS`) o llamadas telefónicas automáticas a números con costo especial (`CALL_PHONE`).

#### d) En la analogía del portero del edificio, ¿quién es la visita, quién el portero y quién el dueño del departamento? ¿Qué significa que “el portero se acuerda de la respuesta”?
- **La visita:** La aplicación (toca el timbre solicitando acceso a un recurso confidencial o habitación del edificio).
- **El portero:** El sistema operativo (Android / iOS). Se interpone entre la visita y el departamento, administra las normas de convivencia del edificio y no permite el paso hasta verificar o consultar con el residente.
- **El dueño del departamento:** La persona usuaria (propietaria de sus datos y de los recursos de su hogar/dispositivo).
- **¿Qué significa que “el portero se acuerda de la respuesta”?:** Significa que el sistema operativo almacena de manera persistente la decisión tomada por el usuario. Una vez que el usuario concede o deniega permanentemente el permiso, el SO registra esa respuesta. En visitas posteriores de la aplicación, el portero responde de inmediato a la app basándose en lo que memorizó, sin volver a molestar al dueño con timbres o diálogos repetitivos (o impidiendo que la visita vuelva a preguntar si el dueño indicó "no volver a molestar").

---

### A2. Declarar y solicitar

| Aspecto | Declarar (al compilar) | Solicitar (al ejecutar / runtime) |
| :--- | :--- | :--- |
| **¿Qué se hace?** | Se especifican formalmente las capacidades, funciones y recursos sensibles que la aplicación podría requerir a lo largo de su ciclo de vida, antes de generar el paquete binario. | Se invoca dinámicamente mediante código en tiempo de ejecución para comprobar el estado actual y presentar el diálogo del sistema si el usuario aún no decidió. |
| **¿Dónde / cómo en Android?** | En el archivo `AndroidManifest.xml` mediante etiquetas `<uses-permission android:name="..." />`. | En código mediante la API de permisos de Android (`ActivityCompat.requestPermissions` / `ActivityResultContracts`) o hooks y métodos de Expo (`requestForegroundPermissionsAsync()`). |
| **¿Dónde / cómo en iOS?** | En el archivo `Info.plist`, declarando claves de descripción de propósito (`NS...UsageDescription`) con una justificación clara. | Mediante los métodos de autorización de los frameworks de Apple (`AVCaptureDevice.requestAccess`, `CLLocationManager`) o las funciones asíncronas de Expo (`useCameraPermissions`, etc.). |
| **¿Dónde / cómo en Expo?** | En el archivo `app.json` (o `app.config.ts`), configurando el arreglo `plugins` de cada módulo, o en `expo.android.permissions` e `expo.ios.infoPlist`. | Utilizando los hooks unificados (`useCameraPermissions`, `useForegroundPermissions`) o funciones `request...PermissionsAsync()` de cada módulo oficial. |
| **¿Qué pasa si se omite?** | **Al omitir la declaración:**<br>• En Android: al invocar la API protegida, la app lanza una excepción fatal `SecurityException` y crashea, o el diálogo nunca aparece retornando rechazo inmediato.<br>• En iOS: la aplicación crashea instantáneamente con `SIGABRT` al intentar acceder a la API, o el binario es rechazado automáticamente en App Store Connect. | **Al omitir la solicitud en tiempo de ejecución:**<br>Aun estando declarado, si la app llama directamente a la funcionalidad (abrir la cámara o leer coordenadas GPS) sin que el usuario haya aceptado en el diálogo, la llamada fallará arrojando error de permisos o retornará valores vacíos/nulos. |

---

### A3. Verdadero o falso

| Enunciado | V/F | Justificación |
| :--- | :---: | :--- |
| a) El diálogo de permiso lo dibuja tu app con componentes de React Native. | **F** | El diálogo de permiso es una ventana modal propia del sistema operativo, dibujada por un proceso privilegiado nativo fuera del árbol de vistas de React Native. La app no tiene acceso a sus componentes, estilos ni eventos internos. |
| b) En Expo, la fuente de verdad de los permisos es `app.json` (o `app.config.ts`), no el `AndroidManifest.xml`. | **V** | En el flujo gestionado de Expo (*Managed Workflow / Prebuild*), los archivos nativos son efímeros y se generan automáticamente a partir de la configuración centralizada en `app.json` mediante Config Plugins. |
| c) Agregar un permiso nuevo en el `Info.plist` se puede publicar con una actualización OTA. | **F** | Las actualizaciones Over-The-Air (como Expo Updates) solo actualizan el bundle de JavaScript y assets. Cualquier modificación en `Info.plist`, `AndroidManifest.xml` o capas nativas exige compilar y distribuir una nueva versión binaria de la app. |
| d) Si tu código pide un permiso que no está en el manifiesto, Android igual muestra el diálogo. | **F** | En Android, si un permiso en tiempo de ejecución no fue declarado previamente en el `AndroidManifest.xml`, el sistema no muestra ningún diálogo al usuario y la petición se resuelve de inmediato como denegada. |
| e) El paquete `expo-permissions` es la forma recomendada de pedir permisos en SDK 57. | **F** | `expo-permissions` quedó obsoleto y fue eliminado hace muchos SDKs (deprecado desde SDK 41). En las versiones modernas de Expo, cada librería (`expo-camera`, `expo-location`, `expo-notifications`, etc.) administra sus propios hooks y métodos de autorización independientes. |
| f) En iOS, las notificaciones no llevan texto de propósito en el `Info.plist`. | **V** | Las notificaciones en iOS no requieren una clave `NS...UsageDescription` en `Info.plist`. La solicitud de registro se gestiona directamente en runtime mediante el framework nativo `UserNotifications` (`UNUserNotificationCenter`). |
| g) Con acceso limitado a fotos, `status` vale `'granted'` y el matiz está en `accessPrivileges`. | **V** | Desde iOS 14, si el usuario elige "Seleccionar fotos..." (*Limited Access*), la API de Expo retorna `status: 'granted'`, y la propiedad `accessPrivileges` adopta el valor `'limited'` (en contraposición a `'all'`). |
| h) Desinstalar y reinstalar la app es la forma confiable de volver a “sin decidir” en las dos plataformas. | **V** | La desinstalación completa elimina los registros de la aplicación y su sandbox en el sistema operativo, restableciendo el estado de todos los permisos a "sin decidir" (*undetermined*) para una nueva instalación limpia. |

---

### A4. Los estados de un permiso

#### a) Diagrama de estados de un permiso en Android y en iOS y diferencia central
```
                   ┌──────────────────────────────────┐
                   │    Sin decidir (undetermined)    │
                   └────────────────┬─────────────────┘
                                    │ Solicitar permiso
                                    ▼
                         ┌───────────────────────┐
                         │  Diálogo del sistema  │
                         └──────────┬────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
     [Usuario acepta]                          [Usuario rechaza]
┌─────────────────────────┐                               │
│   Concedido (granted)   │                               │
└─────────────────────────┘                               │
                                  ┌───────────────────────┴───────────────────────┐
                                  │                                               │
                           (En iOS: 1 intento)                         (En Android 11+)
                                  │                                               │
                                  ▼                                               ▼
                      ┌──────────────────────┐                       ┌─────────────────────────┐
                      │ Bloqueado / Denegado │                       │  Denegado configurable  │
                      │      permanente      │                       │   (canAskAgain: true)   │
                      │ (canAskAgain: false) │                       └────────────┬────────────┘
                      └──────────────────────┘                                    │
                                                                         2° rechazo consecutivo
                                                                                  │
                                                                                  ▼
                                                                     ┌─────────────────────────┐
                                                                     │  Bloqueado permanente   │
                                                                     │   (canAskAgain: false)  │
                                                                     └─────────────────────────┘
```

**Diferencia central entre ambas plataformas:**
- En **iOS**, el sistema operativo ofrece **una única oportunidad** para desplegar el diálogo nativo. Si la persona usuaria rechaza la solicitud, el permiso queda bloqueado permanentemente (`canAskAgain: false`) y la aplicación nunca más podrá desplegar un diálogo del sistema; la única forma de activarlo es redirigiendo manualmente al usuario a la app Ajustes.
- En **Android (Android 11+)**, rige la política de los **dos intentos** (*two-strikes policy*): tras el primer rechazo, el permiso queda denegado pero aún es preguntable (`canAskAgain: true`), permitiendo a la app volver a mostrar el diálogo una segunda vez. Si el usuario rechaza por segunda vez consecutiva (o tilda "No volver a preguntar" en versiones anteriores), pasa recién al estado bloqueado permanente (`canAskAgain: false`).

#### b) Tabla de valores devueltos por Expo en cada estado:

| Estado | `status` | `canAskAgain` | ¿Puede aparecer el diálogo? |
| :--- | :---: | :---: | :---: |
| **Sin decidir** | `'undetermined'` | `true` | **Sí** |
| **Concedido** | `'granted'` | `true` | **No** (ya está concedido, la API retorna inmediatamente el estado favorable sin molestar al usuario) |
| **Denegado (se puede volver a pedir)** | `'denied'` | `true` | **Sí** (en Android durante el primer rechazo) |
| **Bloqueado** | `'denied'` | `false` | **No** (el SO no volverá a mostrarlo; se debe redirigir a Ajustes) |

---

## Parte B · Android: tipos de permisos y manifiesto

### B1. Clasificá los permisos

| Permiso | Tipo | ¿Cómo se obtiene? |
| :--- | :--- | :--- |
| `INTERNET` | De instalación (Normal) | Se concede de forma automática por el sistema operativo al momento de la instalación si figura en el manifiesto. No requiere confirmación en runtime. |
| `CAMERA` | De tiempo de ejecución (Peligroso / Runtime) | Requiere declaración previa en el manifiesto y solicitud activa en tiempo de ejecución mediante el diálogo del sistema. |
| `VIBRATE` | De instalación (Normal) | Se concede automáticamente al instalar la aplicación si está declarado en el manifiesto. |
| `SYSTEM_ALERT_WINDOW` | Especial | No utiliza el diálogo modal estándar. La app debe redirigir al usuario mediante un Intent específico a la pantalla de Ajustes del sistema ("Mostrar sobre otras aplicaciones") para que lo autorice de forma manual. |
| `POST_NOTIFICATIONS` | De tiempo de ejecución (Runtime - Android 13+) | Se declara en el manifiesto y se solicita mediante diálogo modal al usuario en tiempo de ejecución. |
| `ACCESS_NETWORK_STATE` | De instalación (Normal) | Se concede automáticamente durante la instalación si está declarado en el manifiesto. |
| `READ_CONTACTS` | De tiempo de ejecución (Peligroso / Runtime) | Requiere declaración en el manifiesto y solicitud interactiva en tiempo de ejecución con diálogo del sistema. |
| `SCHEDULE_EXACT_ALARM` | Especial / De instalación restringida | Declarado en el manifiesto. En Android 13+ y 14+, para la gran mayoría de apps requiere habilitación expresa del usuario en la pantalla de Ajustes "Alarmas y recordatorios" (salvo excepciones como apps de reloj o calendario). |
| `RECORD_AUDIO` | De tiempo de ejecución (Peligroso / Runtime) | Declarado en el manifiesto y solicitado explícitamente en tiempo de ejecución mediante diálogo nativo. |
| `MANAGE_EXTERNAL_STORAGE` | Especial | Permiso de alto riesgo ("Acceso a todos los archivos"). Se debe redirigir al usuario a la sección especial de Ajustes; fuertemente vetado por las directrices de Google Play salvo apps de gestión de archivos. |

---

### B2. Grupos y nombres

#### a) ¿Qué es un grupo de permisos? Si la app pide `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos, ¿cuántos diálogos ve la persona?
Un **grupo de permisos** (*Permission Group*) es una agrupación conceptual de permisos individuales relacionados que protegen un mismo recurso de hardware o conjunto de datos del usuario (por ejemplo, el grupo `LOCATION`).  
Si la aplicación solicita `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` de manera conjunta, la persona ve **UN SOLO diálogo interactivo**. En este diálogo unificado de Android 12+, el sistema le presenta al usuario dos opciones visuales: elegir entre ubicación "Precisa" (Fine) o "Aproximada" (Coarse), resolviendo ambos permisos en una sola pantalla.

#### b) ¿Qué prefijo lleva el nombre completo de un permiso? Escribí el nombre completo del permiso de cámara.
- **Prefijo:** `android.permission.`
- **Nombre completo de cámara:** `android.permission.CAMERA`

#### c) ¿Qué son los permisos de firma (signature)? ¿Por qué no se usan en apps comunes?
Los **permisos de firma** (`protectionLevel="signature"`) son permisos que el sistema concede automáticamente a una aplicación únicamente si ésta se encuentra firmada con la misma clave criptográfica (certificado keystore) que la aplicación que declaró el permiso originalmente o que el firmware del sistema.  
No se usan en aplicaciones comunes porque un desarrollador independiente no dispone de los certificados de firma del fabricante del teléfono, del sistema operativo Android ni de otras empresas. Están concebidos exclusivamente para comunicación privada y privilegiada entre un paquete de aplicaciones de una misma empresa o componentes propietarios del sistema.

---

### B3. Leé el manifiesto

Dada la declaración generada por `npx expo prebuild`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
 xmlns:tools="http://schemas.android.com/tools">
 <uses-permission android:name="android.permission.INTERNET" />
 <uses-permission android:name="android.permission.CAMERA" />
 <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
 <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
 <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
 <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
 android:maxSdkVersion="32" />
 <uses-permission android:name="android.permission.RECORD_AUDIO"
 tools:node="remove" />
</manifest>
```

#### a) ¿Qué permisos se conceden solos al instalar y cuáles hay que pedir además en tiempo de ejecución?
- **Se conceden solos al instalar:**  
  - `android.permission.INTERNET` (permiso de nivel de protección *normal*).
- **Hay que pedir además en tiempo de ejecución:**  
  - `android.permission.CAMERA`
  - `android.permission.ACCESS_COARSE_LOCATION`
  - `android.permission.ACCESS_FINE_LOCATION`
  - `android.permission.POST_NOTIFICATIONS` (en dispositivos con Android 13 en adelante).
  - `android.permission.READ_EXTERNAL_STORAGE` (en dispositivos heredados con Android 12L o inferior, hasta API 32).  
  *(Nota: `RECORD_AUDIO` fue eliminado mediante directiva de manifest merger, por lo que no existe en el binario final).*

#### b) ¿Qué significa `android:maxSdkVersion="32"`? ¿Qué permisos reemplazan a `READ_EXTERNAL_STORAGE` desde Android 13?
- **Significado:** Indica al compilador y al sistema operativo que este permiso solo debe existir y ser solicitado en dispositivos con versiones de Android menores o iguales al nivel de API 32 (Android 12L). En dispositivos con Android 13 (API 33) o superiores, el sistema ignora por completo esta directiva.
- **Permisos que lo reemplazan desde Android 13 (API 33):**  
  Los permisos granulares de medios:
  - `android.permission.READ_MEDIA_IMAGES` (para imágenes y fotografías)
  - `android.permission.READ_MEDIA_VIDEO` (para grabaciones de video)
  - `android.permission.READ_MEDIA_AUDIO` (para pistas de audio)  
  Adicionalmente, se promueve el uso del *Photo Picker* del sistema que opera con cero permisos.

#### c) ¿Qué hace `tools:node="remove"`? Escribí el fragmento de `app.json` que lo genera.
- **Función:** Es una directiva de fusión de manifiestos (*Manifest Merger*) que ordena eliminar por completo esa etiqueta XML del manifiesto compilado final, anulando cualquier declaración introducida por dependencias de librerías nativas (como `expo-camera`).
- **Fragmento en `app.json`:**
  ```json
  {
    "expo": {
      "android": {
        "blockedPermissions": [
          "android.permission.RECORD_AUDIO"
        ]
      }
    }
  }
  ```

#### d) Necesitás agregar `SCHEDULE_EXACT_ALARM`, que ninguna librería declara. ¿En qué propiedad de `app.json` va?
Va en la propiedad `expo.android.permissions`:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.SCHEDULE_EXACT_ALARM"
      ]
    }
  }
}
```

#### e) ¿Por qué en Expo no conviene editar este archivo a mano? ¿Funciona `blockedPermissions` en Expo Go?
- **Por qué no conviene editarlo a mano:** Porque en el flujo de Expo Prebuild la carpeta `android/` es un artefacto de generación automática. Comandos como `npx expo prebuild --clean` sobreescriben y regeneran los archivos nativos basándose en `app.json`. Cualquier edición manual directa en el archivo XML se perderá de inmediato.
- **¿Funciona en Expo Go?:** **NO**, no funciona en Expo Go. La app de Expo Go ya se encuentra precompilada en las tiendas con un `AndroidManifest.xml` estático que incluye todos los permisos posibles soportados por el ecosistema Expo. La propiedad `blockedPermissions` solo surte efecto al compilar un binario personalizado (*Development Build* o compilación de producción con EAS Build).

---

### B4. Así pregunta Android

#### a) ¿Se puede poner texto propio dentro del diálogo de Android? Entonces, ¿dónde tenés que explicar para qué usás el permiso?
- **¿Se puede poner texto propio dentro del diálogo?:** **NO**. El diálogo de solicitud de Android tiene un layout cerrado y controlado por el sistema operativo y la capa del fabricante (OneUI, MIUI, Pixel UI, etc.). La aplicación no puede alterar sus textos, estructura ni agregar descripciones personalizadas.
- **¿Dónde tenés que explicarlo?:** Se debe explicar en una **pantalla previa contextual (*pre-permission screen / rationale screen*)** o modal interno creado con componentes de React Native antes de disparar el diálogo nativo, o mediante un mensaje visible en la pantalla previa a que el usuario presione el botón que dispara la solicitud.

#### b) ¿Qué diferencia hay entre “Mientras la app está en uso” y “Solo esta vez”? ¿Para qué permisos existe esta última opción?
- **Diferencia:**
  - *"Mientras la app está en uso" (While using the app):* El permiso queda otorgado de manera continua para todas las futuras sesiones en primer plano de la aplicación hasta que el usuario decida revocarlo manualmente en Ajustes.
  - *"Solo esta vez" (Only this time):* El permiso es efímero y se otorga únicamente para la sesión actual. En cuanto el usuario abandona la aplicación (pasa a segundo plano prolongado o se cierra su proceso), el permiso expira. Al reabrir la app y solicitar el recurso, el diálogo del sistema volverá a presentarse.
- **Permisos donde existe:** Se introdujo en Android 11 para los tres permisos más sensibles de tiempo de ejecución: **Ubicación (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`)**, **Cámara (`CAMERA`)** y **Micrófono (`RECORD_AUDIO`)**.

#### c) En Android 11+, ¿qué pasa si la persona toca “No permitir” dos veces? ¿Qué valor toma `canAskAgain`?
- Al tocar "No permitir" dos veces consecutivas, el sistema operativo asume un "No volver a preguntar" implícito. A partir de ese instante, la aplicación queda inhibida de volver a mostrar el diálogo nativo.
- `canAskAgain` toma el valor: **`false`** (acompañado de `status: 'denied'`).

#### d) La ubicación aproximada tiene una precisión de unos 3 km². Dá un ejemplo de función que anda bien con ella y otro de una que no.
- **Función que anda bien:** Servicio de previsión del pronóstico meteorológico / clima local, selección automática de provincia o país en una tienda online, o recomendaciones generales de eventos culturales en la ciudad.
- **Función que NO anda bien:** Navegación guiada paso a paso para vehículos (tipo Google Maps, Waze), servicio de recogida de pasajeros (Uber, Cabify donde se necesita el punto exacto de la vereda), o auditoría precisa para encontrar un proyector averiado en un aula específica dentro de un pabellón.

#### e) Si la persona revoca un permiso desde Ajustes mientras la app está abierta, ¿qué hace Android con el proceso de la app?
Android **termina inmediatamente el proceso de la app (*process kill*)**. Al volver a la aplicación, el sistema operativo recrea el proceso desde cero para asegurar que no queden referencias vivas en memoria a recursos o descriptores a los que la app ya no tiene derecho de acceso.

---

### B5. Android, versión por versión

| Cambio | Versión (API) | Qué implica para el código |
| :--- | :---: | :--- |
| **Nacen los permisos en tiempo de ejecución** | Android 6.0 (API 23 - Marshmallow) | Antes los permisos se concedían en bloque al instalar. A partir de API 23, el código debe consultar pasivamente (`checkSelfPermission`) y solicitar dinámicamente (`requestPermissions`) cada permiso sensible antes de usar la API, manejando el posible rechazo. |
| **La ubicación en segundo plano pasa a ser un permiso aparte** | Android 10 (API 29) / Android 11 (API 30) | Se crea `ACCESS_BACKGROUND_LOCATION`. En Android 11+ está prohibido solicitarlo junto con el permiso de primer plano en un único diálogo; se debe solicitar primero la ubicación en primer plano y posteriormente solicitar el segundo plano guiando a Ajustes. |
| **Dos rechazos equivalen a “no volver a preguntar”** | Android 11 (API 30) | Desaparece la casilla de tilde manual. Si el usuario rechaza dos veces, el diálogo no vuelve a abrirse. El código debe comprobar si `canAskAgain === false` y ofrecer un enlace directo a Ajustes con `Linking.openSettings()`. |
| **Ubicación precisa o aproximada** | Android 12 (API 31) | La app debe pedir conjuntamente `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION`. El usuario puede elegir granularmente entre ambas. El código debe estar preparado para recibir una precisión reducida (`accuracy === 'coarse'`) sin fallar. |
| **Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`)** | Android 13 (API 33 - Tiramisu) | Las notificaciones dejan de estar concedidas por defecto. Se debe declarar en el manifiesto y solicitar activamente el permiso en runtime al usuario antes de emitir cualquier notificación local o push. |
| **Acceso parcial a fotos y videos (“Seleccionar fotos”)** | Android 14 (API 34) | Se introduce `READ_MEDIA_VISUAL_USER_SELECTED`. Permite al usuario conceder acceso únicamente a un conjunto acotado de fotos/videos. La app debe tolerar ver una galería restringida y Google promueve el uso del Photo Picker del sistema sin permisos. |
| **Permiso de red local (`ACCESS_LOCAL_NETWORK`)** | Android 15 (API 35) / Android 16 | Descubrir dispositivos o establecer conexiones con sockets en la red de área local Wi-Fi doméstica o institucional requiere un permiso explícito solicitado en runtime al usuario. |

#### ¿Qué es el `targetSdkVersion`? ¿A qué API apunta Expo SDK 57 y qué exige Google Play desde el 31 de agosto de 2026?
- **`targetSdkVersion`:** Es una propiedad en la configuración de Android que indica la versión de la API de Android para la cual la app fue probada y programada. Le indica al sistema operativo qué comportamientos de seguridad modernos aplicar de forma obligatoria y cuáles mantener en modo de compatibilidad retrospectiva.
- **¿A qué API apunta Expo SDK 57/58?:** Apunta a la API moderna requerida por Google (API 35 en SDKs recientes).
- **¿Qué exige Google Play desde el 31 de agosto de 2026?:** Google Play exige que todas las aplicaciones nuevas y actualizaciones enviadas apunten como mínimo al nivel de API de Android de la versión del año previo (Android 15 / API 35 o Android 16 / API 36 según el ciclo de homologación de políticas). Si la aplicación no actualiza su `targetSdkVersion` antes de dicha fecha límite anual, no podrá ser descubierta ni instalada por usuarios con versiones modernas de Android en Google Play Store.

---

## Parte C · iOS: textos de propósito y acceso parcial

### C1. Claves del Info.plist

| Recurso | Clave en `Info.plist` |
| :--- | :--- |
| Cámara | `NSCameraUsageDescription` |
| Micrófono | `NSMicrophoneUsageDescription` |
| Ubicación en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicación siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` *(y `NSLocationAlwaysUsageDescription`)* |
| Fotos (leer) | `NSPhotoLibraryUsageDescription` |
| Fotos (solo guardar) | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps (ATT) | `NSUserTrackingUsageDescription` |
| Notificaciones | **No lleva clave en Info.plist** (se registra en runtime con `UNUserNotificationCenter`) |

---

### C2. Sin texto, no hay permiso

#### a) ¿Qué pasa si falta el texto de propósito y la app intenta usar la cámara? ¿Y al subir la build a App Store Connect? Mencioná el código de error.
- **En tiempo de ejecución:** La aplicación crashea instantáneamente con una señal de terminación fatal `SIGABRT`. En la consola de depuración de Xcode se emite el mensaje:  
  *“This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSCameraUsageDescription key with a string value explaining to the user how the app uses this data.”*
- **Al subir la build a App Store Connect:** El proceso automatizado de validación de Apple rechaza el binario y cancela el procesamiento para pruebas o publicación.
- **Código de error de App Store:** **`ITMS-90683`** (*Missing Purpose String in Info.plist*).

#### b) ¿Cuántas veces muestra iOS el diálogo de un permiso? Si la persona dice que no, ¿qué le queda a la app?
- **Frecuencia:** iOS muestra el diálogo nativo del sistema **exactamente UNA sola vez** en toda la vida útil de la instalación de la app.
- **Si la persona dice que no:** La app no podrá volver a disparar el diálogo del sistema. A la app solo le queda:
  1. Detectar el estado bloqueado (`canAskAgain: false`).
  2. Proveer una alternativa funcional (ej. ingresar datos por teclado o usar un selector del sistema).
  3. Si la persona pulsa voluntariamente la acción, mostrar una pantalla informativa con un botón que invoque `Linking.openSettings()` para guiarla a habilitarlo manualmente en la app de Ajustes de iOS.

#### c) En el diálogo de iOS, ¿qué parte arma el sistema y cuál escribís vos? En Expo, ¿dónde se configura ese texto?
- **Qué arma el sistema:** El título general (`“¿Quieres permitir que “[Nombre de la App]” acceda a la cámara?”`), los botones de acción (`No permitir`, `Permitir`, etc.) y la tarjeta gráfica con efecto translúcido del sistema.
- **Cuál escribís vos:** El cuerpo descriptivo intermedio o **texto de propósito (*usage description*)**, que explica claramente para qué se usará la información.
- **Dónde se configura en Expo:** En el archivo `app.json` (o `app.config.ts`), habitualmente dentro de los parámetros del plugin del módulo en `expo.plugins` (por ejemplo: `["expo-camera", { "cameraPermission": "Usamos tu cámara para..." }]`) o directamente en la clave `expo.ios.infoPlist.NSCameraUsageDescription`.

#### d) Una librería usa una API protegida que tu app nunca llama y Apple rechaza la build. ¿Por qué pasa y cómo se resuelve?
- **Por qué pasa:** Apple somete cada binario a un análisis estático de código al subirlo a App Store Connect. Si el analizador detecta símbolos nativos compilados pertenecientes a un framework protegido (como `AVFoundation` para micrófono o `CoreLocation`), infiere que la app utiliza esa funcionalidad y exige la correspondiente clave en `Info.plist`, sin importar que tu código JS nunca llame a esas funciones.
- **Cómo se resuelve:**
  1. Configurando el plugin de la librería en `app.json` para deshabilitar las funciones no deseadas antes de compilar (por ejemplo, en `expo-camera`, configurar `"microphonePermission": false`).
  2. Reemplazando la librería por una versión modularizada que no compile dependencias nativas innecesarias.
  3. Si la librería nativa es indispensable y no ofrece flags de exclusión, configurando la clave en `infoPlist` justificando su presencia o implementando un Config Plugin que elimine las referencias nativas en el Podfile.

---

### C3. Probador de textos de propósito

Evaluación según la pauta 5.1.1 de Apple y reescritura con el molde: **“Usamos tu [dato] para [beneficio concreto]”**:

| Texto propuesto | ¿Aprobado? | Versión mejorada |
| :--- | :---: | :--- |
| “Necesitamos tu ubicación.” | **NO** (Es vago, no explica el beneficio ni la razón de uso) | *“Usamos tu ubicación para mostrarte los sectores del edificio y puntos de reciclaje más cercanos a tu posición.”* |
| “Para mejorar tu experiencia.” | **NO** (Frase genérica y cliché sistemáticamente vetada por Apple) | *“Usamos tu ubicación para identificar automáticamente en qué aula o patio estás al reportar un desperfecto.”* |
| “Usamos tu ubicación para mostrarte las farmacias de turno más cercanas.” | **SÍ** | *(Aprobado sin cambios: cumple con el molde indicando el dato y el beneficio directo y tangible).* |
| “La app no funciona sin ubicación.” | **NO** (Es intimidatorio, coercitivo y no expresa el propósito real) | *“Usamos tu ubicación para registrar las coordenadas exactas de la avería y facilitar la tarea del equipo de mantenimiento.”* |
| “Ubicación requerida por el sistema.” | **NO** (Es falso y engañoso; el sistema no lo exige, lo pide la app) | *“Usamos tu ubicación para asociar la falla edilicia al sector correcto del instituto de forma rápida.”* |

---

### C4. Acceso parcial y gradual

| Caso | iOS | En Expo |
| :--- | :---: | :--- |
| **Fotos limitadas (“Seleccionar fotos”)** | iOS 14+ | Se detecta con `MediaLibrary.requestPermissionsAsync()` / `ImagePicker`: retorna `status: 'granted'` y `accessPrivileges: 'limited'`. |
| **Ubicación aproximada (interruptor “Precisa”)** | iOS 14+ | Al solicitar permisos con `Location.requestForegroundPermissionsAsync()`, si el usuario apaga "Precisa", la propiedad `accuracy` o el scope de precisión refleja precisión reducida (con un margen de varios kilómetros). |
| **“Permitir una vez” (ubicación)** | iOS 13+ | La función retorna `status: 'granted'`, pero la concesión es efímera. Cuando la app se suspende o cierra, al volver a abrir vuelve automáticamente a `status: 'undetermined'`. |
| **Ubicación escalonada: de “al usar la app” a “Siempre”** | iOS 13+ | Se solicita primero `Location.requestForegroundPermissionsAsync()`. Una vez concedido en primer plano, se invoca `Location.requestBackgroundPermissionsAsync()` para ofrecer la ampliación a "Siempre". |
| **Notificaciones provisionales** | iOS 12+ | Se solicita mediante `Notifications.requestPermissionsAsync({ ios: { allowProvisional: true } })`. Otorga autorización automática y silenciosa enviando avisos al Centro de Notificaciones sin desplegar un diálogo invasivo. |
| **Rastreo entre apps (App Tracking Transparency)** | iOS 14.5+ | Módulo `expo-tracking-transparency`, función `requestTrackingPermissionsAsync()`, retornando `'granted'` o `'denied'`. |

#### ¿Qué versión mínima de iOS requiere Expo SDK 57/58? ¿Qué consecuencia práctica tiene eso sobre la tabla anterior?
- **Versión mínima:** Expo SDK 57/58 requiere como mínimo **iOS 15.1 o iOS 16.0+**.
- **Consecuencia práctica:** Significa que el 100% de los dispositivos iOS en los que corre nuestra app disponen de todas estas funciones modernas de privacidad granular (fotos limitadas de iOS 14, ubicación aproximada de iOS 14, ubicación escalonada de iOS 13, notificaciones provisionales de iOS 12). No es necesario escribir código defensivo ni *fallbacks* para versiones antiguas como iOS 11 o 12.

---

### C5. Android vs iOS, lado a lado

| Aspecto | Android | iOS |
| :--- | :--- | :--- |
| **¿Dónde se declara?** | En `AndroidManifest.xml` con `<uses-permission android:name="..." />`. | En `Info.plist` con claves `NS...UsageDescription`. |
| **Texto en el diálogo** | **Fijo del sistema.** No se puede personalizar el texto interno del diálogo. | **Personalizable.** La app redacta el texto explicativo de propósito (*usage description*). |
| **Oportunidades para preguntar** | **Dos oportunidades** (Android 11+). Si rechaza dos veces consecutivas, pasa a "No volver a preguntar". | **Una sola oportunidad.** Tras el primer rechazo, el sistema nunca más vuelve a mostrar el diálogo. |
| **“Solo esta vez” / “Permitir una vez”** | Disponible para Cámara, Micrófono y Ubicación (Android 11+). Expira al salir de la app. | Disponible para Ubicación (iOS 13+). Expira al cerrar la sesión de la app y vuelve a *undetermined*. |
| **Notificaciones** | Declarado en manifiesto (`POST_NOTIFICATIONS`) y solicitado en runtime desde Android 13. Requiere canales nativos. | Solicitado directamente en runtime. No lleva clave en `Info.plist`. Soporta notificaciones provisionales silenciosas. |
| **Ubicación en segundo plano** | Permiso independiente `ACCESS_BACKGROUND_LOCATION`. Exige otorgar primero primer plano y luego segundo plano. | Solicitud escalonada: primero *When In Use* y posteriormente se solicita ampliación a *Always*. |
| **Si falta la declaración** | La petición se deniega de inmediato o lanza `SecurityException` en tiempo de ejecución. | Crasheo inmediato con `SIGABRT` al llamar a la API o rechazo del binario en App Store Connect. |

---

## Parte D · Expo: una API, dos plataformas

### D1. Módulos y funciones

| Necesidad | Módulo de Expo | Hook / función de permiso |
| :--- | :--- | :--- |
| Escanear un QR con la cámara | `expo-camera` | `useCameraPermissions()` o `Camera.requestCameraPermissionsAsync()` |
| Grabar video con sonido | `expo-camera` | `requestCameraPermissionsAsync()` y `requestMicrophonePermissionsAsync()` (o hooks equivalentes) |
| Mostrar farmacias cercanas | `expo-location` | `useForegroundPermissions()` o `Location.requestForegroundPermissionsAsync()` |
| Seguir un envío con la app en segundo plano | `expo-location` | `Location.requestBackgroundPermissionsAsync()` |
| Mostrar un recordatorio | `expo-notifications` | `usePermissions()` o `Notifications.requestPermissionsAsync()` |
| Grabar una nota de voz | `expo-audio` | `Audio.requestRecordingPermissionsAsync()` |
| Galería propia dentro de la app | `expo-media-library` | `usePermissions()` o `MediaLibrary.requestPermissionsAsync()` |
| Publicidad personalizada entre apps (iOS) | `expo-tracking-transparency` | `requestTrackingPermissionsAsync()` |

#### Un tutorial usa `import * as Permissions from 'expo-permissions'`. ¿Qué te dice eso sobre el tutorial?
Indica que el tutorial está **completamente obsoleto y desactualizado** (probablemente escrito en 2020 o principios de 2021). El paquete `expo-permissions` fue deprecado en el SDK 41 y eliminado por completo de las versiones modernas de Expo. Hoy en día, cada módulo oficial gestiona de manera autónoma sus propios permisos y hooks. Seguir ese tutorial generará errores de compilación e instalación.

---

### D2. Consultar, pedir y el hook

```typescript
import * as Location from 'expo-location';
const actual = await Location.getForegroundPermissionsAsync();
const respuesta = await Location.requestForegroundPermissionsAsync();
const [permiso, pedirPermiso, consultarPermiso] = Location.useForegroundPermissions();
```

#### a) ¿Qué diferencia hay entre `get...PermissionsAsync()` y `request...PermissionsAsync()`? ¿Cuál puede mostrar un diálogo?
- **Diferencia:** `getForegroundPermissionsAsync()` es una consulta pasiva: verifica el estado actual del permiso en el sistema operativo sin interactuar con el usuario ni alterar la pantalla. En cambio, `requestForegroundPermissionsAsync()` es una solicitud activa: si el permiso está en estado "sin decidir" o "preguntable", le ordena al sistema operativo que despliegue el diálogo interactivo para que el usuario responda.
- **Cuál muestra diálogo:** **`requestForegroundPermissionsAsync()`** es el único que puede desplegar el diálogo nativo.

#### b) El hook devuelve tres elementos. ¿Qué es cada uno? ¿Qué vale `permiso` en el primer render y qué tiene que mostrar la pantalla mientras tanto?
- **Los tres elementos:**
  1. `permiso`: Objeto de estado actual (`PermissionResponse | null`) que contiene `{ status, granted, canAskAgain, expires, ... }`.
  2. `pedirPermiso`: Función asíncrona para solicitar el permiso activamente (equivalente a `request...Async()`).
  3. `consultarPermiso`: Función asíncrona para reconsultar pasivamente el estado en el sistema operativo (equivalente a `get...Async()`), ideal para actualizar la pantalla al regresar de Ajustes.
- **Valor en el primer render:** `permiso` vale **`null`** (la consulta al sistema es asíncrona y no finaliza en el renderizado inicial).
- **Qué debe mostrar la pantalla mientras tanto:** Un indicador de carga o spinner (`<ActivityIndicator />`) para evitar renderizar componentes condicionales prematuramente o generar saltos visuales en la interfaz.

#### c) Si `canAskAgain` es `false`, ¿qué pasa al llamar a `request...()`? ¿Qué problema aparece si se lo llama en un bucle?
- Si `canAskAgain` es `false`, la llamada a `request...()` no despliega ningún diálogo y retorna de inmediato con `{ status: 'denied', granted: false, canAskAgain: false }`.
- Si se lo invoca dentro de un bucle o en un `useEffect` mal planteado sin control de dependencias, la app entra en un **bucle infinito de llamadas asíncronas** y re-renders, consumiendo el 100% del hilo de JavaScript, sobrecalentando el dispositivo y congelando la interfaz por completo.

---

### D3. Leé la respuesta

| Respuesta | Qué hace la app |
| :--- | :--- |
| `null` | Muestra un indicador de carga (`ActivityIndicator`); espera a que el hook resuelva la comprobación asíncrona antes de renderizar la vista. |
| `{ status: 'granted', granted: true }` | Habilita y ejecuta de inmediato la funcionalidad protegida (muestra la vista de cámara, lee coordenadas del GPS, etc.). |
| `{ status: 'undetermined', canAskAgain: true }` | Muestra la pantalla previa o el botón contextual con llamado a la acción para que el usuario presione y se dispare el diálogo del sistema. |
| `{ status: 'denied', canAskAgain: true }` | Ofrece la vía alternativa (ingreso manual, selector de sector) y mantiene visible el botón explicativo permitiendo al usuario volver a intentar cuando lo desee. |
| `{ status: 'denied', canAskAgain: false }` | Deshabilita el intento de diálogo nativo; ofrece la alternativa funcional y muestra un botón que guíe a la persona a la pantalla de Ajustes del sistema (`Linking.openSettings()`). |
| `{ status: 'granted', accessPrivileges: 'limited' }` | Opera con normalidad utilizando únicamente las fotos seleccionadas por el usuario, ofreciendo opcionalmente una opción para gestionar o agregar más fotos. |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Opera en modo de precisión aproximada; muestra una etiqueta informativa de "Ubicación aproximada" sin forzar ni esperar coordenadas milimétricas. |

#### ¿Cuáles son los dos campos que deciden casi todo? ¿Qué pregunta responde cada uno?
1. **`status`** (o `granted`): Responde a la pregunta:  
   *“¿Tengo autorización para utilizar este recurso ahora mismo?”* (Valores: `'granted'`, `'denied'`, `'undetermined'`).
2. **`canAskAgain`**: Responde a la pregunta:  
   *“¿Tengo la posibilidad de mostrarle el diálogo nativo del sistema al usuario si pulsa el botón?”* (Valores: `true` = se puede mostrar el diálogo; `false` = el sistema lo tiene bloqueado y requiere ir a Ajustes).

---

### D4. Simulación del ciclo completo

**Android 14, app recién instalada, `expo-location`:**

| # | Acción | `status` | `canAskAgain` | ¿Diálogo? |
| :-: | :--- | :---: | :---: | :---: |
| 1 | `getForegroundPermissionsAsync()` | `'undetermined'` | `true` | **No** (solo consulta pasiva) |
| 2 | `requestForegroundPermissionsAsync()` → “No permitir” | `'denied'` | `true` | **Sí** (1° diálogo) |
| 3 | `requestForegroundPermissionsAsync()` → “No permitir” | `'denied'` | `false` | **Sí** (2° diálogo consecutivo) |
| 4 | `requestForegroundPermissionsAsync()` | `'denied'` | `false` | **No** (bloqueado por sistema) |
| 5 | `Linking.openSettings()` → habilita “Mientras la app está en uso” → vuelve y la app consulta | `'granted'` | `true` | **No** (consulta pasiva tras volver) |
| 6 | Igual que el 5, pero la app no vuelve a consultar: ¿qué muestra? | `'denied'` *(en memoria)* | `false` *(en memoria)* | **No** (muestra la pantalla desactualizada de "bloqueado / denegado") |

#### Repetición en iOS:
- **Pasos en iOS:**
  - Paso 1: `undetermined`, `canAskAgain: true`, Sin diálogo.
  - Paso 2: Aparece diálogo nativo. El usuario toca "No permitir". Devuelve `status: 'denied'`, `canAskAgain: false`.
  - Paso 3: Al llamar a `request...()`, devuelve de inmediato `status: 'denied'`, `canAskAgain: false`. **No muestra diálogo**.
  - Paso 4: Devuelve de inmediato `status: 'denied'`, `canAskAgain: false`. **No muestra diálogo**.
- **¿En qué paso cambia el resultado y por qué?:** Cambia en el **Paso 3**. En iOS, la política del sistema solo otorga **un único intento**. Tras el primer rechazo en el Paso 2, el permiso queda bloqueado permanentemente (`canAskAgain: false`). En el paso 3 iOS ya no muestra diálogo, mientras que Android 14 todavía permitía un segundo intento.
- **¿Qué pasa en iOS si la persona elige “Permitir una vez” y después cierra y reabre la app?:** La autorización expira al terminar la sesión. Cuando la app vuelve a abrirse y consulta el estado, el sistema devuelve `status: 'undetermined'` con `canAskAgain: true`. Si la app vuelve a llamar a `request...()`, iOS desplegará nuevamente el diálogo al usuario.

---

### D5. Configurar app.json

Configuración del bloque `expo.plugins` y propiedades de `expo.android` que cumplen con las 3 condiciones:
1. Lee códigos QR sin grabar video (sin micrófono en iOS y sin `RECORD_AUDIO` en Android).
2. Usa la ubicación solo en primer plano para mostrar puntos de reciclaje cercanos.
3. No contiene `SYSTEM_ALERT_WINDOW` en el manifiesto final.

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu cámara para escanear el código QR del aula y leer su identificador.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para mostrarte los puntos de reciclaje más cercanos a tu posición.",
          "isAndroidBackgroundLocationEnabled": false
        }
      ]
    ],
    "android": {
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ],
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.ACCESS_BACKGROUND_LOCATION"
      ]
    }
  }
}
```

#### ¿Por qué `expo-camera` agrega `RECORD_AUDIO` en Android aunque la app no grabe sonido?
Porque la librería nativa de `expo-camera` incluye soporte integral para captura de video con sonido mediante `CameraView.recordAsync()`. Por defecto, su manifiesto nativo declara `<uses-permission android:name="android.permission.RECORD_AUDIO"/>`. Al fusionarse los manifiestos durante el build de Android, dicha directiva se incorpora automáticamente al binario a menos que se configure `"recordAudioAndroid": false` en el plugin o se remueva explícitamente a través de `blockedPermissions`.

---

### D6. Expo Go no es tu app

#### a) ¿Por qué tus textos de propósito no aparecen cuando probás en Expo Go?
Porque Expo Go es una aplicación nativa precompilada y firmada por el equipo de Expo. En iOS, los diálogos de permisos leen las cadenas de propósito declaradas en el `Info.plist` del binario de Expo Go, ignorando las configuraciones personalizadas de nuestro `app.json`.

#### b) ¿Qué se puede probar en Expo Go y qué necesita una development build?
- **Se puede probar en Expo Go:**
  - Apertura básica de cámara y lectura de códigos QR (con los diálogos propios de Expo Go).
  - Consulta y solicitud de ubicación en primer plano.
  - Selección de imágenes desde el Photo Picker del sistema (`expo-image-picker`).
  - Notificaciones locales programadas en primer plano.
- **Requiere Development Build:**
  - Recepción de notificaciones push remotas con credenciales FCM nativas en Android.
  - Ubicación continua en segundo plano (`ACCESS_BACKGROUND_LOCATION` con tareas en background de `expo-task-manager`).
  - Verificación del comportamiento real de `blockedPermissions` en el `AndroidManifest.xml`.
  - Visualización de los textos de propósito personalizados en los diálogos nativos de iOS.
  - Integración de módulos nativos de terceros no incluidos en el runtime base de Expo Go.

#### c) Escribí los comandos para ver los archivos nativos generados y para compilar una development build en Android:
- **Ver archivos nativos generados (prebuild):**
  ```bash
  npx expo prebuild --clean
  ```
- **Compilar una development build en Android:**
  - Localmente:
    ```bash
    npx expo run:android
    ```
  - En la nube con EAS Build:
    ```bash
    eas build --profile development --platform android
    ```

#### d) ¿Cómo volvés un permiso a “sin decidir” sin reinstalar, en Android (adb) y en el simulador de iOS (xcrun simctl)?
- **En Android con adb:**
  ```bash
  adb shell pm reset-permissions <nombre.del.paquete>
  ```
  *(O revocar un permiso puntual: `adb shell pm revoke <nombre.del.paquete> android.permission.CAMERA`)*
- **En el simulador de iOS con xcrun simctl:**
  ```bash
  xcrun simctl privacy booted reset all <bundle.identifier>
  ```
  *(O resetear un permiso específico: `xcrun simctl privacy booted reset camera <bundle.identifier>`)*

---

## Parte E · Recetas: leer y corregir código

### E1. Encontrá los errores (cámara)

#### Errores detectados en el código provisto:
1. **Crash en el renderizado inicial:** `permiso` es `null` en el primer ciclo de vida del componente. La evaluación directa `if (permiso.status === 'granted')` produce un error irrecuperable: `TypeError: Cannot read property 'status' of null`.
2. **Sin manejo del estado bloqueado:** Si el permiso fue rechazado de forma permanente (`canAskAgain: false`), la función `pedirPermiso()` no hace nada ni despliega diálogo; el usuario queda atrapado sin saber por qué la cámara no abre ni cuenta con un botón para ir a Ajustes.
3. **Falta de camino alternativo:** La pantalla no ofrece la posibilidad de ingresar el código del aula manualmente si la persona decide no usar la cámara o si la cámara no funciona.
4. **Semántica incorrecta y falta de actualización al volver:** El botón en la explicación dice "Permitir" en lugar de "Continuar", y no se implementa una revisión con `AppState` al regresar de Ajustes.

#### Versión corregida completa:
```tsx
import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useRevisarAlVolver } from '../hooks/useRevisarAlVolver';

interface EscanearProps {
  onCodigoDetectado: (codigo: string) => void;
  onCancelar?: () => void;
}

export default function Escanear({ onCodigoDetectado, onCancelar }: EscanearProps) {
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  const [codigoManual, setCodigoManual] = useState('');

  // Revalidar el estado del permiso al regresar de la app de Ajustes
  useRevisarAlVolver(() => {
    consultarPermiso();
  });

  // Estado 1: Cargando (evaluación asíncrona inicial)
  if (!permiso) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.mensaje}>Comprobando permisos de cámara...</Text>
      </View>
    );
  }

  // Estado 2: Concedido (muestra la cámara nativa)
  if (permiso.status === 'granted') {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={({ data }) => {
            if (data) onCodigoDetectado(data);
          }}
        />
        <View style={styles.overlayBottom}>
          <Button title="Ingresar código a mano" color="#374151" onPress={() => setCodigoManual('A-')} />
        </View>
      </View>
    );
  }

  // Estado 3: Bloqueado (se denegó permanentemente; requiere Ajustes)
  if (permiso.status === 'denied' && !permiso.canAskAgain) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.titulo}>Cámara deshabilitada</Text>
        <Text style={styles.mensaje}>
          Has bloqueado el acceso a la cámara. Para escanear el código QR del aula debés habilitar el permiso desde los Ajustes de tu dispositivo.
        </Text>
        <Button title="Abrir Ajustes" color="#2563EB" onPress={() => Linking.openSettings()} />

        <View style={styles.separador} />
        <Text style={styles.subtitulo}>Alternativa sin cámara:</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribí el aula (ej: Aula 102)"
          value={codigoManual}
          onChangeText={setCodigoManual}
        />
        <Button
          title="Confirmar aula manual"
          disabled={!codigoManual.trim()}
          onPress={() => onCodigoDetectado(codigoManual)}
        />
      </View>
    );
  }

  // Estado 4: Preguntable (sin decidir o denegado temporal)
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.titulo}>Acceso a la cámara</Text>
      <Text style={styles.mensaje}>
        Usamos tu cámara para escanear el código QR pegado en la puerta del aula y autocompletar la ubicación del reporte.
      </Text>
      <Button title="Continuar" color="#2563EB" onPress={pedirPermiso} />

      <View style={styles.separador} />
      <Text style={styles.subtitulo}>¿Preferís no usar la cámara?</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribí el aula (ej: Lab 3)"
        value={codigoManual}
        onChangeText={setCodigoManual}
      />
      <Button
        title="Ingresar manualmente"
        disabled={!codigoManual.trim()}
        onPress={() => onCodigoDetectado(codigoManual)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  overlayBottom: { position: 'absolute', bottom: 32, left: 24, right: 24 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12, textAlign: 'center' },
  mensaje: { fontSize: 15, color: '#4B5563', textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  subtitulo: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { width: '100%', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#FFF' },
  separador: { height: 1, width: '100%', backgroundColor: '#E5E7EB', marginVertical: 24 }
});
```

---

### E2. El orden importa (ubicación)

```typescript
export async function activarSeguimiento() {
 const siempre = await Location.requestBackgroundPermissionsAsync();
 if (!siempre.granted) return false;
 const enUso = await Location.requestForegroundPermissionsAsync();
 return enUso.granted;
}
```

#### a) ¿Qué está mal? ¿Qué ocurre en iOS y qué ocurre en Android 11+?
- **El error:** Invierte el orden lógico y reglamentario de permisos solicitando primero segundo plano (*Background*) antes de haber obtenido el permiso de primer plano (*Foreground*).
- **Qué ocurre en iOS:** iOS prohíbe solicitar directamente la autorización de segundo plano en frío; exige que la app disponga previamente de la autorización "Al usar la app". Si se pide directamente en frío, la solicitud falla o el sistema degrada la solicitud a un diálogo básico.
- **Qué ocurre en Android 11+:** El sistema operativo arroja inmediatamente una excepción `IllegalArgumentException` y la app crashea. Las directrices de Android exigen de forma taxativa que `ACCESS_BACKGROUND_LOCATION` se solicite como un paso independiente y posterior a la obtención de `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`.

#### b) Función corregida:
```typescript
import * as Location from 'expo-location';

export async function activarSeguimiento(): Promise<boolean> {
  // 1. Solicitar primero la ubicación en primer plano
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) {
    return false;
  }

  // 2. Con primer plano concedido, solicitar la ampliación a segundo plano
  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```

#### c) Función `obtenerUbicacion()` que contemple Android e iOS y no rompa la app:
```typescript
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface ResultadoUbicacion {
  latitud: number;
  longitud: number;
  aproximada: boolean;
}

export async function obtenerUbicacion(): Promise<ResultadoUbicacion | null> {
  try {
    const estado = await Location.getForegroundPermissionsAsync();
    let concedido = estado.granted;

    if (!concedido && estado.canAskAgain) {
      const peticion = await Location.requestForegroundPermissionsAsync();
      concedido = peticion.granted;
    }

    if (!concedido) {
      return null;
    }

    const posicion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // En Android se inspecciona la exactitud del permiso; en iOS o Android se evalúa el margen de error
    const esAproximada =
      (Platform.OS === 'android' && (estado as any)?.android?.accuracy === 'coarse') ||
      (posicion.coords.accuracy !== null && posicion.coords.accuracy > 100);

    return {
      latitud: posicion.coords.latitude,
      longitud: posicion.coords.longitude,
      aproximada: Boolean(esAproximada),
    };
  } catch (error) {
    // Si el usuario deshabilitó el GPS del teléfono o canceló la petición, se retorna null sin romper la app
    return null;
  }
}
```

#### d) ¿Hace falta segundo plano para “farmacias cercanas”? ¿Qué exige Google Play si lo pedís?
- **¿Hace falta segundo plano?:** **NO**, en absoluto. Una función de farmacias cercanas solo necesita conocer la posición del usuario en el instante en que abre la pantalla o presiona el botón "Buscar".
- **Qué exige Google Play si lo pedís:** Google Play aplica una política de tolerancia cero para el permiso de segundo plano. Exige completar una auditoría exhaustiva de privacidad demostrando en un video que la funcionalidad central de la app depende indefectiblemente de rastrear la ubicación 24/7 sin interacción del usuario. Si la justificación no corresponde estrictamente al tipo de app, Google Play **rechaza o elimina la aplicación** de la tienda.

---

### E3. Notificaciones mudas

#### a) ¿Cuál es la causa más probable? ¿Qué hay que hacer antes de pedir el permiso?
- **Causa más probable:** En Android 8.0+ (API 26+) es requisito técnico obligatorio que toda notificación esté asociada a un **Canal de Notificaciones (*Notification Channel*)**. Si la app no creó un canal antes de emitir notificaciones en Android, el sistema suprime los avisos silenciosamente. Asimismo, en Android 13+ si no se declaró el permiso `POST_NOTIFICATIONS` en el manifiesto, el diálogo nunca se abrirá.
- **Qué hay que hacer antes de pedir el permiso:** Se debe registrar y configurar el canal de notificación mediante `Notifications.setNotificationChannelAsync('nombreCanal', { ... })` antes de solicitar el permiso o emitir alertas.

#### b) ¿Qué pasa con este permiso en Android 12 o anterior?
En Android 12 y versiones anteriores, el permiso de notificaciones no requería confirmación en tiempo de ejecución. Venía concedido de manera automática al momento de instalar la app. El usuario solo podía bloquearlas de forma manual desde el menú de Ajustes del sistema.

#### c) ¿Qué opción de iOS permite recibir notificaciones sin diálogo? ¿Cómo detectás en código ese estado?
- **Opción de iOS:** **Notificaciones provisionales (*Provisional Authorization*)**, solicitadas con:  
  `Notifications.requestPermissionsAsync({ ios: { allowProvisional: true } })`.
- **Cómo detectarlo en código:** La respuesta de permisos entrega `status: 'granted'` y en la propiedad `ios.status` el valor correspondiente a autorización provisional (`IosAuthorizationStatus.PROVISIONAL` o valor numérico `3`).

#### d) ¿En qué momento conviene pedir este permiso? Dá un ejemplo de buen y de mal momento.
- **Momento adecuado:** Pedirlo en contexto (*in-context*), inmediatamente después de que el usuario realiza una acción en la cual espera una confirmación o seguimiento posterior.  
  *Buen ejemplo:* Justo al crear un reporte de mantenimiento o al activar el interruptor *"Avisarme cuando se resuelva mi reporte"*.
- **Mal momento:** Disparar el diálogo de notificaciones de forma intempestiva en el arranque de la app (*splash screen* u *onboarding*), antes de que el usuario conozca la aplicación ni haya interactuado con ella.

---

### E4. Fotos sin pedir permiso

| Necesidad | Herramienta | Permiso requerido |
| :--- | :--- | :--- |
| Elegir una foto de perfil | Android Photo Picker / iOS PHPicker (`ImagePicker.launchImageLibraryAsync`) | **Ninguno (0 permisos)** |
| Sacar una foto en el momento | Cámara del dispositivo (`expo-camera` o `ImagePicker.launchCameraAsync`) | `CAMERA` / `NSCameraUsageDescription` |
| Editor que muestra toda la galería | `expo-media-library` (lector personalizado de carrete) | `READ_MEDIA_IMAGES` (Android 13+), `READ_EXTERNAL_STORAGE` (Android <= 12), `NSPhotoLibraryUsageDescription` (iOS) |
| Adjuntar la foto de un comprobante | Selector del sistema (`ImagePicker.launchImageLibraryAsync` o `DocumentPicker`) | **Ninguno (0 permisos)** |

#### ¿Por qué Google Play restringe `READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO`? ¿Desde cuándo? ¿Qué es “el mejor permiso”?
- **Por qué los restringe:** Para salvaguardar la privacidad de las personas usuarias, impidiendo que aplicaciones comunes puedan escanear, copiar o minar masivamente la totalidad del álbum personal de fotos y videos del usuario.
- **Desde cuándo:** Google Play aplica auditorías estrictas y restricciones obligatorias desde el año **2024 (política para Android 14)**.
- **¿Qué es “el mejor permiso”?:** **El mejor permiso es el que no se pide (*Zero-permission principle*)**. Consiste en utilizar herramientas intermediadas por el sistema operativo (como el Photo Picker), donde el usuario conserva el control absoluto, selecciona exclusivamente el elemento deseado y la app nunca accede ni solicita derechos sobre la galería global.

---

### E5. Volver de Ajustes

Completá los espacios del hook:
```typescript
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = /inactive|background/.test(anterior.current);
      if (estabaAfuera && nuevo === 'active') revisar();
      anterior.current = nuevo;
    });

    return () => sub.remove();
  }, [revisar]);
}
```

#### a) ¿Por qué los hooks de Expo no se enteran solos de que el permiso cambió en Ajustes?
Porque la modificación del permiso ocurre en un proceso externo ajeno a nuestra app (la aplicación del sistema Ajustes/Configuración) mientras nuestra aplicación permanece en segundo plano o suspendida en memoria. Al regresar a la app, el motor de React Native no experimenta ningún re-renderizado automático por sí solo; las variables de estado conservan los valores antiguos en memoria a menos que nos suscribamos al ciclo de vida con `AppState` y ejecutemos una consulta pasiva al reactivarse la app.

#### b) ¿Qué función del hook de cámara le pasarías a `useRevisarAlVolver`?
Le pasarías la función pasiva de reconsulta: **`consultarPermiso`** (el tercer elemento devuelto por `useCameraPermissions()`).

#### c) ¿Por qué no conviene guardar el estado del permiso en un store global “para siempre”?
Porque el estado de un permiso es **dinámico y volátil**: la persona usuaria puede minimizar la app, ingresar a los Ajustes del sistema y revocar el permiso en cualquier momento, o el propio sistema operativo puede revocarlo por desuso prolongado (*permission auto-reset* en Android 11+). Si la app persiste un booleano estático en un store global de forma indefinida, asumirá que tiene acceso cuando en realidad fue revocado, desencadenando fallos e inconsistencias de ejecución.

---

## Parte F · Buenas prácticas y tiendas

### F1. Pedir en contexto

| App y permiso | ¿Cuándo pedirlo? | Alternativa si lo deniegan |
| :--- | :--- | :--- |
| **Delivery · ubicación** | Al momento de presionar "Entregar en mi ubicación actual" dentro de la pantalla de dirección. | Ofrecer un campo de búsqueda de texto para escribir calle, número y barrio manualmente. |
| **Billetera virtual · cámara** | Al pulsar el botón "Escanear código QR para pagar". | Permitir ingresar manualmente el alias, CBU/CVU o el código alfanumérico de pago. |
| **Red social · contactos** | Al ingresar a la sección "Encontrar amigos" y presionar voluntariamente "Sincronizar mi libreta de contactos". | Permitir buscar amigos por nombre de usuario, correo electrónico o compartir un enlace de perfil. |
| **Mensajería · micrófono** | Al mantener presionado el ícono del micrófono para grabar una nota de voz. | Continuar comunicándose por texto escrito, emojis o adjuntar audios pregrabados con el selector de archivos. |
| **Turnos médicos · notificaciones** | Inmediatamente después de confirmar con éxito la reserva de un turno médico. | Mostrar los turnos programados en una pestaña visible de la app ("Mis Turnos") y ofrecer recordatorios por SMS o e-mail. |
| **Editor de fotos · galería completa** | Al acceder al organizador / navegador avanzado interno de fotos de la app. | Emplear el selector nativo del sistema (Photo Picker) para que el usuario escoja individualmente las fotos que desea editar. |

#### ¿Por qué pedir cuatro permisos apenas se abre la app “entrena el No permitir automático”?
Porque el usuario experimenta una sobrecarga cognitiva y una sensación de desconfianza al recibir una seguidilla invasiva de alertas emergentes sin haber entendido aún qué valor le ofrece la aplicación (*fatiga de permisos*). Ante la incertidumbre, el reflejo defensivo natural de los usuarios es presionar apresuradamente "No permitir" o "Denegar" en todos los carteles para desbloquear la pantalla, inhabilitando funciones esenciales de la app de forma irreversible.

---

### F2. La pantalla previa

#### a) ¿Qué tres elementos tiene una buena pantalla previa al diálogo del sistema?
1. **Explicación clara de contexto y beneficio tangible:** Redactada con transparencia, indicando qué recurso se solicita y qué ventaja directa obtendrá la persona usuaria (molde *"Usamos tu X para Y"*).
2. **Llamado a la acción único y afirmativo:** Un botón bien destacado con la leyenda "Continuar".
3. **Mención explícita sobre el control del usuario:** Una aclaración informando que la decisión puede modificarse o revocarse en cualquier momento desde los Ajustes del dispositivo.

#### b) ¿Por qué el botón debe decir “Continuar” y no “Permitir”?
Porque la pantalla previa es un componente propio de la aplicación y **carece de autoridad para conceder el permiso**. El otorgamiento real lo realiza exclusivamente el sistema operativo en el diálogo que se abrirá inmediatamente después. Utilizar "Permitir" en la pantalla previa engaña al usuario haciéndole creer que ya concedió el permiso, provocándole frustración o extrañeza al ver surgir un segundo diálogo idéntico. "Continuar" expresa con honestidad que se avanza al siguiente paso del proceso.

#### c) ¿Qué dice la pauta 5.1.1(iv) de Apple sobre botones como “Ahora no” o “Cerrar” en esa pantalla?
La pauta 5.1.1(iv) de Apple dictamina que las aplicaciones no deben confundir ni crear interfaces que compitan o desvirtúen los controles del sistema. No se debe implementar una falsa pantalla de elección con opciones ambiguas como "Ahora no" o "Cerrar" que desalienten u obstaculicen el libre discernimiento del usuario; la decisión de otorgar o denegar pertenece de manera exclusiva al diálogo oficial provisto por iOS.

#### d) ¿Cómo cambia la pantalla si el permiso ya está bloqueado?
- Se sustituye el texto indicando que el permiso fue previamente denegado y que el sistema impide desplegar un nuevo diálogo en la app.
- El botón "Continuar" se transforma en **"Abrir Ajustes"**, el cual invoca `Linking.openSettings()` para llevar al usuario a la sección de configuración de la app en el dispositivo.
- Se acompaña de un instructivo breve con los pasos a seguir dentro de Ajustes.

---

### F3. Mínimo privilegio

#### a) Ubicación precisa o aproximada para “puntos de reciclaje de tu barrio”:
- **Opción elegida:** **Ubicación aproximada**.
- **Justificación:** Para calcular y listar los puntos de reciclaje en un radio barrial es suficiente una precisión de 1 a 3 km. No se requiere precisión milimétrica, protegiendo la privacidad de la persona y reduciendo sustancialmente el consumo de batería.

#### b) Ubicación “en uso” o “siempre” para “registrar una carrera con el celular en el bolsillo”:
- **Opción elegida:** **Ubicación “en uso” con servicio en primer plano (*Foreground Service*)**.
- **Justificación:** Una carrera activa es una actividad transitoria en curso. No requiere permiso de "Siempre" (24/7). Se maneja adecuadamente con la app activa o respaldada por una notificación visible y persistente en segundo plano en Android y actualizaciones de fondo en iOS, respetando el mínimo privilegio y evitando el estricto veto de las tiendas.

#### c) Selector del sistema o permiso de galería para “subir la foto del DNI”:
- **Opción elegida:** **Selector del sistema (*System Photo Picker*)**.
- **Justificación:** Para adjuntar un único documento no existe justificativo técnico para pedir acceso a la galería entera. El selector nativo del sistema opera con **cero permisos** y garantiza que la app solo reciba la fotografía seleccionada por el usuario.

#### d) `expo-camera` con o sin micrófono para “escanear el QR del aula”:
- **Opción elegida:** **Sin micrófono (`microphonePermission: false`, `recordAudioAndroid: false`)**.
- **Justificación:** La lectura de un código QR es un procedimiento estrictamente óptico. Solicitar acceso al micrófono para leer un código de barras despierta fundada desconfianza en el usuario y viola de forma directa el principio de mínimo privilegio.

---

### F4. Tiendas

#### a) Nombrá dos requisitos de Google Play y dos de App Store relacionados con permisos y privacidad:
- **Google Play:**
  1. Completar obligatoriamente la *Declaración de Permisos Sensibles* en la consola de Google Play, aportando video demostrativo si se solicitan permisos como ubicación en segundo plano o alarmas exactas.
  2. Implementar selectores de medios del sistema en reemplazo de permisos globales de almacenamiento (`READ_MEDIA_IMAGES`), restringiendo estos últimos a editores de fotos profesionales.
- **App Store (Apple):**
  1. Incluir obligatoriamente cadenas de propósito claras, transparentes y no genéricas (`NS...UsageDescription`) en el `Info.plist` para cada API sensible invocada por la app o sus librerías.
  2. Implementar el diálogo obligatorio del framework *App Tracking Transparency (ATT)* si la aplicación realiza seguimiento entre aplicaciones o sitios web de terceros con fines publicitarios.

#### b) ¿Qué es el manifiesto de privacidad (`PrivacyInfo.xcprivacy`) y dónde se configura en Expo?
- **¿Qué es?:** Es un archivo estandarizado introducido por Apple en iOS 17 para auditar la privacidad del binario y de todos sus SDKs. Declara formalmente las categorías de datos personales recolectados y las razones autorizadas (*Required Reason APIs*) para el uso de APIs del sistema como marcas de tiempo de archivos, espacio en disco o `UserDefaults`.
- **Dónde se configura en Expo:** Se configura en `app.json` en la propiedad `expo.ios.privacyManifests` utilizando los Config Plugins correspondientes.

#### c) ¿Qué suma Android 17 y qué va a exigir Google Play desde el 27/01/2027 a las apps que hoy piden `READ_CONTACTS`?
- **Qué suma Android 17:** Incorpora el nuevo **Selector de Contactos del Sistema (*Contact Picker API*)**, permitiendo al usuario compartir interactivamente un único contacto o número telefónico sin otorgar acceso a la libreta entera.
- **Qué exigirá Google Play:** Exigirá la migración obligatoria al Selector de Contactos para funciones comunes (como invitar contactos o realizar transferencias), prohibiendo la solicitud del permiso global `READ_CONTACTS` salvo en aplicaciones cuya función primaria sea la administración integral de contactos.

---

### F5. Errores comunes

#### a) La consola de Xcode muestra: “This app has crashed because it attempted to access privacy-sensitive data without a usage description.”
- **Causa:** La aplicación intentó invocar una API nativa protegida (como cámara o GPS) pero el archivo `Info.plist` no contenía la clave de propósito requerida (por ejemplo, `NSCameraUsageDescription`).
- **Solución:** Configurar en `app.json` el plugin correspondiente del módulo con su texto de propósito o agregarlo directamente en `expo.ios.infoPlist.NSCameraUsageDescription`.

#### b) “En Expo Go anda, en la build no”: en la development build la cámara se deniega sin mostrar ningún diálogo.
- **Causa:** En Expo Go la cámara funcionaba porque el binario general de Expo Go ya incluía el permiso en su manifiesto. En la development build propia, al no declarar el plugin de `expo-camera` o encontrarse bloqueado, el archivo `AndroidManifest.xml` no incluyó la etiqueta `<uses-permission android:name="android.permission.CAMERA" />`.
- **Solución:** Asegurar que `app.json` incluya el plugin `["expo-camera", { "cameraPermission": "..." }]` y verificar que `android.permission.CAMERA` no figure en el arreglo `blockedPermissions`.

#### c) Después de habilitar la ubicación en Ajustes, la app sigue diciendo “bloqueado”.
- **Causa:** Desincronización del ciclo de vida. La app no detectó el cambio de estado porque el componente no está suscrito a los eventos de `AppState` al pasar de segundo plano a primer plano.
- **Solución:** Implementar el hook `useRevisarAlVolver` suscrito a `AppState.addEventListener('change', ...)` que ejecute la función de reconsulta pasiva (`consultarPermiso()` o `getForegroundPermissionsAsync()`) cuando el estado vuelva a `'active'`.

#### d) La pantalla queda en “Pidiendo permiso…” para siempre porque el código llama a `request...()` cada vez que se renderiza.
- **Causa:** Invocación incondicional de la función de solicitud asíncrona en el cuerpo del componente o dentro de un `useEffect` con dependencias que cambian en cada ciclo, disparando un ciclo infinito de peticiones.
- **Solución:** Disparar `request...()` únicamente ante un evento intencional del usuario (propiedad `onPress` de un botón) o dentro de un `useEffect` con dependencias vacías `[]` solo para la consulta inicial.

#### e) Una app de turnos no permite entrar a ninguna pantalla si se deniegan las notificaciones.
- **Causa:** Implementación abusiva de barrera de acceso (*permission gatekeeper*). La app condiciona la navegación al otorgamiento de un permiso optativo, violando los lineamientos de Apple y Google.
- **Solución:** Desacoplar la navegación de los permisos. Si el usuario deniega las notificaciones, permitirle utilizar la app con total normalidad y proveer canales alternativos para sus turnos, tales como una bandeja de avisos dentro de la app o recordatorios por correo electrónico.
