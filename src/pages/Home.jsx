// useState guarda información que cambia.
// useEffect ejecuta una función cuando abrimos el Home.
import { useEffect, useState } from "react"

// Funciones que utilizaremos de Firestore
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from "firebase/firestore"

// Authentication nos permite saber quién está conectado.
// Firestore guarda las publicaciones.
import { auth, db } from "../firebase"

// Logo de Entre Destinos
import logo from "../assets/logo.png"



export const Home = () => {

    // ==========================================
    // DESTINOS
    // ==========================================

    // Lista temporal de destinos.
    // Más adelante estos datos pueden venir desde Firebase.
    const destinos = [
        {
            id: 1,
            nombre: "Costa Rica",
            descripcion: "Naturaleza y aventura",
            imagen: "https://images.unsplash.com/photo-1518259102261-b40117eabbc9"
        },
        {
            id: 2,
            nombre: "México",
            descripcion: "Playas y cultura",
            imagen: "https://images.unsplash.com/photo-1518638150340-f706e86654de"
        },
        {
            id: 3,
            nombre: "Perú",
            descripcion: "Historia y montaña",
            imagen: "https://images.unsplash.com/photo-1526392060635-9d6019884377"
        },
        {
            id: 4,
            nombre: "Dubái",
            descripcion: "Ciudad y lujo",
            imagen: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
        }
    ]


    // ==========================================
    // PAQUETES
    // ==========================================

    // Paquetes turísticos temporales.
    const paquetes = [
        {
            id: 1,
            nombre: "Escapada a la playa",
            destino: "Guanacaste, Costa Rica",
            precio: 550,
            dias: "4 días",
            imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        },
        {
            id: 2,
            nombre: "Aventura en Cancún",
            destino: "Cancún, México",
            precio: 720,
            dias: "5 días",
            imagen: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57"
        }
    ]


   // ==========================================
// PUBLICACIONES REALES
// ==========================================

// Aquí guardamos las publicaciones que vienen de Firebase
const [publicaciones, setPublicaciones] = useState([])


// Datos para crear una nueva publicación
const [ubicacion, setUbicacion] = useState("")
const [descripcion, setDescripcion] = useState("")
const [imagen, setImagen] = useState("")


// Mensaje para indicar si se publicó correctamente
const [mensajePublicacion, setMensajePublicacion] = useState("")

// Controla si el formulario para publicar está abierto o cerrado
const [mostrarFormulario, setMostrarFormulario] = useState(false)

// Controla si estamos viendo Inicio o Perfil
const [pantalla, setPantalla] = useState("inicio")

// Controla qué parte del perfil queremos ver
const [seccionPerfil, setSeccionPerfil] = useState("mis-publicaciones")

// Guarda qué publicación tiene abiertos los comentarios
const [publicacionComentarioId, setPublicacionComentarioId] = useState(null)

// Guarda lo que escribe el usuario en el comentario
const [comentarioTexto, setComentarioTexto] = useState("")

// ==========================================
// CARGAR PUBLICACIONES
// ==========================================

const cargarPublicaciones = async () => {

    try {

        const consulta = query(
            collection(db, "publicaciones"),
            orderBy("fecha", "desc")
        )

        const resultado = await getDocs(consulta)

        const lista = resultado.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
        }))

        setPublicaciones(lista)

    } catch (error) {

        console.error(
            "Error cargando publicaciones:",
            error
        )
    }
}
// ==========================================
// CARGAR PUBLICACIONES AL ABRIR EL HOME
// ==========================================

// Cuando abrimos el Home cargamos las publicaciones
useEffect(() => {

    const obtenerPublicaciones = async () => {

        try {

            // Buscamos las publicaciones en Firebase
            const consulta = query(
                collection(db, "publicaciones"),
                orderBy("fecha", "desc")
            )

            const resultado = await getDocs(consulta)

            // Convertimos los datos en un arreglo
            const lista = resultado.docs.map((documento) => ({
                id: documento.id,
                ...documento.data()
            }))

            // Guardamos las publicaciones
            setPublicaciones(lista)

        } catch (error) {

            console.error(
                "Error cargando publicaciones:",
                error
            )
        }
    }


    obtenerPublicaciones()

}, [])


