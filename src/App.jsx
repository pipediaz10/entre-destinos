import { useState } from "react"

import { Login } from "./pages/Login"
import { Home } from "./pages/Home"
import { Profile } from "./pages/Profile"


export const App = () => {

    // Guarda si el usuario inició sesión
    const [usuarioActivo, setUsuarioActivo] = useState(false)

    // Guarda la página que se está mostrando
    const [paginaActual, setPaginaActual] = useState("inicio")


    // Permite cambiar entre las páginas
    const cambiarPagina = (pagina) => {

        setPaginaActual(pagina)

        // Regresa la pantalla hacia arriba
        window.scrollTo(0, 0)
    }


    // Si todavía no inició sesión, muestra el Login
    if (!usuarioActivo) {

        return (
            <Login
                setUsuarioActivo={setUsuarioActivo}
            />
        )
    }


    // Muestra el perfil
    if (paginaActual === "perfil") {

        return (
            <Profile
                cambiarPagina={cambiarPagina}
            />
        )
    }


    // Muestra la pantalla principal
    return (
        <Home
            cambiarPagina={cambiarPagina}
        />
    )
}