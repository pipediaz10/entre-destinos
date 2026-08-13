// useState nos permite guardar información que puede cambiar
import { useState } from "react"

// Importamos las páginas principales
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Home } from "./pages/Home"


export const App = () => {

    // Indica si el usuario ya inició sesión
    const [usuarioActivo, setUsuarioActivo] = useState(false)

    // Controla si mostramos Login o Registro
    const [pantalla, setPantalla] = useState("login")


    // Si el usuario todavía no inició sesión
    if (!usuarioActivo) {

        // Mostramos Crear cuenta
        if (pantalla === "registro") {

            return (
                <Register
                    setPantalla={setPantalla}
                />
            )
        }


        // Por defecto mostramos Login
        return (
            <Login
                setUsuarioActivo={setUsuarioActivo}
                setPantalla={setPantalla}
            />
        )
    }


    // Solo mostramos Home después de iniciar sesión correctamente
    return (
        <Home setUsuarioActivo={setUsuarioActivo} />
    )
}