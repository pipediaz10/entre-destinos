# Cambios agregados

## Comunidad
- Se agregaron 4 publicaciones predeterminadas con nombres, avatares, fotografías, ubicaciones, likes y comentarios.
- Los posts predeterminados funcionan aunque Firestore esté vacío.
- Se puede dar like, comentar y guardar los posts predeterminados durante la sesión.
- Las publicaciones creadas por el usuario continúan guardándose en Firestore.

## Perfil
- Se agregaron contadores de seguidores y seguidos.
- Se agregaron ejemplos visuales de personas que siguen al usuario y personas que el usuario sigue.
- Los guardados continúan funcionando con las publicaciones reales y las predeterminadas.

## Navbar
- Se agregaron accesos directos a Inicio, Explorar, Comunidad, Pago y Perfil.
- Comunidad ahora tiene su propia pantalla.

## Pago / Checkout
- Se puede entrar desde el botón Pago del navbar.
- Se puede seleccionar cualquiera de los paquetes disponibles.
- Si se entra desde Ver detalles de un paquete, queda preseleccionado.
- El formulario solicita nombre, correo, teléfono, fecha y cantidad de viajeros.
- Incluye métodos de pago demostrativos y un resumen del total.
- Código de prueba: VIAJE10.
- No procesa datos reales de tarjetas.
