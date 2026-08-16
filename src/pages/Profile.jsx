import { useEffect, useState } from "react"
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore"
import { updateProfile } from "firebase/auth"
import { auth, db } from "../firebase"
import "./Profile.css"

export const Profile = ({
    publicaciones,
    recargarPublicaciones,
    onCompartir
}) => {
    const [seccion, setSeccion] = useState("publicaciones")
    const [editando, setEditando] = useState(false)
    const [nombre, setNombre] = useState("")
    const [usuario, setUsuario] = useState("")
    const [ubicacion, setUbicacion] = useState("")
    const [biografia, setBiografia] = useState("")
    const [mensaje, setMensaje] = useState("")

    const usuarioActual = auth.currentUser

    const misPublicaciones = publicaciones.filter(
        (publicacion) => publicacion.uid === usuarioActual?.uid
    )

    useEffect(() => {
        const cargarPerfil = async () => {
            if (!usuarioActual) {
                return
            }

            setNombre(usuarioActual.displayName || "")

            try {
                const perfilRef = doc(db, "usuarios", usuarioActual.uid)
                const resultado = await getDoc(perfilRef)

                if (resultado.exists()) {
                    const datos = resultado.data()

                    setNombre(
                        datos.nombre || usuarioActual.displayName || ""
                    )
                    setUsuario(datos.usuario || "")
                    setUbicacion(datos.ubicacion || "")
                    setBiografia(datos.biografia || "")
                }
            } catch (error) {
                console.error("Error cargando el perfil:", error)
            }
        }

        cargarPerfil()
    }, [usuarioActual])

    const guardarPerfil = async (event) => {
        event.preventDefault()
        setMensaje("")

        if (!usuarioActual) {
            return
        }

        if (nombre.trim() === "") {
            setMensaje("El nombre es obligatorio")
            return
        }

        try {
            await updateProfile(usuarioActual, {
                displayName: nombre.trim()
            })

            await setDoc(
                doc(db, "usuarios", usuarioActual.uid),
                {
                    uid: usuarioActual.uid,
                    nombre: nombre.trim(),
                    usuario: usuario.trim(),
                    ubicacion: ubicacion.trim(),
                    biografia: biografia.trim(),
                    correo: usuarioActual.email
                },
                { merge: true }
            )

            setMensaje("Perfil actualizado correctamente")
            setEditando(false)
        } catch (error) {
            console.error("Error actualizando el perfil:", error)
            setMensaje("No se pudo actualizar el perfil")
        }
    }

    const eliminarPublicacion = async (publicacion) => {
        if (!usuarioActual || publicacion.uid !== usuarioActual.uid) {
            return
        }

        const confirmar = window.confirm(
            "¿Desea eliminar esta publicación?"
        )

        if (!confirmar) {
            return
        }

        try {
            await deleteDoc(
                doc(db, "publicaciones", publicacion.id)
            )
            await recargarPublicaciones()
        } catch (error) {
            console.error("Error eliminando la publicación:", error)
        }
    }

    const inicial = nombre
        ? nombre.charAt(0).toUpperCase()
        : usuarioActual?.email?.charAt(0).toUpperCase()

    return (
        <main className="profile-page">
            <section className="profile-header-card">
                <div className="profile-avatar-large">
                    {inicial}
                </div>

                <div className="profile-main-info">
                    <h2>
                        {nombre ||
                            usuarioActual?.displayName ||
                            usuarioActual?.email}
                    </h2>

                    {usuario && (
                        <span className="profile-username">
                            @{usuario}
                        </span>
                    )}

                    <p className="profile-email">
                        {usuarioActual?.email}
                    </p>

                    {ubicacion && (
                        <p className="profile-location">
                            📍 {ubicacion}
                        </p>
                    )}

                    <p className="profile-biography">
                        {biografia || "Viajero en Entre Destinos"}
                    </p>

                    <div className="profile-stats">
                        <div>
                            <strong>{misPublicaciones.length}</strong>
                            <span>Publicaciones</span>
                        </div>

                    </div>
                </div>

                <button
                    type="button"
                    className="profile-edit-button"
                    onClick={() => setEditando(!editando)}
                >
                    {editando ? "Cancelar" : "Editar perfil"}
                </button>
            </section>

            <button
                type="button"
                className="profile-save-button"
                onClick={onCompartir}
            >
                + Compartir experiencia
            </button>

            {editando && (
                <form
                    className="profile-edit-form"
                    onSubmit={guardarPerfil}
                >
                    <h3>Editar perfil</h3>

                    <div className="profile-form-grid">
                        <div>
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(event) =>
                                    setNombre(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <label>Usuario</label>
                            <input
                                type="text"
                                placeholder="Ej: ginolaitano"
                                value={usuario}
                                onChange={(event) =>
                                    setUsuario(event.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label>Ubicación</label>
                            <input
                                type="text"
                                placeholder="Ej: San José, Costa Rica"
                                value={ubicacion}
                                onChange={(event) =>
                                    setUbicacion(event.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label>Biografía viajera</label>
                            <textarea
                                placeholder="Cuéntanos un poco sobre ti"
                                value={biografia}
                                onChange={(event) =>
                                    setBiografia(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="profile-save-button"
                    >
                        Guardar cambios
                    </button>
                </form>
            )}

            {mensaje && (
                <p className="profile-message">{mensaje}</p>
            )}

            <div className="profile-tabs">
                <button
                    type="button"
                    className={
                        seccion === "publicaciones"
                            ? "profile-tab-active"
                            : ""
                    }
                    onClick={() => setSeccion("publicaciones")}
                >
                    Mis publicaciones
                </button>

            </div>

            {seccion === "publicaciones" && (
                <section className="profile-post-grid">
                    {misPublicaciones.length === 0 ? (
                        <div className="profile-empty">
                            <h3>Todavía no tienes publicaciones</h3>
                            <p>
                                Comparte algún viaje con la comunidad.
                            </p>
                        </div>
                    ) : (
                        misPublicaciones.map((publicacion) => (
                            <article
                                className="profile-post-card"
                                key={publicacion.id}
                            >
                                <img
                                    src={publicacion.imagen}
                                    alt={publicacion.ubicacion}
                                />

                                <div className="profile-post-info">
                                    <strong>
                                        📍 {publicacion.ubicacion}
                                    </strong>

                                    <p>{publicacion.descripcion}</p>

                                    <div className="profile-post-bottom">
                                        <span>
                                            ♥ {publicacion.likes || 0}
                                            {" · "}
                                            💬 {publicacion.comentarios || 0}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                eliminarPublicacion(publicacion)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            )}

        </main>
    )
}