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
import { Profile } from "./Profile"



export const Home = () => {

    // ==========================================
    // DESTINOS
    // ==========================================

// Lista de destinos con información para mostrar
// cuando el usuario entra a cada destino.
const destinos = [

    {
        id: 1,

        nombre: "Costa Rica",

        descripcion: "Naturaleza, playas y aventura",

        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdUMGE43ewoAmW00TOx8qQGsTOu4WXvLT7M8wx1W7zohEahIEvy8Qvf35-&s=10",

        resumen:
            "Costa Rica es un destino ideal para quienes disfrutan de la naturaleza, las playas y las actividades al aire libre. Cuenta con volcanes, bosques, cataratas y una gran variedad de animales.",

        clima:
            "Tiene un clima tropical. Generalmente hay una época seca y una época lluviosa, aunque el clima puede cambiar dependiendo de la zona del país.",

        cultura:
            "Es conocido por la expresión Pura Vida, las fiestas patronales y comidas tradicionales como el gallo pinto, el casado y los tamales.",

        actividades: [
            "Visitar volcanes",
            "Ir a la playa",
            "Hacer canopy",
            "Practicar surf",
            "Conocer cataratas",
            "Hacer senderismo"
        ]
    },


    {
        id: 2,

        nombre: "México",

        descripcion: "Playas, cultura y gastronomía",

        imagen: "https://media.istockphoto.com/id/539002142/es/foto/el-centro-de-la-ciudad-de-m%C3%A9xico-en-el-crep%C3%BAsculo.jpg?s=612x612&w=0&k=20&c=PeNjZTlKhrT557mkHj3m8SPJ2DHdn8TQTgZpCAJAxtQ=",

        resumen:
            "México combina playas, ciudades, historia y gastronomía. Es un destino con una cultura muy variada y una gran cantidad de lugares históricos y turísticos.",

        clima:
            "El clima cambia dependiendo de la región. Las costas suelen ser más calientes y tropicales, mientras que algunas ciudades y zonas montañosas tienen temperaturas más frescas.",

        cultura:
            "Entre sus tradiciones destacan el Día de Muertos, la música mariachi y comidas como los tacos, tamales y enchiladas.",

        actividades: [
            "Visitar Cancún",
            "Conocer sitios arqueológicos",
            "Probar comida tradicional",
            "Visitar playas",
            "Recorrer ciudades históricas",
            "Conocer mercados locales"
        ]
    },


    {
        id: 3,

        nombre: "Perú",

        descripcion: "Historia, montañas y cultura",

        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrTcPz3Mt-06hncSOlOB2TjbYqVoxXK9I8vgLvJg3nSQ&s=10",

        resumen:
            "Perú es conocido por su historia, sus montañas y la cultura inca. Tiene sitios históricos muy importantes, paisajes naturales y una gastronomía reconocida.",

        clima:
            "El clima es variado. La costa suele ser más seca, las zonas montañosas son más frías y la región amazónica tiene un clima tropical y húmedo.",

        cultura:
            "La cultura peruana tiene una fuerte influencia inca. También destacan sus danzas, artesanías y comidas como el ceviche y el lomo saltado.",

        actividades: [
            "Visitar Machu Picchu",
            "Recorrer Cusco",
            "Hacer caminatas",
            "Conocer mercados",
            "Probar comida peruana",
            "Visitar sitios históricos"
        ]
    },


    {
        id: 4,

        nombre: "Dubái",

        descripcion: "Ciudad moderna, desierto y lujo",

        imagen: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",

        resumen:
            "Dubái es una ciudad de los Emiratos Árabes Unidos conocida por su arquitectura moderna, sus grandes edificios, playas y experiencias en el desierto.",

        clima:
            "Tiene un clima desértico. Gran parte del año es caliente y durante los meses de verano las temperaturas pueden ser bastante altas.",

        cultura:
            "Combina una ciudad muy moderna con tradiciones árabes. Se pueden encontrar mercados tradicionales, gastronomía local y costumbres propias de los Emiratos Árabes Unidos.",

        actividades: [
            "Visitar el Burj Khalifa",
            "Hacer un tour por el desierto",
            "Visitar mercados tradicionales",
            "Ir a la playa",
            "Conocer centros comerciales",
            "Realizar paseos en camello"
        ]
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

// Abre los archivos del dispositivo y prepara la foto para Firebase
const seleccionarImagen = (event) => {

    const archivo = event.target.files[0]

    if (!archivo) {
        return
    }

    if (!archivo.type.startsWith("image/")) {
        setMensajePublicacion("Selecciona un archivo de imagen")
        return
    }

    const lector = new FileReader()

    lector.onload = () => {

        const foto = new Image()

        foto.onload = () => {

            const tamañoMaximo = 900
            let ancho = foto.width
            let alto = foto.height

            if (ancho > alto && ancho > tamañoMaximo) {
                alto = Math.round((alto * tamañoMaximo) / ancho)
                ancho = tamañoMaximo
            } else if (alto > tamañoMaximo) {
                ancho = Math.round((ancho * tamañoMaximo) / alto)
                alto = tamañoMaximo
            }

            const canvas = document.createElement("canvas")
            canvas.width = ancho
            canvas.height = alto

            const contexto = canvas.getContext("2d")
            contexto.drawImage(foto, 0, 0, ancho, alto)

            const imagenPreparada = canvas.toDataURL(
                "image/jpeg",
                0.7
            )

            setImagen(imagenPreparada)
            setMensajePublicacion("Foto seleccionada correctamente")
        }

        foto.src = lector.result
    }

    lector.readAsDataURL(archivo)
}


// Mensaje para indicar si se publicó correctamente
const [mensajePublicacion, setMensajePublicacion] = useState("")

// Controla si el formulario para publicar está abierto o cerrado
const [mostrarFormulario, setMostrarFormulario] = useState(false)

// Controla si estamos viendo Inicio o Perfil
const [pantalla, setPantalla] = useState("inicio")

// Guarda lo que el usuario escribe en el buscador de Explorar
const [busquedaExplorar, setBusquedaExplorar] = useState("")

// Guarda el destino que el usuario seleccionó
const [destinoSeleccionado, setDestinoSeleccionado] = useState(null)

// Guarda desde qué pantalla entramos al destino
const [pantallaAnterior, setPantallaAnterior] = useState("inicio")

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

                likes: Math.max(
                    (publicacion.likes || 0) - 1,
                    0
                )
            })

        } else {

            // Si no había dado like, lo agregamos
            await updateDoc(publicacionRef, {

                usuariosLike: arrayUnion(
                    usuarioActual.uid
                ),

                likes: (publicacion.likes || 0) + 1
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


// Esta función elimina tildes y convierte el texto a minúsculas.
// Así "México" también se puede encontrar escribiendo "mexico".
const normalizarTexto = (texto) => {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
}


// Limpiamos lo que escribe el usuario
const textoBusqueda = normalizarTexto(
    busquedaExplorar.trim()
)


// Filtramos los destinos
const destinosExplorar = destinos.filter(
    (destino) => {

        return (
            normalizarTexto(destino.nombre)
                .includes(textoBusqueda) ||

            normalizarTexto(destino.descripcion)
                .includes(textoBusqueda)
        )
    }
)


// Filtramos las publicaciones
const publicacionesExplorar = publicaciones.filter(
    (publicacion) => {

        const informacionPublicacion = normalizarTexto(`
            ${publicacion.ubicacion || ""}
            ${publicacion.descripcion || ""}
            ${publicacion.usuario || ""}
        `)

        return informacionPublicacion.includes(
            textoBusqueda
        )
    }
)

// Abre la pantalla con la información del destino
const abrirDestino = (destino) => {

    // Guardamos desde dónde entró el usuario
    setPantallaAnterior(pantalla)

    // Guardamos el destino seleccionado
    setDestinoSeleccionado(destino)

    // Cambiamos a la pantalla del destino
    setPantalla("destino")
}

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
    onClick={() =>
        abrirDestino(destino)
    }
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


        {/* Foto seleccionada desde el dispositivo */}
        <div className="campo-publicacion">

            <label>
                Foto
            </label>

            <input
                type="file"
                accept="image/*"
                onChange={seleccionarImagen}
            />

            {imagen && (
                <img
                    src={imagen}
                    alt="Vista previa"
                    style={{
                        width: "100%",
                        maxHeight: "280px",
                        marginTop: "12px",
                        borderRadius: "12px",
                        objectFit: "cover"
                    }}
                />
            )}

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
    💬 {publicacion.listaComentarios?.length || 0} comentarios
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
                                        {publicacion.usuariosLike?.length || 0} Me gusta
                                    </strong>


                                    <p>

                                        <b>
                                            {publicacion.usuario}
                                        </b>

                                        {" "}

                                        {publicacion.descripcion}

                                    </p>


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
{/* PANTALLA EXPLORAR */}
{/* ========================================= */}

{pantalla === "explorar" && (

    <main className="explore-page">


        {/* Encabezado de Explorar */}
        <section className="explore-header">

            <span className="explore-small">
                Explorar
            </span>

            <h2>
                Encuentra tu próximo destino
            </h2>

            <p>
                Busca destinos, lugares o experiencias
                compartidas por otros viajeros.
            </p>


            {/* Buscador */}
            <div className="explore-search">

                <span>
                    🔎
                </span>

                <input
                    type="text"
                    placeholder="Buscar Costa Rica, México, playa..."
                    value={busquedaExplorar}
                    onChange={(event) =>
                        setBusquedaExplorar(
                            event.target.value
                        )
                    }
                />

            </div>

        </section>


        {/* ================================= */}
        {/* DESTINOS */}
        {/* ================================= */}

        <section className="home-section">

            <div className="section-title">

                <div>

                    <h4>
                        Destinos
                    </h4>

                    <p>
                        Lugares que puedes descubrir
                    </p>

                </div>

            </div>


            {destinosExplorar.length === 0 ? (

                <div className="explore-empty">

                    <p>
                        No encontramos destinos con esa búsqueda.
                    </p>

                </div>

            ) : (

                <div className="destinos-grid">

                    {destinosExplorar.map(
                        (destino) => (

                            <div
    className="destino-card"
    key={destino.id}
    onClick={() =>
        abrirDestino(destino)
    }
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

                        )
                    )}

                </div>

            )}

        </section>


        {/* ================================= */}
        {/* PUBLICACIONES PARA DESCUBRIR */}
        {/* ================================= */}

        <section className="home-section">

            <div className="section-title">

                <div>

                    <h4>
                        Experiencias de viajeros
                    </h4>

                    <p>
                        Descubre lugares compartidos
                        por la comunidad
                    </p>

                </div>

            </div>


            {publicacionesExplorar.length === 0 ? (

                <div className="explore-empty">

                    <p>
                        No encontramos publicaciones
                        con esa búsqueda.
                    </p>

                </div>

            ) : (

                <div className="explore-post-grid">

                    {publicacionesExplorar.map(
                        (publicacion) => (

                            <div
                                className="explore-post-card"
                                key={publicacion.id}
                            >

                                <img
                                    src={publicacion.imagen}
                                    alt={publicacion.ubicacion}
                                />


                                <div className="explore-post-info">


                                    {/* Usuario */}
                                    <div className="explore-user">

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


                                    {/* Descripción */}
                                    <p>
                                        {publicacion.descripcion}
                                    </p>


                                    {/* Información de la publicación */}
                                    <span className="explore-post-stats">

                                        ♥ {publicacion.likes || 0}
                                        {" · "}
                                        💬 {publicacion.comentarios || 0}

                                    </span>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>

    </main>

)}


{/* ========================================= */}
{/* INFORMACIÓN DEL DESTINO */}
{/* ========================================= */}

{pantalla === "destino" && destinoSeleccionado && (

    <main className="destination-detail-page">


        {/* Botón para regresar */}
        <button
            className="destination-back"
            onClick={() =>
                setPantalla(pantallaAnterior)
            }
        >
            ← Volver
        </button>


        {/* Información principal */}
        <section className="destination-detail-card">


            {/* Imagen del destino */}
            <img
                src={destinoSeleccionado.imagen}
                alt={destinoSeleccionado.nombre}
                className="destination-detail-image"
            />


            <div className="destination-detail-info">

                <span className="destination-small">
                    Destino
                </span>

                <h1>
                    {destinoSeleccionado.nombre}
                </h1>

                <p>
                    {destinoSeleccionado.descripcion}
                </p>


                {/* Resumen del destino */}
<p className="destination-summary">

    {destinoSeleccionado.resumen}

</p>


{/* Información del destino */}
<div className="destination-travel-info">


    {/* Clima */}
    <div className="destination-travel-card">

        <h4>
            ☀️ Clima
        </h4>

        <p>
            {destinoSeleccionado.clima}
        </p>

    </div>


    {/* Cultura */}
    <div className="destination-travel-card">

        <h4>
            🎭 Cultura y tradiciones
        </h4>

        <p>
            {destinoSeleccionado.cultura}
        </p>

    </div>


    {/* Actividades */}
    <div className="destination-travel-card">

        <h4>
            🧳 ¿Qué puedes hacer?
        </h4>


        <div className="destination-activities">

            {destinoSeleccionado.actividades?.map(
                (actividad, index) => (

                    <span key={index}>
                        {actividad}
                    </span>

                )
            )}

        </div>

    </div>

</div>

            </div>

        </section>


        {/* Sección inferior */}
        <section className="destination-extra">

            <h3>
                Descubre {destinoSeleccionado.nombre}
            </h3>

            <p>
                Encuentra experiencias de otros viajeros,
                lugares interesantes y opciones para comenzar
                a planear tu viaje.
            </p>


            <button
                onClick={() => {
                    setBusquedaExplorar(
                        destinoSeleccionado.nombre
                    )

                    setPantalla("explorar")
                }}
            >
                Ver experiencias
            </button>

        </section>

    </main>

)}

{/* ========================================= */}
{/* PERFIL DEL USUARIO */}
{/* ========================================= */}

{pantalla === "perfil" && (

    <Profile
        publicaciones={publicaciones}
        recargarPublicaciones={cargarPublicaciones}
        onCompartir={() => {
            setPantalla("inicio")
            setMostrarFormulario(true)

            setTimeout(() => {
                document
                    .querySelector(".real-post-form")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    })
            }, 100)
        }}
    />

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

                <button
    className={
        pantalla === "explorar"
            ? "menu-activo"
            : ""
    }
    onClick={() =>
        setPantalla("explorar")
    }
>
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