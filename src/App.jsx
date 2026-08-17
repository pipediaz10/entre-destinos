import { useState } from "react"
import { Login } from "./components/Login"
import { Registro } from "./components/Registro"
import { Home } from "./components/Home"

export const App = () => {
    const [usuarioActivo, setUsuarioActivo] = useState(false)
    const [pantalla, setPantalla] = useState("login")

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

    return <Home />
}
