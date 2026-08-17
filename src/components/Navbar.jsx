import logo from "../assets/logo.png"

export const Navbar = ({ pantalla, onNavegar, onCerrarSesion }) => (
    <header className="home-navbar">
        <div className="home-navbar-content">
            <button
                className="home-brand home-brand-button"
                onClick={() => onNavegar("inicio")}
            >
                <img
                    src={logo}
                    alt="Logo Entre Destinos"
                    className="home-logo"
                />
                <div>
                    <h3>Entre Destinos</h3>
                    <span>Online Travel Agency</span>
                </div>
            </button>

            <nav
                className="navbar-main-menu"
                aria-label="Navegación principal"
            >
                <button
                    className={pantalla === "inicio" ? "navbar-menu-active" : ""}
                    onClick={() => onNavegar("inicio")}
                >
                    Inicio
                </button>

                <button
                    className={
                        pantalla === "explorar" || pantalla === "destino"
                            ? "navbar-menu-active"
                            : ""
                    }
                    onClick={() => onNavegar("explorar")}
                >
                    Explorar
                </button>

                <button
                    className={pantalla === "comunidad" ? "navbar-menu-active" : ""}
                    onClick={() => onNavegar("comunidad")}
                >
                    Comunidad
                </button>

                <button
                    className={pantalla === "actividad" ? "navbar-menu-active" : ""}
                    onClick={() => onNavegar("actividad")}
                >
                    Actividad
                </button>

                <button
                    className={
                        pantalla === "checkout"
                            ? "navbar-menu-active navbar-payment-button"
                            : "navbar-payment-button"
                    }
                    onClick={() => onNavegar("checkout")}
                >
                    Pago
                </button>
            </nav>

            <div className="navbar-user-actions">
                <button
                    className={
                        pantalla === "perfil"
                            ? "profile-button profile-button-active"
                            : "profile-button"
                    }
                    onClick={() => onNavegar("perfil")}
                >
                    Mi perfil
                </button>

                <button
                    type="button"
                    className="profile-button logout-button"
                    onClick={onCerrarSesion}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    </header>
)