// useState permite guardar los datos escritos por el usuario
import { useState } from "react"

// Función de Firebase para iniciar sesión
import { signInWithEmailAndPassword } from "firebase/auth"

// Importamos la autenticación configurada en firebase.js
import { auth } from "../services/firebase"

// Importamos el logo oficial de Entre Destinos
import logo from "../assets/logo.png"


export const Login = ({
    setUsuarioActivo,
    setPantalla
}) => {

    // Guarda el correo escrito por el usuario
    const [correo, setCorreo] = useState("")

    // Guarda la contraseña escrita por el usuario
    const [contrasena, setContrasena] = useState("")

    // Guarda los mensajes de error
    const [error, setError] = useState("")


    // Esta función se ejecuta cuando presionamos Iniciar sesión
    const iniciarSesion = async (event) => {

        // Evitamos que la página se recargue
        event.preventDefault()

        // Limpiamos mensajes anteriores
        setError("")


        try {

            // Firebase revisa si el correo y contraseña son correctos
            await signInWithEmailAndPassword(
                auth,
                correo,
                contrasena
            )


            // Si Firebase acepta los datos,
            // permitimos entrar a la página principal
            setUsuarioActivo(true)

        } catch (errorFirebase) {

            // Si los datos son incorrectos mostramos un mensaje
            setError("Correo o contraseña incorrectos")

            // Dejamos el error en consola por si necesitamos revisarlo
            console.error(errorFirebase)
        }
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

                    {/* Correo electrónico */}
                    <div className="mb-3">

                        <label className="form-label">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="correo@ejemplo.com"
                            value={correo}
                            onChange={(event) =>
                                setCorreo(event.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Contraseña */}
                    <div className="mb-3">

                        <label className="form-label">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Ingrese su contraseña"
                            value={contrasena}
                            onChange={(event) =>
                                setContrasena(event.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Mensaje si ocurre un error */}
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}


                    {/* Botón principal */}
                    <button
                        type="submit"
                        className="btn-login"
                    >
                        Iniciar sesión
                    </button>

                </form>


                {/* Ir a Crear cuenta */}
                <div className="login-register">

                    <span>
                        ¿No tienes una cuenta?
                    </span>

                    <span
                        className="crear-cuenta"
                        onClick={() => setPantalla("registro")}
                    >
                        Crear cuenta
                    </span>

                </div>

            </div>

        </div>
    )
}