// ==========================================
// CREAR PUBLICACIÓN
// ==========================================

// ==========================================
// CREAR PUBLICACIÓN
// ==========================================

const crearPublicacion = async (event) => {

    // Evitamos que la página se recargue
    event.preventDefault()

    // Limpiamos mensajes anteriores
    setMensajePublicacion("")

    // Obtenemos el usuario que inició sesión
    const usuarioActual = auth.currentUser


    // Verificamos que exista un usuario conectado
    if (!usuarioActual) {

        setMensajePublicacion(
            "Debes iniciar sesión para publicar"
        )

        return
    }


    // Revisamos que todos los campos estén completos
    if (
        ubicacion.trim() === "" ||
        descripcion.trim() === "" ||
        imagen.trim() === ""
    ) {

        setMensajePublicacion(
            "Completa todos los campos"
        )

        return
    }


    try {

        // Guardamos la publicación en Firebase
        await addDoc(
            collection(db, "publicaciones"),
            {
                uid: usuarioActual.uid,

                usuario:
                    usuarioActual.displayName ||
                    usuarioActual.email,

                ubicacion: ubicacion,

                descripcion: descripcion,

                imagen: imagen,

                likes: 0,

                // Usuarios que dieron Me gusta
                usuariosLike: [],

                // Usuarios que guardaron la publicación
usuariosGuardaron: [],

// Lista de comentarios de la publicación
listaComentarios: [],

                comentarios: 0,

                fecha: serverTimestamp()
            }
        )


        // Limpiamos los campos
        setUbicacion("")
        setDescripcion("")
        setImagen("")


        setMensajePublicacion(
            "Publicación creada correctamente"
        )


        // Cerramos el formulario
        setMostrarFormulario(false)


        // Volvemos a cargar las publicaciones
        await cargarPublicaciones()

    } catch (error) {

        console.error(
            "Error creando publicación:",
            error
        )

        setMensajePublicacion(
            "No se pudo crear la publicación"
        )
    }
}


// ==========================================
// DAR O QUITAR ME GUSTA
// ==========================================

const cambiarLike = async (publicacion) => {

    // Usuario conectado actualmente
    const usuarioActual = auth.currentUser


    if (!usuarioActual) {
        return
    }


    try {

        // Buscamos la publicación en Firebase
        const publicacionRef = doc(
            db,
            "publicaciones",
            publicacion.id
        )


        // Revisamos si este usuario ya dio Me gusta
        const yaDioLike =
            publicacion.usuariosLike?.includes(
                usuarioActual.uid
            )


        // Si ya había dado like, lo quitamos
        if (yaDioLike) {

            await updateDoc(publicacionRef, {

                usuariosLike: arrayRemove(
                    usuarioActual.uid
                ),

                likes: publicacion.likes - 1
            })

        } else {

            // Si no había dado like, lo agregamos
            await updateDoc(publicacionRef, {

                usuariosLike: arrayUnion(
                    usuarioActual.uid
                ),

                likes: publicacion.likes + 1
            })
        }


        // Actualizamos las publicaciones
        await cargarPublicaciones()

    } catch (error) {

        console.error(
            "Error actualizando el like:",
            error
        )
    }
}
// ==========================================
// AGREGAR COMENTARIO
// ==========================================

const agregarComentario = async (publicacion) => {

    const usuarioActual = auth.currentUser

    // Revisamos que haya un usuario conectado
    if (!usuarioActual) {
        return
    }

    // No permitimos comentarios vacíos
    if (comentarioTexto.trim() === "") {
        return
    }

    try {

        // Buscamos la publicación en Firebase
        const publicacionRef = doc(
            db,
            "publicaciones",
            publicacion.id
        )


        // Creamos el comentario
        const nuevoComentario = {

            uid: usuarioActual.uid,

            usuario:
                usuarioActual.displayName ||
                usuarioActual.email,

            texto: comentarioTexto,

            // Guardamos una fecha sencilla
            fecha: Date.now()
        }


        // Actualizamos la publicación
        await updateDoc(publicacionRef, {

            listaComentarios: arrayUnion(
                nuevoComentario
            ),

            comentarios:
                (publicacion.comentarios || 0) + 1
        })


        // Limpiamos el campo
        setComentarioTexto("")


        // Volvemos a cargar las publicaciones
        await cargarPublicaciones()

    } catch (error) {

        console.error(
            "Error agregando comentario:",
            error
        )
    }
}


