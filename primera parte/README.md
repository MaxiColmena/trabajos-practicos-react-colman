# Comedor IPF - Trabajo Práctico N° 2

## Estructura de Rutas y Navegadores

A continuación se detalla la estructura de carpetas dentro de `src/app` y los navegadores utilizados en cada `_layout`:

```text
src/app/
├── _layout.tsx                     <-- Stack (Raíz, envuelve toda la app y maneja modales)
├── (tabs)/
│   ├── _layout.tsx                 <-- Tabs (Barra inferior con Inicio, Menú y Carrito)
│   ├── index.tsx                   <-- Pantalla de Inicio
│   ├── menu/
│   │   ├── _layout.tsx             <-- Stack anidado para el Menú
│   │   ├── index.tsx               <-- Lista de Platos
│   │   └── [id].tsx                <-- Detalle de Plato
│   └── carrito/
│       ├── _layout.tsx             <-- Stack anidado para el Carrito
│       ├── index.tsx               <-- Mi Carrito
│       └── nota.tsx                <-- Agregar Nota
├── categorias/
│   └── [categoria].tsx             <-- Detalle de Categoría (Stack Screen)
├── buscar.tsx                      <-- Buscador (Stack Screen)
├── confirmar.tsx                   <-- Resumen del Pedido (Modal en Stack Raíz)
├── turno/
│   └── [numero].tsx                <-- Turno Actual (Stack Screen)
├── login.tsx                       <-- Iniciar Sesión (Modal protegido, solo sin sesión)
├── cocina/
│   ├── _layout.tsx                 <-- Drawer (Menú lateral protegido, solo con sesión)
│   ├── index.tsx                   <-- Pedido actual en cola
│   └── atendidos.tsx               <-- Historial de pedidos
├── ayuda/
│   ├── index.tsx                   <-- Índice de Ayuda
│   └── [...slug].tsx               <-- Artículos de Ayuda (Catch-all)
├── pedido.tsx                      <-- Redirección a /carrito
└── +not-found.tsx                  <-- Pantalla Error 404
```

## Justificación: `replace` vs `push` en `/confirmar`

En la pantalla de confirmación, cuando el usuario toca "Confirmar", se utiliza `router.replace({ pathname: '/turno/[numero]' ... })`.
**Razón:** Se usa `replace` en lugar de `push` para que la pantalla de confirmación sea **reemplazada** en la pila por la pantalla de turno. De esta manera, si el usuario presiona el botón "Atrás" desde el turno, no volverá a la pantalla de "Confirmar" (lo cual permitiría enviar el pedido por duplicado por error o ver un carrito vacío en proceso), sino que volverá a la pantalla anterior (menú o inicio). 

## Enlace de Prueba (Deep Link)

Puedes probar abrir el plato 3 directamente en Expo Go utilizando el siguiente enlace (reemplazando `TU_IP` por la IP local mostrada al correr la app, por ej: `192.168.1.10:8081`):

`exp://TU_IP/--/menu/3`

Si la aplicación está compilada (build propio), el deep link nativo sería:
`comedoripf://menu/3`

## Ejecutar el Proyecto

```bash
npx expo start
```
