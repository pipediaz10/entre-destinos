import { Actividades } from "./Actividades"

export const DestinoDetalle = ({ destino, onVolver, onVerExperiencias }) => (
    <main className="destination-detail-page">
        <button className="destination-back" onClick={onVolver}>← Volver</button>

        <section className="destination-detail-card">
            <img
                src={destino.imagen}
                alt={destino.nombre}
                className="destination-detail-image"
            />

            <div className="destination-detail-info">
                <span className="destination-small">Destino</span>
                <h1>{destino.nombre}</h1>
                <p>{destino.descripcion}</p>
                <p className="destination-summary">{destino.resumen}</p>

                <div className="destination-travel-info">
                    <div className="destination-travel-card">
                        <h4>☀️ Clima</h4>
                        <p>{destino.clima}</p>
                    </div>

                    <div className="destination-travel-card">
                        <h4>🎭 Cultura y tradiciones</h4>
                        <p>{destino.cultura}</p>
                    </div>

                    <div className="destination-travel-card">
                        <h4>🧳 ¿Qué puedes hacer?</h4>
                        <Actividades actividades={destino.actividades} />
                    </div>
                </div>
            </div>
        </section>

        <section className="destination-extra">
            <h3>Descubre {destino.nombre}</h3>
            <p>
                Encuentra experiencias de otros viajeros, lugares interesantes y opciones
                para comenzar a planear tu viaje.
            </p>
            <button onClick={onVerExperiencias}>Ver experiencias</button>
        </section>
    </main>
)
