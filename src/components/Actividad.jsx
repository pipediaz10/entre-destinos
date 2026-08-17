const iconosActividad = {
    publicacion: "🖼️",
    eliminacion: "🗑️",
    like: "♥",
    comentario: "💬",
    guardado: "🔖",
    reserva: "✈️",
    perfil: "👤"
}

const formatearFecha = (fecha) => new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short"
}).format(new Date(fecha))

export const Actividad = ({ actividad, onLimpiarActividad }) => (
    <main className="home-content activity-page">
        <div className="activity-heading">
            <div>
                <span className="checkout-eyebrow">Tu historial</span>
                <h2>Actividad</h2>
                <p>Aquí puedes revisar tus acciones recientes dentro de Entre Destinos.</p>
            </div>

            {actividad.length > 0 && (
                <button
                    type="button"
                    className="activity-clear-button"
                    onClick={onLimpiarActividad}
                >
                    Limpiar actividad
                </button>
            )}
        </div>

        {actividad.length === 0 ? (
            <div className="activity-empty">
                <div className="activity-empty-icon">🧭</div>
                <h3>Aún no tienes actividad</h3>
                <p>Cuando publiques, comentes, guardes contenido o reserves un viaje, aparecerá aquí.</p>
            </div>
        ) : (
            <div className="activity-list">
                {actividad.map((item) => (
                    <article className="activity-item" key={item.id}>
                        <div className="activity-icon">
                            {iconosActividad[item.tipo] || "•"}
                        </div>
                        <div className="activity-item-content">
                            <strong>{item.titulo}</strong>
                            {item.detalle && <p>{item.detalle}</p>}
                            <span>{formatearFecha(item.fecha)}</span>
                        </div>
                    </article>
                ))}
            </div>
        )}
    </main>
)
