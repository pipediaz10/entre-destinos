export const Explorar = ({
    busqueda,
    setBusqueda,
    destinos,
    publicaciones,
    onAbrirDestino
}) => (
    <main className="explore-page">
        <section className="explore-header">
            <span className="explore-small">Explorar</span>
            <h2>Encuentra tu próximo destino</h2>
            <p>Busca destinos, lugares o experiencias compartidas por otros viajeros.</p>

            <div className="explore-search">
                <span>🔎</span>
                <input
                    type="text"
                    placeholder="Buscar Costa Rica, México, playa..."
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                />
            </div>
        </section>

        <section className="home-section">
            <div className="section-title">
                <div>
                    <h4>Destinos</h4>
                    <p>Lugares que puedes descubrir</p>
                </div>
            </div>

            {destinos.length === 0 ? (
                <div className="explore-empty">
                    <p>No encontramos destinos con esa búsqueda.</p>
                </div>
            ) : (
                <div className="destinos-grid">
                    {destinos.map((destino) => (
                        <div
                            className="destino-card"
                            key={destino.id}
                            onClick={() => onAbrirDestino(destino)}
                        >
                            <img src={destino.imagen} alt={destino.nombre} />
                            <div className="destino-card-info">
                                <h5>{destino.nombre}</h5>
                                <p>{destino.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        <section className="home-section">
            <div className="section-title">
                <div>
                    <h4>Experiencias de viajeros</h4>
                    <p>Descubre lugares compartidos por la comunidad</p>
                </div>
            </div>

            {publicaciones.length === 0 ? (
                <div className="explore-empty">
                    <p>No encontramos publicaciones con esa búsqueda.</p>
                </div>
            ) : (
                <div className="explore-post-grid">
                    {publicaciones.map((publicacion) => (
                        <div className="explore-post-card" key={publicacion.id}>
                            <img src={publicacion.imagen} alt={publicacion.ubicacion} />
                            <div className="explore-post-info">
                                <div className="explore-user">
                                    <div className="social-avatar">
                                        {publicacion.usuario?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{publicacion.usuario}</strong>
                                        <span>📍 {publicacion.ubicacion}</span>
                                    </div>
                                </div>
                                <p>{publicacion.descripcion}</p>
                                <span className="explore-post-stats">
                                    ♥ {publicacion.likes || 0}{" · "}💬 {publicacion.comentarios || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </main>
)
