import { useState } from "react"
import { Destinos } from "./Destinos"
import { Paquetes } from "./Paquetes"

export const Inicio = ({
    destinos,
    paquetes,
    onAbrirDestino,
    onVerPaquete,
    onBuscar
}) => {
    const [busqueda, setBusqueda] = useState("")

    const buscarDestino = (event) => {
        event.preventDefault()
        onBuscar(busqueda.trim())
    }

    return (
    <main className="home-content">
        <section className="hero-section">
            <div className="hero-text">
                <span className="hero-small">Tu próxima aventura empieza aquí</span>
                <h1>Descubre nuevos destinos</h1>
                <p>
                    Encuentra lugares increíbles, organiza tus viajes, descubre paquetes
                    y comparte experiencias con otros viajeros.
                </p>
                <form className="hero-search" onSubmit={buscarDestino}>
                    <input
                        type="text"
                        placeholder="¿A dónde quieres viajar?"
                        value={busqueda}
                        onChange={(event) => setBusqueda(event.target.value)}
                    />
                    <button type="submit">Buscar</button>
                </form>
            </div>
        </section>

        <Destinos destinos={destinos} onAbrirDestino={onAbrirDestino} />
        <Paquetes paquetes={paquetes} onVerDetalle={onVerPaquete} />
    </main>
    )
}