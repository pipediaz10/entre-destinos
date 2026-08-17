import { useMemo, useState } from "react"
import { auth } from "../services/firebase"
import { destinos } from "../data/destinos"
import { paquetes } from "../data/paquetes"
import { normalizarTexto } from "../utils/normalizarTexto"
import { Navbar } from "./Navbar"
import { Inicio } from "./Inicio"
import { Explorar } from "./Explorar"
import { Comunidad } from "./Comunidad"
import { DestinoDetalle } from "./DestinoDetalle"
import { Perfil } from "./Perfil"
import { Checkout } from "./Checkout"
import { Actividad } from "./Actividad"
import { useActividad } from "./useActividad"
import { usePublicaciones } from "./usePublicaciones"

export const Home = ({ onCerrarSesion }) => {
    const [pantalla, setPantalla] = useState("inicio")
    const [pantallaAnterior, setPantallaAnterior] = useState("inicio")
    const [seccionPerfil, setSeccionPerfil] = useState("mis-publicaciones")
    const [busquedaExplorar, setBusquedaExplorar] = useState("")
    const [destinoSeleccionado, setDestinoSeleccionado] = useState(null)
    const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null)
    const [fotoPerfil, setFotoPerfil] = useState(
        () => localStorage.getItem(`foto-perfil-${auth.currentUser?.uid || "invitado"}`) || ""
    )

    const {
        actividad,
        registrarActividad,
        limpiarActividad
    } = useActividad()

    const {
        publicaciones,
        crearPublicacion,
        cambiarLike,
        agregarComentario,
        cambiarGuardado,
        eliminarPublicacion
    } = usePublicaciones(registrarActividad)

    const textoBusqueda = normalizarTexto(busquedaExplorar.trim())

    const destinosExplorar = useMemo(() => destinos.filter((destino) =>
        normalizarTexto(destino.nombre).includes(textoBusqueda)
        || normalizarTexto(destino.descripcion).includes(textoBusqueda)
    ), [textoBusqueda])

    const publicacionesExplorar = useMemo(() => publicaciones.filter((publicacion) =>
        normalizarTexto(`${publicacion.ubicacion || ""} ${publicacion.descripcion || ""} ${publicacion.usuario || ""}`)
            .includes(textoBusqueda)
    ), [publicaciones, textoBusqueda])

    const misPublicaciones = publicaciones.filter(
        (publicacion) => publicacion.uid === auth.currentUser?.uid
    )

    const publicacionesGuardadas = publicaciones.filter(
        (publicacion) => publicacion.usuariosGuardaron?.includes(auth.currentUser?.uid)
    )

    const navegar = (destinoPantalla) => {
        if (destinoPantalla === "checkout") {
            setPantallaAnterior(pantalla === "checkout" ? "inicio" : pantalla)
        }
        setPantalla(destinoPantalla)
    }

    const abrirDestino = (destino) => {
        setPantallaAnterior(pantalla)
        setDestinoSeleccionado(destino)
        setPantalla("destino")
    }

    const abrirCheckout = (paquete) => {
        setPaqueteSeleccionado(paquete)
        setPantallaAnterior(pantalla)
        setPantalla("checkout")
    }

    const actualizarFotoPerfil = (nuevaFoto) => {
        const clave = `foto-perfil-${auth.currentUser?.uid || "invitado"}`

        if (nuevaFoto) {
            localStorage.setItem(clave, nuevaFoto)
        } else {
            localStorage.removeItem(clave)
        }

        setFotoPerfil(nuevaFoto)
        registrarActividad({
            tipo: "perfil",
            titulo: nuevaFoto ? "Actualizaste tu foto de perfil" : "Quitaste tu foto de perfil",
            detalle: "Perfil de Entre Destinos"
        })
    }

    return (
        <div className="home-page">
            <Navbar
                pantalla={pantalla}
                onNavegar={navegar}
                onCerrarSesion={onCerrarSesion}
            />

            {pantalla === "inicio" && (
                <Inicio
                    destinos={destinos}
                    paquetes={paquetes}
                    onAbrirDestino={abrirDestino}
                    onVerPaquete={abrirCheckout}
                />
            )}

            {pantalla === "comunidad" && (
                <main className="home-content">
                    <Comunidad
                        publicaciones={publicaciones}
                        crearPublicacion={crearPublicacion}
                        cambiarLike={cambiarLike}
                        agregarComentario={agregarComentario}
                        cambiarGuardado={cambiarGuardado}
                        eliminarPublicacion={eliminarPublicacion}
                        fotoPerfil={fotoPerfil}
                    />
                </main>
            )}

            {pantalla === "explorar" && (
                <Explorar
                    busqueda={busquedaExplorar}
                    setBusqueda={setBusquedaExplorar}
                    destinos={destinosExplorar}
                    publicaciones={publicacionesExplorar}
                    onAbrirDestino={abrirDestino}
                />
            )}

            {pantalla === "destino" && destinoSeleccionado && (
                <DestinoDetalle
                    destino={destinoSeleccionado}
                    onVolver={() => setPantalla(pantallaAnterior)}
                    onVerExperiencias={() => {
                        setBusquedaExplorar(destinoSeleccionado.nombre)
                        setPantalla("explorar")
                    }}
                />
            )}

            {pantalla === "perfil" && (
                <Perfil
                    misPublicaciones={misPublicaciones}
                    publicacionesGuardadas={publicacionesGuardadas}
                    seccionPerfil={seccionPerfil}
                    setSeccionPerfil={setSeccionPerfil}
                    cambiarGuardado={cambiarGuardado}
                    eliminarPublicacion={eliminarPublicacion}
                    fotoPerfil={fotoPerfil}
                    onActualizarFoto={actualizarFotoPerfil}
                />
            )}

            {pantalla === "actividad" && (
                <Actividad
                    actividad={actividad}
                    onLimpiarActividad={limpiarActividad}
                />
            )}

            {pantalla === "checkout" && (
                <Checkout
                    paquete={paqueteSeleccionado}
                    paquetes={paquetes}
                    onVolver={() => setPantalla(pantallaAnterior || "inicio")}
                    onRegistrarActividad={registrarActividad}
                />
            )}

        </div>
    )
}
