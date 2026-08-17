# Estructura del proyecto Entre Destinos

Los componentes visuales y funcionales están organizados en una sola carpeta `src/components`.

```text
src/
├── components/
│   ├── Login.jsx
│   ├── Registro.jsx
│   ├── Home.jsx
│   ├── Inicio.jsx
│   ├── Navbar.jsx
│   ├── BottomMenu.jsx
│   ├── Destinos.jsx
│   ├── DestinoDetalle.jsx
│   ├── Actividades.jsx
│   ├── Paquetes.jsx
│   ├── Checkout.jsx
│   ├── Explorar.jsx
│   ├── Comunidad.jsx
│   ├── CrearPublicacion.jsx
│   ├── PublicacionCard.jsx
│   ├── Perfil.jsx
│   └── usePublicaciones.js
├── data/
│   ├── destinos.js
│   └── paquetes.js
├── services/
│   └── firebase.js
├── utils/
│   └── normalizarTexto.js
├── styles/
│   └── index.css
├── assets/
│   └── logo.png
├── App.jsx
└── main.jsx
```

## Componentes principales

- `Login.jsx`: inicio de sesión.
- `Registro.jsx`: creación de cuentas.
- `Navbar.jsx`: barra superior.
- `Destinos.jsx`: tarjetas/listado de destinos.
- `DestinoDetalle.jsx`: detalle de un destino.
- `Actividades.jsx`: actividades de un destino.
- `Paquetes.jsx`: paquetes de viaje.
- `Checkout.jsx`: flujo preparado para reservar/comprar un paquete.
- `Comunidad.jsx`: sección de publicaciones de viajeros.
- `Explorar.jsx`: búsqueda y exploración.
- `Perfil.jsx`: perfil del usuario.
- `Home.jsx`: coordina las pantallas principales.

Las carpetas `data`, `services`, `utils`, `styles` y `assets` se mantienen separadas porque no contienen componentes React.
