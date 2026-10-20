# Trabajos prácticos de React Native

**Alumno: Colman Maximo**

Este repositorio reúne entregas realizadas para la materia de React Native. Incluye un análisis de código y dos aplicaciones móviles desarrolladas con Expo y React Native.

## Trabajos incluidos

### Trabajo Práctico N.º 1 — Análisis y diagnóstico de código

Entrega teórica en formato PDF. Contiene el análisis y diagnóstico de distintos fragmentos de código.

- **Material:** [documento del TP1](./tp1/Trabajo%20Pr%C3%A1ctico%20N%C2%B01%20-%20An%C3%A1lisis%20y%20diagn%C3%B3stico%20de%20fragmentos%20de%20c%C3%B3digo.pdf)
- **Ejecución:** no requiere instalación; se lee con un visor de PDF.

### Trabajo Práctico N.º 2 — Comedor IPF

Aplicación para consultar platos y categorías, buscar opciones, armar un carrito y confirmar pedidos. Incluye el seguimiento del turno y un espacio de cocina para gestionar pedidos, además de pantallas de ayuda.

La navegación está organizada con Expo Router: pestañas para inicio, menú y carrito, junto con pantallas para categorías, búsqueda, confirmación, turnos e ingreso a cocina.

- **Proyecto:** `tp2/comedor-ipf`
- **Documentación del proyecto:** [README del TP2](./tp2/comedor-ipf/README.md)

### Trabajo Práctico N.º 3 — Permisos móviles

Aplicación **Mantenimiento IPF**, pensada para registrar desperfectos edilicios del Instituto Politécnico Formosa. Permite crear reportes, escanear un QR o ingresar el aula manualmente, adjuntar una foto, indicar la ubicación y consultar los reportes y avisos.

El trabajo aborda permisos de cámara, ubicación, notificaciones y micrófono. Los solicita al usar la función correspondiente y ofrece alternativas cuando no se conceden. También incluye material escrito sobre permisos móviles y su configuración en Expo.

- **Proyecto:** [`tp3`](./tp3)
- **Documentación de la aplicación:** [README del TP3](./tp3/README.md)
- **Respuestas teóricas:** [RESPUESTAS.md](./tp3/RESPUESTAS.md)
- **Consigna:** [PDF del TP3](./tp3/TP3_Permisos_Moviles_React_Native_II%20-%20Alumnos.pdf)

## Requisitos para ejecutar las aplicaciones

- Node.js y npm instalados.
- Expo Go en un dispositivo móvil para probar la aplicación escaneando el QR que muestra Expo.
- Dispositivo y computadora en la misma red local si se usa Expo Go.

Instalá las dependencias y ejecutá Expo desde la carpeta del trabajo que quieras probar. No es necesario instalar dependencias en la raíz del repositorio.

### Ejecutar el TP1

El TP1 es un documento de lectura, no una aplicación. Abrí el PDF indicado en su sección.

### Ejecutar el TP2

En PowerShell, desde la raíz del repositorio:

```powershell
Set-Location "tp2\comedor-ipf"
npm install
npx expo start
```

### Ejecutar el TP3

En PowerShell, desde la raíz del repositorio:

```powershell
Set-Location "tp3"
npm install
npx expo start
```

Expo muestra un código QR en la terminal o en la página de desarrollo. Escanealo con Expo Go para abrir la aplicación. También se puede elegir un emulador compatible desde la interfaz de Expo; el simulador de iOS requiere macOS.

> **Nota sobre el TP2:** el archivo comprimido `tp2/comedor-ipf.zip` supera el límite de tamaño de GitHub y no se publica. Además, `tp2/comedor-ipf` está registrado en este repositorio como un enlace a un commit, por lo que sus archivos no se descargan automáticamente al clonar este repositorio. Para ejecutar el trabajo, se necesita obtener por separado la carpeta del proyecto y colocarla en esa ruta.

## Tecnologías

- React Native y Expo
- TypeScript
- Expo Router

---

**Colman Maximo**
