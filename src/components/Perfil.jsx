import { useRef, useState } from "react"
import { auth } from "../services/firebase"

const seguidoresDemo = [
    { nombre: "Helena Rodríguez", usuario: "@helena.viaja", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
    { nombre: "Carlos Méndez", usuario: "@carlos.destinos", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" },
    { nombre: "Sofía Vargas", usuario: "@sofia.explorer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" }
]

const seguidosDemo = [
    { nombre: "Marco Salas", usuario: "@marco.nomada", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
    { nombre: "Daniela Mora", usuario: "@daniela.rutas", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" },
    { nombre: "Andrés Solano", usuario: "@andres.trip", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" }
]

export const Perfil = ({
    misPublicaciones,
    publicacionesGuardadas,
    seccionPerfil,
    setSeccionPerfil,
    cambiarGuardado,
    eliminarPublicacion,
    fotoPerfil,
    onActualizarFoto
}) => {
    const inputFotoRef = useRef(null)
    const [mensajeFoto, setMensajeFoto] = useState("")

    const nombreUsuario = auth.currentUser?.displayName || auth.currentUser?.email || "Viajero"
    const inicial = auth.currentUser?.displayName?.charAt(0).toUpperCase()
        || auth.currentUser?.email?.charAt(0).toUpperCase()
        || "V"

    const seleccionarFoto = (event) => {
        const archivo = event.target.files?.[0]
        if (!archivo) return

        if (!archivo.type.startsWith("image/")) {
            setMensajeFoto("Selecciona un archivo de imagen.")
            return
        }

        if (archivo.size > 2 * 1024 * 1024) {
            setMensajeFoto("La imagen debe pesar menos de 2 MB.")
            return
        }

        const lector = new FileReader()
        lector.onload = () => {
            onActualizarFoto(lector.result)
            setMensajeFoto("Foto de perfil actualizada.")
        }
        lector.readAsDataURL(archivo)
    }

    const confirmarEliminar = async (publicacion) => {
        const confirmar = window.confirm("¿Seguro que quieres eliminar esta publicación?")
        if (!confirmar) return
        await eliminarPublicacion(publicacion)
    }

    return (
        <main className="profile-page">
            <section className="profile-header-card">
                <div className="profile-avatar-wrapper">
                    {fotoPerfil ? (
                        <img src={fotoPerfil} alt="Foto de perfil" className="profile-avatar-large profile-avatar-photo" />
                    ) : (
                        <div className="profile-avatar-large">{inicial}</div>
                    )}

                    <input
                        ref={inputFotoRef}
                        type="file"
                        accept="image/*"
                        onChange={seleccionarFoto}
                        className="profile-photo-input"
                    />

                    <button
                        type="button"
                        className="profile-photo-button"
                        onClick={() => inputFotoRef.current?.click()}
                    >
                        Cambiar foto
                    </button>

                    {fotoPerfil && (
                        <button
                            type="button"
                            className="profile-photo-remove"
                            onClick={() => {
                                onActualizarFoto("")
                                setMensajeFoto("Foto eliminada.")
                            }}
                        >
                            Quitar foto
                        </button>
                    )}

                    {mensajeFoto && <small className="profile-photo-message">{mensajeFoto}</small>}
                </div>

                <div className="profile-main-info">
                    <h2>{nombreUsuario}</h2>
                    <span>Viajero en Entre Destinos</span>
                    <div className="profile-stats">
                        <div><strong>{misPublicaciones.length}</strong><span>Publicaciones</span></div>
                        <div><strong>327</strong><span>Seguidores</span></div>
                        <div><strong>184</strong><span>Seguidos</span></div>
                        <div><strong>{publicacionesGuardadas.length}</strong><span>Guardados</span></div>
                    </div>
                </div>
            </section>

            <section className="profile-social-preview">
                <div className="profile-people-card">
                    <div className="profile-people-heading">
                        <div><h4>Seguidores</h4><span>327 personas siguen tu perfil</span></div>
                        <button type="button">Ver todos</button>
                    </div>
                    <div className="profile-people-list">
                        {seguidoresDemo.map((persona) => (
                            <div className="profile-person" key={persona.usuario}>
                                <img src={persona.avatar} alt={persona.nombre} />
                                <div><strong>{persona.nombre}</strong><span>{persona.usuario}</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="profile-people-card">
                    <div className="profile-people-heading">
                        <div><h4>Seguidos</h4><span>184 perfiles que sigues</span></div>
                        <button type="button">Ver todos</button>
                    </div>
                    <div className="profile-people-list">
                        {seguidosDemo.map((persona) => (
                            <div className="profile-person" key={persona.usuario}>
                                <img src={persona.avatar} alt={persona.nombre} />
                                <div><strong>{persona.nombre}</strong><span>{persona.usuario}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="profile-tabs">
                <button
                    className={seccionPerfil === "mis-publicaciones" ? "profile-tab-active" : ""}
                    onClick={() => setSeccionPerfil("mis-publicaciones")}
                >
                    Mis publicaciones
                </button>
                <button
                    className={seccionPerfil === "guardados" ? "profile-tab-active" : ""}
                    onClick={() => setSeccionPerfil("guardados")}
                >
                    Guardados
                </button>
            </div>

            {seccionPerfil === "mis-publicaciones" && (
                <div className="profile-post-grid">
                    {misPublicaciones.length === 0 ? (
                        <div className="profile-empty">
                            <h4>Todavía no tienes publicaciones</h4>
                            <p>Comparte algún viaje con la comunidad.</p>
                        </div>
                    ) : (
                        misPublicaciones.map((publicacion) => (
                            <div className="profile-post-card" key={publicacion.id}>
                                <img src={publicacion.imagen} alt={publicacion.ubicacion} />
                                <div className="profile-post-card-info">
                                    <strong>📍 {publicacion.ubicacion}</strong>
                                    <p>{publicacion.descripcion}</p>
                                    <span>♥ {publicacion.likes || 0} Me gusta</span>
                                    <button
                                        type="button"
                                        className="profile-delete-post"
                                        onClick={() => confirmarEliminar(publicacion)}
                                    >
                                        Eliminar publicación
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {seccionPerfil === "guardados" && (
                <div className="profile-post-grid">
                    {publicacionesGuardadas.length === 0 ? (
                        <div className="profile-empty">
                            <h4>No tienes publicaciones guardadas</h4>
                            <p>Usa el botón Guardar en las publicaciones que te gusten.</p>
                        </div>
                    ) : (
                        publicacionesGuardadas.map((publicacion) => (
                            <div className="profile-post-card" key={publicacion.id}>
                                <img src={publicacion.imagen} alt={publicacion.ubicacion} />
                                <div className="profile-post-card-info">
                                    <div className="saved-user">
                                        {publicacion.avatar ? (
                                            <img src={publicacion.avatar} alt={publicacion.usuario} className="social-avatar social-avatar-image" />
                                        ) : (
                                            <div className="social-avatar">{publicacion.usuario?.charAt(0).toUpperCase()}</div>
                                        )}
                                        <div><strong>{publicacion.usuario}</strong><span>📍 {publicacion.ubicacion}</span></div>
                                    </div>
                                    <p>{publicacion.descripcion}</p>
                                    <button className="remove-saved" onClick={() => cambiarGuardado(publicacion)}>
                                        Quitar de guardados
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    )
}