// ==========================================
// GUARDAR PUBLICACIÓN
// ==========================================

const cambiarGuardado = async (publicacion) => {

    const usuarioActual = auth.currentUser

    if (!usuarioActual) {
        return
    }


    try {

        const publicacionRef = doc(
            db,
            "publicaciones",
            publicacion.id
        )


        // Revisamos si el usuario ya la había guardado
        const yaGuardada =
            publicacion.usuariosGuardaron?.includes(
                usuarioActual.uid
            )


        if (yaGuardada) {

            // Quitamos la publicación de guardados
            await updateDoc(publicacionRef, {

                usuariosGuardaron: arrayRemove(
                    usuarioActual.uid
                )
            })

        } else {

            // Guardamos la publicación
            await updateDoc(publicacionRef, {

                usuariosGuardaron: arrayUnion(
                    usuarioActual.uid
                )
            })
        }


        // Actualizamos la pantalla
        await cargarPublicaciones()

    } catch (error) {

        console.error(
            "Error guardando publicación:",
            error
        )
    }
}
// ==========================================
// PUBLICACIONES DEL PERFIL
// ==========================================

// Publicaciones creadas por el usuario conectado
const misPublicaciones = publicaciones.filter(
    (publicacion) =>
        publicacion.uid === auth.currentUser?.uid
)


