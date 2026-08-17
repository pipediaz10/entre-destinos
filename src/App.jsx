import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "./services/firebase"
import { Login } from "./components/Login"
import { Registro } from "./components/Registro"
import { Home } from "./components/Home"

export const App = () => {
    const [usuarioActivo, setUsuarioActivo] = useState(false)
    const [pantalla, setPantalla] = useState("login")

    const cerrarSesion = async () => {
        try {
            await signOut(auth)
            setUsuarioActivo(false)
            setPantalla("login")
        } catch (error) {
            console.error("Error cerrando sesión:", error)
        }
    }

    if (!usuarioActivo) {
        if (pantalla === "registro") {
            return <Registro setPantalla={setPantalla} />
        }

        return (
            <Login
                setUsuarioActivo={setUsuarioActivo}
                setPantalla={setPantalla}
            />
        )
    }

    return <Home onCerrarSesion={cerrarSesion} />
}