import { Destinos } from "./Destinos"
import { Paquetes } from "./Paquetes"

export const Inicio = ({
    destinos,
    paquetes,
    onAbrirDestino,
    onVerPaquete
}) => (
    <main className="home-content">
        <section className="hero-section">
            <div className="hero-text">
                <span className="hero-small">Tu próxima aventura empieza aquí</span>
                <h1>Descubre nuevos destinos</h1>
                <p>
                    Encuentra lugares increíbles, organiza tus viajes, descubre paquetes
                    y comparte experiencias con otros viajeros.
                </p>
                <div className="hero-search">
                    <input type="text" placeholder="¿A dónde quieres viajar?" />
                    <button>Buscar</button>
                </div>
            </div>
        </section>

        <Destinos destinos={destinos} onAbrirDestino={onAbrirDestino} />
        <Paquetes paquetes={paquetes} onVerDetalle={onVerPaquete} />
    </main>
)
