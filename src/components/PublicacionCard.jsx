import { useState } from "react"
import { auth } from "../services/firebase"

export const PublicacionCard = ({
    publicacion,
    cambiarLike,
    agregarComentario,
    cambiarGuardado,
    eliminarPublicacion
}) => {
    const [comentariosAbiertos, setComentariosAbiertos] = useState(false)
    const [comentarioTexto, setComentarioTexto] = useState("")

    const dioLike = publicacion.usuariosLike?.includes(auth.currentUser?.uid)
    const guardada = publicacion.usuariosGuardaron?.includes(auth.currentUser?.uid)
    const esMia = !publicacion.esPredeterminada && publicacion.uid === auth.currentUser?.uid

    const enviarComentario = async () => {
        const agregado = await agregarComentario(publicacion, comentarioTexto)
        if (agregado) setComentarioTexto("")
    }

    const confirmarEliminacion = async () => {
        const confirmar = window.confirm("¿Seguro que quieres eliminar esta publicación?")
        if (!confirmar) return

        const resultado = await eliminarPublicacion(publicacion)
        if (!resultado?.ok) {
            window.alert(resultado?.mensaje || "No se pudo eliminar la publicación")
        }
    }

    return (
        <div className="social-post">
            <div className="social-post-header">
                {publicacion.avatar ? (
                    <img
                        src={publicacion.avatar}
                        alt={publicacion.usuario}
                        className="social-avatar social-avatar-image"
                    />
                ) : (
                    <div className="social-avatar">
                        {publicacion.usuario?.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="social-user-info">
                    <strong>{publicacion.usuario}</strong>
                    <span>📍 {publicacion.ubicacion}</span>
                </div>

                {esMia ? (
                    <button
                        type="button"
                        className="social-delete-button"
                        onClick={confirmarEliminacion}
                    >
                        🗑 Eliminar
                    </button>
                ) : (
                    <button className="social-more" aria-label="Más opciones">•••</button>
                )}
            </div>

            <img
                src={publicacion.imagen}
                alt={publicacion.ubicacion}
                className="social-post-image"
            />

            <div className="social-actions">
                <button
                    className={dioLike ? "social-like social-liked" : "social-like"}
                    onClick={() => cambiarLike(publicacion)}
                >
                    {dioLike ? "♥ Me gusta" : "♡ Me gusta"}
                </button>

                <button onClick={() => setComentariosAbiertos(!comentariosAbiertos)}>
                    💬 Comentar
                </button>

                <button onClick={() => cambiarGuardado(publicacion)}>
                    {guardada ? "✓ Guardado" : "Guardar"}
                </button>
            </div>

            {comentariosAbiertos && (
                <div className="comment-section">
                    <div className="comment-input">
                        <input
                            type="text"
                            placeholder="Escribe un comentario..."
                            value={comentarioTexto}
                            onChange={(event) => setComentarioTexto(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    enviarComentario()
                                }
                            }}
                        />
                        <button onClick={enviarComentario}>Enviar</button>
                    </div>

                    <div className="comments-list">
                        {publicacion.listaComentarios?.map((comentario, index) => (
                            <div className="comment-item" key={`${comentario.fecha || index}-${index}`}>
                                <strong>{comentario.usuario}</strong>
                                <span>{comentario.texto}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="social-post-info">
                <strong>{publicacion.likes || 0} Me gusta</strong>
                <p>
                    <b>{publicacion.usuario}</b>{" "}{publicacion.descripcion}
                </p>
                <button
                    className="social-comments"
                    onClick={() => setComentariosAbiertos(true)}
                >
                    Ver los {publicacion.comentarios || 0} comentarios
                </button>
            </div>
        </div>
    )
}
