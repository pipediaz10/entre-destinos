export const BottomMenu = ({ pantalla, setPantalla }) => (
    <nav className="bottom-menu">
        <button className={pantalla === "inicio" ? "menu-activo" : ""} onClick={() => setPantalla("inicio")}>Inicio</button>
        <button className={pantalla === "explorar" ? "menu-activo" : ""} onClick={() => setPantalla("explorar")}>Explorar</button>
        <button className={pantalla === "comunidad" ? "menu-activo" : ""} onClick={() => setPantalla("comunidad")}>Comunidad</button>
        <button className={pantalla === "actividad" ? "menu-activo" : ""} onClick={() => setPantalla("actividad")}>Actividad</button>
        <button className={pantalla === "checkout" ? "menu-activo" : ""} onClick={() => setPantalla("checkout")}>Pago</button>
        <button className={pantalla === "perfil" ? "menu-activo" : ""} onClick={() => setPantalla("perfil")}>Perfil</button>
    </nav>
)
