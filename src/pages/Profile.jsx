import { useState } from "react"
import logo from "../assets/logo.png"
import "./Profile.css"
import "./ProfileActions.css"


const datosIniciales = {
    id: "usuario-gino",
    nombre: "Gino Laitano Chavarría",
    usuario: "ginolaitano",
    biografia: "Amante de los viajes, la naturaleza y las nuevas experiencias.",
    ubicacion: "San José, Costa Rica",
    seguidores: [],
    seguidos: []
}


const publicacionesIniciales = [
    {
        id: "publicacion-1",
        usuarioId: "usuario-gino",
        lugar: "La Fortuna, Costa Rica",
        imagen: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80",
        descripcion: "Una experiencia increíble cerca del volcán Arenal.",
        fecha: "5 de agosto de 2026",
        likes: 24,
        liked: false,

        comentarios: [
            {
                id: "comentario-1",
                usuarioId: "usuario-maria",
                username: "mariaexplora",
                texto: "¡Qué lugar tan bonito!",
                fecha: "6 de agosto de 2026"
            },
            {
                id: "comentario-2",
                usuarioId: "usuario-andres",
                username: "andresviajero",
                texto: "Me gustaría conocerlo.",
                fecha: "6 de agosto de 2026"
            }
        ]
    },
    {
        id: "publicacion-2",
        usuarioId: "usuario-gino",
        lugar: "Cancún, México",
        imagen: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57",
        descripcion: "Un destino perfecto para disfrutar de la playa.",
        fecha: "2 de agosto de 2026",
        likes: 31,
        liked: false,

        comentarios: [
            {
                id: "comentario-3",
                usuarioId: "usuario-nicole",
                username: "nicoleviajes",
                texto: "La playa se ve increíble.",
                fecha: "3 de agosto de 2026"
            }
        ]
    },
    {
        id: "publicacion-3",
        usuarioId: "usuario-gino",
        lugar: "Machu Picchu, Perú",
        imagen: "https://images.unsplash.com/photo-1526392060635-9d6019884377",
        descripcion: "Historia, cultura y paisajes impresionantes.",
        fecha: "28 de julio de 2026",
        likes: 42,
        liked: false,

        comentarios: [
            {
                id: "comentario-4",
                usuarioId: "usuario-carlos",
                username: "carlosmochilero",
                texto: "Uno de mis destinos favoritos.",
                fecha: "29 de julio de 2026"
            }
        ]
    },
    {
        id: "publicacion-4",
        usuarioId: "usuario-gino",
        lugar: "Guanacaste, Costa Rica",
        imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        descripcion: "Una tarde tranquila frente al mar.",
        fecha: "20 de julio de 2026",
        likes: 19,
        liked: false,
        comentarios: []
    },
    {
        id: "publicacion-5",
        usuarioId: "usuario-gino",
        lugar: "Ciudad de México",
        imagen: "https://images.unsplash.com/photo-1518638150340-f706e86654de",
        descripcion: "Conociendo nuevos lugares y disfrutando de la cultura.",
        fecha: "15 de julio de 2026",
        likes: 27,
        liked: false,

        comentarios: [
            {
                id: "comentario-5",
                usuarioId: "usuario-sofia",
                username: "sofiaexplorer",
                texto: "Excelente recomendación.",
                fecha: "16 de julio de 2026"
            }
        ]
    },
    {
        id: "publicacion-6",
        usuarioId: "usuario-gino",
        lugar: "Dubái",
        imagen: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
        descripcion: "Una ciudad moderna llena de lugares sorprendentes.",
        fecha: "10 de julio de 2026",
        likes: 35,
        liked: false,
        comentarios: []
    }
]


const nuevaExperienciaInicial = {
    lugar: "",
    imagen: "",
    nombreImagen: "",
    descripcion: ""
}


