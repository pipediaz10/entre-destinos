import { useState } from "react"
import { auth } from "../services/firebase"

export const CrearPublicacion = ({ crearPublicacion, fotoPerfil }) => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [ubicacion, setUbicacion] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [imagen, setImagen] = useState("")
    const [mensajePublicacion, setMensajePublicacion] = useState("")

    const enviarPublicacion = async (event) => {
        event.preventDefault()
        setMensajePublicacion("")

        const resultado = await crearPublicacion({ ubicacion, descripcion, imagen })
        setMensajePublicacion(resultado.mensaje)

        if (resultado.ok) {
            setUbicacion("")
            setDescripcion("")
            setImagen("")
            setMostrarFormulario(false)
        }
    }

    const inicialUsuario = auth.currentUser?.displayName?.charAt(0).toUpperCase()
        || auth.currentUser?.email?.charAt(0).toUpperCase()

    return (
        <>
            <div className="crear-publicacion-bar">
                {fotoPerfil ? (
                    <img
                        src={fotoPerfil}
                        alt="Tu perfil"
                        className="social-avatar social-avatar-image"
                    />
                ) : (
                    <div className="social-avatar">{inicialUsuario}</div>
                )}
                <button
                    className="abrir-publicacion"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    + Crear publicación
                </button>
            </div>

            {mostrarFormulario && (
                <form className="real-post-form" onSubmit={enviarPublicacion}>
                    <div className="form-publicacion-titulo">
                        <div>
                            <strong>Crear publicación</strong>
                            <span>Comparte tu experiencia con otros viajeros</span>
                        </div>
                        <button
                            type="button"
                            className="cerrar-formulario"
                            onClick={() => setMostrarFormulario(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="campo-publicacion">
                        <label>Lugar</label>
                        <input
                            type="text"
                            placeholder="Ej: Tamarindo, Costa Rica"
                            value={ubicacion}
                            onChange={(event) => setUbicacion(event.target.value)}
                        />
                    </div>

                    <div className="campo-publicacion">
                        <label>¿Cómo estuvo tu viaje?</label>
                        <textarea
                            placeholder="Cuéntale a la comunidad sobre tu experiencia..."
                            value={descripcion}
                            onChange={(event) => setDescripcion(event.target.value)}
                        />
                    </div>

                    <div className="campo-publicacion">
                        <label>Foto</label>
                        <input
                            type="text"
                            placeholder="Pega el enlace de una fotografía"
                            value={imagen}
                            onChange={(event) => setImagen(event.target.value)}
                        />
                    </div>

                    <div className="post-form-bottom">
                        <span>{mensajePublicacion}</span>
                        <div className="publicacion-buttons">
                            <button
                                type="button"
                                className="cancelar-publicacion"
                                onClick={() => setMostrarFormulario(false)}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="publicar-final">Publicar</button>
                        </div>
                    </div>
                </form>
            )}
        </>
    )
}
