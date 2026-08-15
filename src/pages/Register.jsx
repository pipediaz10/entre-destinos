// useState nos permite guardar los datos escritos en el formulario
import { useState } from "react"

// Funciones de Firebase para crear usuario y cerrar la sesión automática
import {
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth"

// Importamos la autenticación que configuramos en firebase.js
import { auth } from "../firebase"

// Importamos el logo de Entre Destinos
import logo from "../assets/logo.png"


export const Register = ({ setPantalla }) => {

    // Guardamos los datos escritos por el usuario
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [confirmarContrasena, setConfirmarContrasena] = useState("")

    // Mensajes para mostrar errores o confirmaciones
    const [error, setError] = useState("")
    const [mensaje, setMensaje] = useState("")


    // Esta función se ejecuta cuando se presiona "Crear cuenta"
    const crearCuenta = async (event) => {

        // Evitamos que la página se recargue
        event.preventDefault()

        // Limpiamos mensajes anteriores
        setError("")
        setMensaje("")


        // Revisamos que las dos contraseñas sean iguales
        if (contrasena !== confirmarContrasena) {

            setError("Las contraseñas no coinciden")
            return
        }


        // Validación sencilla de contraseña
        if (contrasena.length < 6) {

            setError("La contraseña debe tener al menos 6 caracteres")
            return
        }


        try {

            // Creamos el usuario en Firebase
const usuarioCreado = await createUserWithEmailAndPassword(
    auth,
    correo,
    contrasena
)


// Guardamos también el nombre escrito en el formulario
await updateProfile(usuarioCreado.user, {
    displayName: nombre
})


// Cerramos la sesión para que después entre desde Login
await signOut(auth)


            // Firebase inicia sesión automáticamente cuando crea la cuenta.
            // La cerramos porque queremos regresar al Login.
            await signOut(auth)


            // Mostramos mensaje de éxito
            setMensaje("Cuenta creada correctamente")


            // Limpiamos los campos
            setNombre("")
            setCorreo("")
            setContrasena("")
            setConfirmarContrasena("")


            // Después de 1 segundo regresamos al Login
            setTimeout(() => {

                setPantalla("login")

            }, 1000)


        } catch (errorFirebase) {

            // Si el correo ya está registrado
            if (errorFirebase.code === "auth/email-already-in-use") {

                setError("Este correo ya está registrado")

            }
            // Si el correo tiene un formato incorrecto
            else if (errorFirebase.code === "auth/invalid-email") {

                setError("El correo electrónico no es válido")

            }
            // Para cualquier otro error
            else {

                setError("No se pudo crear la cuenta")
            }


            // Mostramos el error en consola para poder revisarlo
            console.error(errorFirebase)
        }
    }


    return (
        <div className="login-page">

            <div className="login-card">


                {/* Encabezado con logo */}
                <div className="login-header">

                    <img
                        src={logo}
                        alt="Logo Entre Destinos"
                        className="login-logo"
                    />

                    <h2>Crear cuenta</h2>

                    <p>
                        Regístrate para comenzar a explorar
                    </p>

                </div>


                {/* Formulario de registro */}
                <form onSubmit={crearCuenta}>


                    {/* Nombre */}
                    <div className="mb-3">

                        <label className="form-label">
                            Nombre
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingrese su nombre"
                            value={nombre}
                            onChange={(event) =>
                                setNombre(event.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Correo */}
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
                            placeholder="Mínimo 6 caracteres"
                            value={contrasena}
                            onChange={(event) =>
                                setContrasena(event.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Confirmar contraseña */}
                    <div className="mb-3">

                        <label className="form-label">
                            Confirmar contraseña
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Repita su contraseña"
                            value={confirmarContrasena}
                            onChange={(event) =>
                                setConfirmarContrasena(event.target.value)
                            }
                            required
                        />

                    </div>


                    {/* Mensaje de error */}
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}


                    {/* Mensaje cuando la cuenta se crea correctamente */}
                    {mensaje && (
                        <div className="alert alert-success">
                            {mensaje}
                        </div>
                    )}


                    {/* Botón para crear la cuenta */}
                    <button
                        type="submit"
                        className="btn-login"
                    >
                        Crear cuenta
                    </button>

                </form>


                {/* Regresar al Login */}
                <div className="login-register">

                    <span>
                        ¿Ya tienes una cuenta?
                    </span>

                    <span
                        className="crear-cuenta"
                        onClick={() => setPantalla("login")}
                    >
                        Iniciar sesión
                    </span>

                </div>

            </div>

        </div>
    )
}