export const Profile = ({ cambiarPagina }) => {

    const [perfil, setPerfil] = useState(datosIniciales)

    const [publicaciones, setPublicaciones] = useState(
        publicacionesIniciales
    )

    const [editando, setEditando] = useState(false)

    const [formValue, setFormValue] = useState({
        nombre: datosIniciales.nombre,
        usuario: datosIniciales.usuario,
        ubicacion: datosIniciales.ubicacion,
        biografia: datosIniciales.biografia
    })

    const [compartiendo, setCompartiendo] = useState(false)

    const [nuevaExperiencia, setNuevaExperiencia] = useState(
        nuevaExperienciaInicial
    )

    const [comentarioAbierto, setComentarioAbierto] = useState(null)

    const [nuevoComentario, setNuevoComentario] = useState("")

    const [mensajePublicacion, setMensajePublicacion] = useState("")


    // Abre el formulario con los datos actuales del perfil
    const abrirEdicion = () => {

        setFormValue({
            nombre: perfil.nombre,
            usuario: perfil.usuario,
            ubicacion: perfil.ubicacion,
            biografia: perfil.biografia
        })

        setEditando(true)
    }


    // Guarda directamente los valores actuales del formulario
    const guardarCambios = (event) => {

        event.preventDefault()


        const datosFormulario = new FormData(
            event.currentTarget
        )


        const perfilActualizado = {
            ...perfil,

            nombre: String(
                datosFormulario.get("nombre")
            ).trim(),

            usuario: String(
                datosFormulario.get("usuario")
            )
                .trim()
                .replace(/^@/, ""),

            ubicacion: String(
                datosFormulario.get("ubicacion")
            ).trim(),

            biografia: String(
                datosFormulario.get("biografia")
            ).trim()
        }


        setPerfil(perfilActualizado)


        setFormValue({
            nombre: perfilActualizado.nombre,
            usuario: perfilActualizado.usuario,
            ubicacion: perfilActualizado.ubicacion,
            biografia: perfilActualizado.biografia
        })


        setEditando(false)
    }


    // Cierra el formulario sin guardar
    const cancelarEdicion = () => {

        setFormValue({
            nombre: perfil.nombre,
            usuario: perfil.usuario,
            ubicacion: perfil.ubicacion,
            biografia: perfil.biografia
        })

        setEditando(false)
    }


    // Da o quita Me gusta
    const darLike = (idPublicacion) => {

        const publicacionesActualizadas = publicaciones.map(
            (publicacion) => {

                if (publicacion.id === idPublicacion) {

                    return {
                        ...publicacion,

                        liked: !publicacion.liked,

                        likes: publicacion.liked
                            ? publicacion.likes - 1
                            : publicacion.likes + 1
                    }
                }

                return publicacion
            }
        )


        setPublicaciones(publicacionesActualizadas)
    }


    // Elimina una publicación
    const eliminarPublicacion = (idPublicacion) => {

        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar esta publicación?"
        )


        if (!confirmar) {
            return
        }


        const publicacionesActualizadas = publicaciones.filter(
            (publicacion) =>
                publicacion.id !== idPublicacion
        )


        setPublicaciones(publicacionesActualizadas)


        if (comentarioAbierto === idPublicacion) {
            setComentarioAbierto(null)
        }
    }


    // Abre o cierra los comentarios
    const mostrarComentarios = (idPublicacion) => {

        if (comentarioAbierto === idPublicacion) {

            setComentarioAbierto(null)

        } else {

            setComentarioAbierto(idPublicacion)
        }


        setNuevoComentario("")
    }


    // Agrega un comentario
    const publicarComentario = (idPublicacion) => {

        if (!nuevoComentario.trim()) {
            return
        }


        const comentarioNuevo = {
            id: `comentario-${Date.now()}`,
            usuarioId: perfil.id,
            username: perfil.usuario,
            texto: nuevoComentario.trim(),

            fecha: new Date().toLocaleDateString(
                "es-CR",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            )
        }


        const publicacionesActualizadas = publicaciones.map(
            (publicacion) => {

                if (publicacion.id === idPublicacion) {

                    return {
                        ...publicacion,

                        comentarios: [
                            ...publicacion.comentarios,
                            comentarioNuevo
                        ]
                    }
                }

                return publicacion
            }
        )


        setPublicaciones(publicacionesActualizadas)
        setNuevoComentario("")
    }


    // Elimina un comentario por su ID
    const eliminarComentario = (
        idPublicacion,
        idComentario
    ) => {

        const publicacionesActualizadas = publicaciones.map(
            (publicacion) => {

                if (publicacion.id === idPublicacion) {

                    const comentariosActualizados =
                        publicacion.comentarios.filter(
                            (comentario) =>
                                comentario.id !== idComentario
                        )


                    return {
                        ...publicacion,
                        comentarios: comentariosActualizados
                    }
                }

                return publicacion
            }
        )


        setPublicaciones(publicacionesActualizadas)
    }


    // Actualiza los campos de una publicación nueva
    const handleExperienciaChange = ({ target }) => {

        const { name, value } = target

        setNuevaExperiencia({
            ...nuevaExperiencia,
            [name]: value
        })

        setMensajePublicacion("")
    }


    // Selecciona una imagen desde la computadora
    const handleImagenChange = ({ target }) => {

        const archivo = target.files[0]


        if (!archivo) {
            return
        }


        if (!archivo.type.startsWith("image/")) {

            setMensajePublicacion(
                "Debe seleccionar un archivo de imagen."
            )

            return
        }


        const lector = new FileReader()


        lector.onload = () => {

            setNuevaExperiencia({
                ...nuevaExperiencia,
                imagen: lector.result,
                nombreImagen: archivo.name
            })

            setMensajePublicacion("")
        }


        lector.readAsDataURL(archivo)
    }


    // Abre el formulario para publicar
    const abrirCompartirExperiencia = () => {

        setNuevaExperiencia(
            nuevaExperienciaInicial
        )

        setMensajePublicacion("")
        setCompartiendo(true)
    }


    // Cancela la publicación
    const cancelarExperiencia = () => {

        setNuevaExperiencia(
            nuevaExperienciaInicial
        )

        setMensajePublicacion("")
        setCompartiendo(false)
    }


    // Publica una experiencia nueva
    const compartirExperiencia = (event) => {

        event.preventDefault()


        if (
            !nuevaExperiencia.lugar.trim() ||
            !nuevaExperiencia.descripcion.trim() ||
            !nuevaExperiencia.imagen
        ) {

            setMensajePublicacion(
                "La fotografía, la ubicación y la descripción son obligatorias."
            )

            return
        }


        const fechaActual = new Date().toLocaleDateString(
            "es-CR",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )


        const publicacionNueva = {
            id: `publicacion-${Date.now()}`,
            usuarioId: perfil.id,
            lugar: nuevaExperiencia.lugar.trim(),
            imagen: nuevaExperiencia.imagen,
            descripcion: nuevaExperiencia.descripcion.trim(),
            fecha: fechaActual,
            likes: 0,
            liked: false,
            comentarios: []
        }


        setPublicaciones([
            publicacionNueva,
            ...publicaciones
        ])


        setNuevaExperiencia(
            nuevaExperienciaInicial
        )

        setMensajePublicacion("")
        setCompartiendo(false)
    }


    return (

        <div className="profile-page">

            {/* BARRA SUPERIOR */}

            <header className="profile-navbar">

                <div className="profile-navbar-content">

                    <button
                        className="profile-brand"
                        onClick={() =>
                            cambiarPagina("inicio")
                        }
                    >

                        <img
                            src={logo}
                            alt="Logo Entre Destinos"
                            className="profile-logo"
                        />


                        <div>

                            <h3>
                                Entre Destinos
                            </h3>


                            <span>
                                Red social de viajeros
                            </span>

                        </div>

                    </button>


                    <button
                        className="volver-button"
                        onClick={() =>
                            cambiarPagina("inicio")
                        }
                    >
                        Volver al inicio
                    </button>

                </div>

            </header>


            <main className="profile-content">

                {/* PORTADA */}

                <section className="profile-cover">

                    <div className="profile-cover-text">

                        <span>
                            Mi perfil viajero
                        </span>


                        <h1>
                            Cada destino cuenta una historia
                        </h1>


                        <p>
                            Comparte tus experiencias y ayuda a otros viajeros
                            a descubrir nuevos lugares.
                        </p>

                    </div>

                </section>


                {/* INFORMACIÓN DEL PERFIL */}

                <section className="profile-card">

                    <div className="profile-main-info">

                        <div className="profile-avatar">
                            GL
                        </div>


                        <div className="profile-user-info">

                            <div className="profile-name-row">

                                <div>

                                    <h2>
                                        {perfil.nombre}
                                    </h2>


                                    <span>
                                        @{perfil.usuario}
                                    </span>

                                </div>


                                <button
                                    className="edit-profile-button"
                                    onClick={abrirEdicion}
                                >
                                    Editar perfil
                                </button>

                            </div>


                            <p className="profile-location">
                                📍 {perfil.ubicacion}
                            </p>


                            <p className="profile-biography">
                                {perfil.biografia}
                            </p>

                        </div>

                    </div>


                    {/* ESTADÍSTICAS */}

                    <div className="profile-stats profile-stats-three">

                        <div>

                            <strong>
                                {publicaciones.length}
                            </strong>

                            <span>
                                Publicaciones
                            </span>

                        </div>


                        <div>

                            <strong>
                                {perfil.seguidores.length}
                            </strong>

                            <span>
                                Seguidores
                            </span>

                        </div>


                        <div>

                            <strong>
                                {perfil.seguidos.length}
                            </strong>

                            <span>
                                Seguidos
                            </span>

                        </div>

                    </div>

                </section>


                {/* PUBLICACIONES */}

                <section className="profile-publications">

                    <div className="publications-title">

                        <div>

                            <h3>
                                Mis experiencias
                            </h3>


                            <p>
                                Fotografías y recuerdos de los lugares visitados.
                            </p>

                        </div>


                        <button
                            className="share-experience-button"
                            onClick={abrirCompartirExperiencia}
                        >
                            + Compartir experiencia
                        </button>

                    </div>


                    <div className="publications-grid">

                        {publicaciones.map((publicacion) => (

                            <article
                                className="publication-card"
                                key={publicacion.id}
                            >

                                <div className="publication-image">

                                    <img
                                        src={publicacion.imagen}
                                        alt={publicacion.lugar}
                                    />


                                    <button
                                        className="delete-publication-button"
                                        onClick={() =>
                                            eliminarPublicacion(
                                                publicacion.id
                                            )
                                        }
                                        title="Eliminar publicación"
                                    >
                                        🗑
                                    </button>


                                    <span className="publication-location">
                                        📍 {publicacion.lugar}
                                    </span>

                                </div>


                                <div className="publication-info">

                                    <span className="publication-date">
                                        {publicacion.fecha}
                                    </span>


                                    <p>
                                        {publicacion.descripcion}
                                    </p>


                                    <div className="publication-actions">

                                        <button
                                            className={
                                                publicacion.liked
                                                    ? "like-button liked"
                                                    : "like-button"
                                            }
                                            onClick={() =>
                                                darLike(publicacion.id)
                                            }
                                        >

                                            {publicacion.liked ? "♥" : "♡"}

                                            <span>
                                                {publicacion.likes}
                                            </span>

                                        </button>


                                        <button
                                            className="comment-button"
                                            onClick={() =>
                                                mostrarComentarios(
                                                    publicacion.id
                                                )
                                            }
                                        >

                                            💬

                                            <span>
                                                {
                                                    publicacion
                                                        .comentarios
                                                        .length
                                                }
                                            </span>

                                        </button>

                                    </div>


                                    {comentarioAbierto === publicacion.id && (

                                        <div className="comments-section">

                                            <div className="comments-list">

                                                {
                                                    publicacion
                                                        .comentarios
                                                        .length === 0
                                                        ? (
                                                            <p className="no-comments">
                                                                Todavía no hay comentarios.
                                                            </p>
                                                        )
                                                        : (
                                                            publicacion
                                                                .comentarios
                                                                .map(
                                                                    (
                                                                        comentario
                                                                    ) => (

                                                                        <div
                                                                            className="comment-item"
                                                                            key={
                                                                                comentario.id
                                                                            }
                                                                        >

                                                                            <div className="comment-content">

                                                                                <strong>
                                                                                    @{comentario.username}
                                                                                </strong>


                                                                                <span>
                                                                                    {comentario.texto}
                                                                                </span>


                                                                                <small className="comment-date">
                                                                                    {comentario.fecha}
                                                                                </small>

                                                                            </div>


                                                                            <button
                                                                                className="delete-comment-button"
                                                                                onClick={() =>
                                                                                    eliminarComentario(
                                                                                        publicacion.id,
                                                                                        comentario.id
                                                                                    )
                                                                                }
                                                                                title="Eliminar comentario"
                                                                            >
                                                                                ×
                                                                            </button>

                                                                        </div>

                                                                    )
                                                                )
                                                        )
                                                }

                                            </div>


                                            <div className="new-comment">

                                                <input
                                                    type="text"
                                                    placeholder={`Comentar como @${perfil.usuario}`}
                                                    value={nuevoComentario}
                                                    onChange={(event) =>
                                                        setNuevoComentario(
                                                            event.target.value
                                                        )
                                                    }
                                                    onKeyDown={(event) => {

                                                        if (
                                                            event.key ===
                                                            "Enter"
                                                        ) {

                                                            publicarComentario(
                                                                publicacion.id
                                                            )
                                                        }
                                                    }}
                                                />


                                                <button
                                                    onClick={() =>
                                                        publicarComentario(
                                                            publicacion.id
                                                        )
                                                    }
                                                >
                                                    Publicar
                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </article>

                        ))}

                    </div>

                </section>

            </main>


            {/* FORMULARIO PARA EDITAR PERFIL */}

            {editando && (

                <div className="profile-modal-background">

                    <div className="profile-modal">

                        <div className="profile-modal-header">

                            <div>

                                <h3>
                                    Editar perfil
                                </h3>


                                <p>
                                    Actualiza la información de tu perfil viajero.
                                </p>

                            </div>


                            <button
                                className="close-modal-button"
                                onClick={cancelarEdicion}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={guardarCambios}>

                            <div className="profile-form-group">

                                <label>
                                    Nombre completo
                                </label>


                                <input
                                    type="text"
                                    name="nombre"
                                    value={formValue.nombre}
                                    onChange={(event) =>
                                        setFormValue({
                                            ...formValue,
                                            nombre: event.target.value
                                        })
                                    }
                                    autoComplete="off"
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Nombre de usuario
                                </label>


                                <input
                                    type="text"
                                    name="usuario"
                                    value={formValue.usuario}
                                    onChange={(event) =>
                                        setFormValue({
                                            ...formValue,
                                            usuario: event.target.value
                                        })
                                    }
                                    autoComplete="off"
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Ubicación
                                </label>


                                <input
                                    type="text"
                                    name="ubicacion"
                                    value={formValue.ubicacion}
                                    onChange={(event) =>
                                        setFormValue({
                                            ...formValue,
                                            ubicacion: event.target.value
                                        })
                                    }
                                    autoComplete="off"
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Biografía viajera
                                </label>


                                <textarea
                                    name="biografia"
                                    value={formValue.biografia}
                                    onChange={(event) =>
                                        setFormValue({
                                            ...formValue,
                                            biografia: event.target.value
                                        })
                                    }
                                    rows="4"
                                    required
                                />

                            </div>


                            <div className="profile-modal-buttons">

                                <button
                                    type="button"
                                    className="cancel-profile-button"
                                    onClick={cancelarEdicion}
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="save-profile-button"
                                >
                                    Guardar cambios
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* FORMULARIO PARA COMPARTIR EXPERIENCIA */}

            {compartiendo && (

                <div className="profile-modal-background">

                    <div className="profile-modal">

                        <div className="profile-modal-header">

                            <div>

                                <h3>
                                    Compartir experiencia
                                </h3>


                                <p>
                                    Publica un recuerdo de uno de tus viajes.
                                </p>

                            </div>


                            <button
                                className="close-modal-button"
                                onClick={cancelarExperiencia}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={compartirExperiencia}>

                            <div className="profile-form-group">

                                <label>
                                    Fotografía de la experiencia
                                </label>


                                <label className="image-selector">

                                    <span>
                                        📷 Seleccionar fotografía
                                    </span>


                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImagenChange}
                                    />

                                </label>


                                {nuevaExperiencia.nombreImagen && (

                                    <small className="selected-image-name">

                                        Archivo seleccionado:{" "}

                                        {
                                            nuevaExperiencia
                                                .nombreImagen
                                        }

                                    </small>

                                )}

                            </div>


                            {nuevaExperiencia.imagen && (

                                <div className="experience-preview">

                                    <span>
                                        Vista previa
                                    </span>


                                    <img
                                        src={nuevaExperiencia.imagen}
                                        alt="Vista previa"
                                    />

                                </div>

                            )}


                            <div className="profile-form-group">

                                <label>
                                    Ubicación o destino
                                </label>


                                <input
                                    type="text"
                                    name="lugar"
                                    placeholder="Ejemplo: Toronto, Canadá"
                                    value={nuevaExperiencia.lugar}
                                    onChange={handleExperienciaChange}
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Cuéntanos tu experiencia
                                </label>


                                <textarea
                                    name="descripcion"
                                    placeholder="¿Qué fue lo que más te gustó?"
                                    value={nuevaExperiencia.descripcion}
                                    onChange={handleExperienciaChange}
                                    rows="4"
                                />

                            </div>


                            {mensajePublicacion && (

                                <p className="publication-message">
                                    {mensajePublicacion}
                                </p>

                            )}


                            <div className="profile-modal-buttons">

                                <button
                                    type="button"
                                    className="cancel-profile-button"
                                    onClick={cancelarExperiencia}
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="save-profile-button"
                                >
                                    Publicar experiencia
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* MENÚ INFERIOR */}

            <nav className="bottom-menu">

                <button
                    onClick={() =>
                        cambiarPagina("inicio")
                    }
                >
                    Inicio
                </button>


                <button>
                    Explorar
                </button>


                <button>
                    Mis viajes
                </button>


                <button className="menu-activo">
                    Perfil
                </button>

            </nav>

        </div>

    )
}