// Publicaciones que el usuario guardó
const publicacionesGuardadas = publicaciones.filter(
    (publicacion) =>
        publicacion.usuariosGuardaron?.includes(
            auth.currentUser?.uid
        )
)
    return (
        <div className="home-page">


            {/* ============================= */}
            {/* BARRA SUPERIOR */}
            {/* ============================= */}

            <header className="home-navbar">

                <div className="home-navbar-content">

                    <div className="home-brand">

                        <img
                            src={logo}
                            alt="Logo Entre Destinos"
                            className="home-logo"
                        />

                        <div>
                            <h3>Entre Destinos</h3>
                            <span>Online Travel Agency</span>
                        </div>

                    </div>


                    {/* Buscador de la red social */}
                    <div className="navbar-search-social">

                        <input
                            type="text"
                            placeholder="Buscar destinos o viajeros..."
                        />

                    </div>


                    <button
    className="profile-button"
    onClick={() =>
        setPantalla("perfil")
    }
>
    Mi perfil
</button>

                </div>

            </header>

{pantalla === "inicio" && (
            <main className="home-content">


                {/* ============================= */}
                {/* PORTADA PRINCIPAL */}
                {/* ============================= */}

                <section className="hero-section">

                    <div className="hero-text">

                        <span className="hero-small">
                            Tu próxima aventura empieza aquí
                        </span>

                        <h1>
                            Descubre nuevos destinos
                        </h1>

                        <p>
                            Encuentra lugares increíbles, organiza tus viajes,
                            descubre paquetes y comparte experiencias con otros viajeros.
                        </p>


                        {/* Buscador principal */}
                        <div className="hero-search">

                            <input
                                type="text"
                                placeholder="¿A dónde quieres viajar?"
                            />

                            <button>
                                Buscar
                            </button>

                        </div>

                    </div>

                </section>


                {/* ============================= */}
                {/* DESTINOS DESTACADOS */}
                {/* ============================= */}

                <section className="home-section">

                    <div className="section-title">

                        <div>
                            <h4>Destinos destacados</h4>

                            <p>
                                Algunos lugares que podrían interesarte
                            </p>
                        </div>

                        <button className="link-button">
                            Ver todos
                        </button>

                    </div>


                    <div className="destinos-grid">

                        {destinos.map((destino) => (

                            <div
                                className="destino-card"
                                key={destino.id}
                            >

                                <img
                                    src={destino.imagen}
                                    alt={destino.nombre}
                                />

                                <div className="destino-card-info">

                                    <h5>
                                        {destino.nombre}
                                    </h5>

                                    <p>
                                        {destino.descripcion}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                {/* ===================================== */}
                {/* COMUNIDAD / PARTE DE RED SOCIAL */}
                {/* ===================================== */}

                <section className="home-section">

                    <div className="section-title">

                        <div>

                            <h4>
                                Comunidad viajera
                            </h4>

                            <p>
                                Mira lo que otros viajeros están compartiendo
                            </p>

                        </div>

                        <button className="link-button">
                            Ver comunidad
                        </button>

                    </div>


                    {/* ================================= */}
                    {/* CREAR UNA PUBLICACIÓN */}
                    {/* ================================= */}

                    {/* Botón principal para crear una publicación */}
<div className="crear-publicacion-bar">

    <div className="social-avatar">

        {auth.currentUser?.displayName
            ?.charAt(0)
            .toUpperCase() ||
            auth.currentUser?.email
                ?.charAt(0)
                .toUpperCase()
        }

    </div>


    <button
        className="abrir-publicacion"
        onClick={() =>
            setMostrarFormulario(!mostrarFormulario)
        }
    >

        + Crear publicación

    </button>

</div>


{/* El formulario solo aparece cuando el usuario
    presiona Crear publicación */}
{mostrarFormulario && (

    <form
        className="real-post-form"
        onSubmit={crearPublicacion}
    >

        <div className="form-publicacion-titulo">

            <div>

                <strong>
                    Crear publicación
                </strong>

                <span>
                    Comparte tu experiencia con otros viajeros
                </span>

            </div>


            {/* Permite cerrar el formulario */}
            <button
                type="button"
                className="cerrar-formulario"
                onClick={() =>
                    setMostrarFormulario(false)
                }
            >
                ×
            </button>

        </div>


        {/* Lugar */}
        <div className="campo-publicacion">

            <label>
                Lugar
            </label>

            <input
                type="text"
                placeholder="Ej: Tamarindo, Costa Rica"
                value={ubicacion}
                onChange={(event) =>
                    setUbicacion(event.target.value)
                }
            />

        </div>


        {/* Descripción */}
        <div className="campo-publicacion">

            <label>
                ¿Cómo estuvo tu viaje?
            </label>

            <textarea
                placeholder="Cuéntale a la comunidad sobre tu experiencia..."
                value={descripcion}
                onChange={(event) =>
                    setDescripcion(event.target.value)
                }
            />

        </div>


        {/* Foto por URL por ahora */}
        <div className="campo-publicacion">

            <label>
                Foto
            </label>

            <input
                type="text"
                placeholder="Pega el enlace de una fotografía"
                value={imagen}
                onChange={(event) =>
                    setImagen(event.target.value)
                }
            />

        </div>


        <div className="post-form-bottom">

            <span>
                {mensajePublicacion}
            </span>


            <div className="publicacion-buttons">

                <button
                    type="button"
                    className="cancelar-publicacion"
                    onClick={() =>
                        setMostrarFormulario(false)
                    }
                >
                    Cancelar
                </button>


                <button
                    type="submit"
                    className="publicar-final"
                >
                    Publicar
                </button>

            </div>

        </div>

    </form>

)}


                    {/* ================================= */}
                    {/* PUBLICACIONES */}
                    {/* ================================= */}

                    <div className="social-feed">

                        {publicaciones.map((publicacion) => (

                            <div
                                className="social-post"
                                key={publicacion.id}
                            >


                                {/* Información del usuario */}
                                <div className="social-post-header">

                                    <div className="social-avatar">
                                        {publicacion.usuario
    ?.charAt(0)
    .toUpperCase()}
                                    </div>


                                    <div className="social-user-info">

                                        <strong>
                                            {publicacion.usuario}
                                        </strong>

                                        <span>
                                            📍 {publicacion.ubicacion}
                                        </span>

                                    </div>


                                    <button className="social-more">
                                        •••
                                    </button>

                                </div>


                                {/* Imagen */}
                                <img
                                    src={publicacion.imagen}
                                    alt={publicacion.ubicacion}
                                    className="social-post-image"
                                />


                                {/* Botones */}
                                <div className="social-actions">

                           <button
    className={
        publicacion.usuariosLike?.includes(
            auth.currentUser?.uid
        )
            ? "social-like social-liked"
            : "social-like"
    }
    onClick={() =>
        cambiarLike(publicacion)
    }
>

    {publicacion.usuariosLike?.includes(
        auth.currentUser?.uid
    )
        ? "♥ Me gusta"
        : "♡ Me gusta"
    }

</button>


                                 {/* Abrir o cerrar comentarios */}
<button
    onClick={() => {

        if (publicacionComentarioId === publicacion.id) {

            setPublicacionComentarioId(null)

        } else {

            setPublicacionComentarioId(
                publicacion.id
            )
        }
    }}
>
    💬 Comentar
</button>


{/* Guardar o quitar de guardados */}
<button
    onClick={() =>
        cambiarGuardado(publicacion)
    }
>

    {publicacion.usuariosGuardaron?.includes(
        auth.currentUser?.uid
    )
        ? "✓ Guardado"
        : "Guardar"
    }

</button>

                                </div>
                                {/* ================================= */}
{/* SECCIÓN DE COMENTARIOS */}
{/* ================================= */}

{publicacionComentarioId === publicacion.id && (

    <div className="comment-section">

        {/* Escribir un comentario */}
        <div className="comment-input">

            <input
                type="text"
                placeholder="Escribe un comentario..."
                value={comentarioTexto}
                onChange={(event) =>
                    setComentarioTexto(event.target.value)
                }
            />

            <button
                onClick={() =>
                    agregarComentario(publicacion)
                }
            >
                Enviar
            </button>

        </div>


        {/* Mostrar los comentarios existentes */}
        <div className="comments-list">

            {publicacion.listaComentarios?.map(
                (comentario, index) => (

                    <div
                        className="comment-item"
                        key={index}
                    >

                        <strong>
                            {comentario.usuario}
                        </strong>

                        <span>
                            {comentario.texto}
                        </span>

                    </div>

                )
            )}

        </div>

    </div>

)}


                                {/* Información debajo de la foto */}
                                <div className="social-post-info">

                                    <strong>
                                        {publicacion.likes} Me gusta
                                    </strong>


                                    <p>

                                        <b>
                                            {publicacion.usuario}
                                        </b>

                                        {" "}

                                        {publicacion.descripcion}

                                    </p>


                                    <button className="social-comments">

                                        Ver los {publicacion.comentarios} comentarios

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                {/* ============================= */}
                {/* PAQUETES DE VIAJE */}
                {/* ============================= */}

                <section className="home-section">

                    <div className="section-title">

                        <div>

                            <h4>Paquetes recomendados</h4>

                            <p>
                                Opciones para comenzar a planear tu viaje
                            </p>

                        </div>

                        <button className="link-button">
                            Ver todos
                        </button>

                    </div>


                    <div className="paquetes-grid">

                        {paquetes.map((paquete) => (

                            <div
                                className="paquete-card"
                                key={paquete.id}
                            >

                                <img
                                    src={paquete.imagen}
                                    alt={paquete.nombre}
                                />

                                <div className="paquete-info">

                                    <span className="paquete-dias">
                                        {paquete.dias}
                                    </span>

                                    <h5>
                                        {paquete.nombre}
                                    </h5>

                                    <p>
                                        {paquete.destino}
                                    </p>


                                    <div className="paquete-bottom">

                                        <div>

                                            <small>
                                                Desde
                                            </small>

                                            <strong>
                                                ${paquete.precio}
                                            </strong>

                                        </div>

                                        <button>
                                            Ver detalles
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            </main>
            )}
{/* ========================================= */}
{/* PERFIL DEL USUARIO */}
{/* ========================================= */}

{pantalla === "perfil" && (

    <main className="profile-page">

        {/* Parte superior del perfil */}
        <section className="profile-header-card">

            <div className="profile-avatar-large">

                {auth.currentUser?.displayName
                    ?.charAt(0)
                    .toUpperCase() ||
                    auth.currentUser?.email
                        ?.charAt(0)
                        .toUpperCase()
                }

            </div>


            <div className="profile-main-info">

                <h2>
                    {auth.currentUser?.displayName ||
                        auth.currentUser?.email}
                </h2>

                <span>
                    Viajero en Entre Destinos
                </span>


                <div className="profile-stats">

                    <div>
                        <strong>
                            {misPublicaciones.length}
                        </strong>

                        <span>
                            Publicaciones
                        </span>
                    </div>


                    <div>
                        <strong>
                            {publicacionesGuardadas.length}
                        </strong>

                        <span>
                            Guardados
                        </span>
                    </div>

                </div>

            </div>

        </section>


        {/* Pestañas del perfil */}
        <div className="profile-tabs">

            <button
                className={
                    seccionPerfil === "mis-publicaciones"
                        ? "profile-tab-active"
                        : ""
                }
                onClick={() =>
                    setSeccionPerfil("mis-publicaciones")
                }
            >
                Mis publicaciones
            </button>


            <button
                className={
                    seccionPerfil === "guardados"
                        ? "profile-tab-active"
                        : ""
                }
                onClick={() =>
                    setSeccionPerfil("guardados")
                }
            >
                Guardados
            </button>

        </div>


        {/* ================================= */}
        {/* MIS PUBLICACIONES */}
        {/* ================================= */}

        {seccionPerfil === "mis-publicaciones" && (

            <div className="profile-post-grid">

                {misPublicaciones.length === 0 ? (

                    <div className="profile-empty">

                        <h4>
                            Todavía no tienes publicaciones
                        </h4>

                        <p>
                            Comparte algún viaje con la comunidad.
                        </p>

                    </div>

                ) : (

                    misPublicaciones.map((publicacion) => (

                        <div
                            className="profile-post-card"
                            key={publicacion.id}
                        >

                            <img
                                src={publicacion.imagen}
                                alt={publicacion.ubicacion}
                            />


                            <div className="profile-post-card-info">

                                <strong>
                                    📍 {publicacion.ubicacion}
                                </strong>

                                <p>
                                    {publicacion.descripcion}
                                </p>

                                <span>
                                    ♥ {publicacion.likes || 0} Me gusta
                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        )}


        {/* ================================= */}
        {/* PUBLICACIONES GUARDADAS */}
        {/* ================================= */}

        {seccionPerfil === "guardados" && (

            <div className="profile-post-grid">

                {publicacionesGuardadas.length === 0 ? (

                    <div className="profile-empty">

                        <h4>
                            No tienes publicaciones guardadas
                        </h4>

                        <p>
                            Usa el botón Guardar en las publicaciones que te gusten.
                        </p>

                    </div>

                ) : (

                    publicacionesGuardadas.map(
                        (publicacion) => (

                            <div
                                className="profile-post-card"
                                key={publicacion.id}
                            >

                                <img
                                    src={publicacion.imagen}
                                    alt={publicacion.ubicacion}
                                />


                                <div className="profile-post-card-info">

                                    <div className="saved-user">

                                        <div className="social-avatar">

                                            {publicacion.usuario
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        <div>

                                            <strong>
                                                {publicacion.usuario}
                                            </strong>

                                            <span>
                                                📍 {publicacion.ubicacion}
                                            </span>

                                        </div>

                                    </div>


                                    <p>
                                        {publicacion.descripcion}
                                    </p>


                                    <button
                                        className="remove-saved"
                                        onClick={() =>
                                            cambiarGuardado(
                                                publicacion
                                            )
                                        }
                                    >
                                        Quitar de guardados
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

        )}

    </main>

)}

            {/* ============================= */}
            {/* MENÚ INFERIOR */}
            {/* ============================= */}

            <nav className="bottom-menu">

                <button
    className={
        pantalla === "inicio"
            ? "menu-activo"
            : ""
    }
    onClick={() =>
        setPantalla("inicio")
    }
>
    Inicio
</button>

                <button>
                    Explorar
                </button>

                <button>
                    Comunidad
                </button>

                <button>
                    Mis viajes
                </button>

                <button
    className={
        pantalla === "perfil"
            ? "menu-activo"
            : ""
    }
    onClick={() =>
        setPantalla("perfil")
    }
>
    Perfil
</button>

            </nav>

        </div>
    )
}