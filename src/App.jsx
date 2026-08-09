// useState nos permite guardar información que puede cambiar
import { useState } from "react"

// Importamos las páginas principales
import { Login } from "./pages/Login"
import { Home } from "./pages/Home"


export const App = () => {

    // Esta variable guarda si el usuario inició sesión.
    // Al principio está en false porque todavía no ha ingresado.
    const [usuarioActivo, setUsuarioActivo] = useState(false)


    // Si el usuario todavía no inició sesión, mostramos Login.
    if (!usuarioActivo) {
        return (
            <Login setUsuarioActivo={setUsuarioActivo} />
        )
    }


    // Cuando inicia sesión, mostramos la pantalla principal.
    return (
        <Home />
    )
}