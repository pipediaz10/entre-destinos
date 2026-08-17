export const Paquetes = ({ paquetes, onVerDetalle }) => (
    <section className="home-section">
        <div className="section-title">
            <div>
                <h4>Paquetes recomendados</h4>
                <p>Opciones para comenzar a planear tu viaje</p>
            </div>
            <button className="link-button">Ver todos</button>
        </div>

        <div className="paquetes-grid">
            {paquetes.map((paquete) => (
                <div className="paquete-card" key={paquete.id}>
                    <img src={paquete.imagen} alt={paquete.nombre} />
                    <div className="paquete-info">
                        <span className="paquete-dias">{paquete.dias}</span>
                        <h5>{paquete.nombre}</h5>
                        <p>{paquete.destino}</p>
                        <div className="paquete-bottom">
                            <div>
                                <small>Desde</small>
                                <strong>${paquete.precio}</strong>
                            </div>
                            <button onClick={() => onVerDetalle?.(paquete)}>Ver detalles</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
)
