// Importamos el logo oficial de Entre Destinos
import logo from "../assets/logo.png"


export const Login = ({ setUsuarioActivo }) => {

    // Esta función se ejecuta cuando se envía el formulario
    const iniciarSesion = (event) => {

        // Evita que la página se recargue
        event.preventDefault()

        // Por ahora simulamos que el usuario inició sesión.
        // Más adelante esta parte se conectará con Firebase.
        setUsuarioActivo(true)
    }


    return (
        <div className="login-page">

            <div className="login-card">

                {/* Parte superior con el logo */}
                <div className="login-header">

                    <img
                        src={logo}
                        alt="Logo Entre Destinos"
                        className="login-logo"
                    />

                    <h2>Bienvenido</h2>

                    <p>
                        Inicia sesión para continuar explorando
                    </p>

                </div>


                {/* Formulario de inicio de sesión */}
                <form onSubmit={iniciarSesion}>

                    <div className="mb-3">

                        <label className="form-label">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="correo@ejemplo.com"
                            required
                        />

                    </div>


                    <div className="mb-3">

                        <label className="form-label">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Ingrese su contraseña"
                            required
                        />

                    </div>


                    {/* Botón principal */}
                    <button
                        type="submit"
                        className="btn-login"
                    >
                        Iniciar sesión
                    </button>

                </form>


                {/* Opción para crear una cuenta */}
                <div className="login-register">

                    <span>
                        ¿No tienes una cuenta?
                    </span>

                    <span className="crear-cuenta">
                        Crear cuenta
                    </span>

                </div>

            </div>

        </div>
    )
}