// StrictMode ayuda a detectar posibles errores durante el desarrollo
import { StrictMode } from "react"

// createRoot permite cargar la aplicación React en el navegador
import { createRoot } from "react-dom/client"

// Importamos Bootstrap para usar sus estilos
import "bootstrap/dist/css/bootstrap.min.css"

// Importamos nuestros estilos personalizados
import "./index.css"

// Importamos el componente principal
import { App } from "./App.jsx"


// Aquí React carga toda la aplicación dentro del elemento "root"
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
)