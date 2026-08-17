export const Destinos = ({ destinos, onAbrirDestino, titulo = "Destinos destacados" }) => (
    <section className="home-section">
        <div className="section-title">
            <div>
                <h4>{titulo}</h4>
                <p>Algunos lugares que podrían interesarte</p>
            </div>
            <button className="link-button">Ver todos</button>
        </div>

        <div className="destinos-grid">
            {destinos.map((destino) => (
                <div className="destino-card" key={destino.id} onClick={() => onAbrirDestino(destino)}>
                    <img src={destino.imagen} alt={destino.nombre} />
                    <div className="destino-card-info">
                        <h5>{destino.nombre}</h5>
                        <p>{destino.descripcion}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
)
