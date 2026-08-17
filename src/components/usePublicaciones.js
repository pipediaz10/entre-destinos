import { useCallback, useEffect, useMemo, useState } from "react"
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from "firebase/firestore"
import { auth, db } from "../services/firebase"

const publicacionesIniciales = [
    {
        id: "demo-helena",
        uid: "demo-helena",
        esPredeterminada: true,
        usuario: "Helena Rodríguez",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        ubicacion: "Manuel Antonio, Costa Rica",
        descripcion: "Un día perfecto entre senderos, naturaleza y una playa increíble. Definitivamente quiero volver. 🌴✨",
        imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
        likes: 128,
        usuariosLike: [],
        usuariosGuardaron: [],
        comentarios: 2,
        listaComentarios: [
            { usuario: "Carlos Méndez", texto: "¡Qué increíble lugar!", fecha: 1 },
            { usuario: "Sofía Vargas", texto: "Esa playa se ve espectacular 😍", fecha: 2 }
        ]
    },
    {
        id: "demo-carlos",
        uid: "demo-carlos",
        esPredeterminada: true,
        usuario: "Carlos Méndez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        ubicacion: "La Fortuna, Costa Rica",
        descripcion: "Amanecer con vista al Volcán Arenal. El clima estuvo perfecto para caminar y conocer las aguas termales. 🌋",
        imagen: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80",
        likes: 94,
        usuariosLike: [],
        usuariosGuardaron: [],
        comentarios: 2,
        listaComentarios: [
            { usuario: "Daniela Mora", texto: "Tengo este lugar en mi lista.", fecha: 3 },
            { usuario: "Marco Salas", texto: "La Fortuna nunca falla 🙌", fecha: 4 }
        ]
    },
    {
        id: "demo-sofia",
        uid: "demo-sofia",
        esPredeterminada: true,
        usuario: "Sofía Vargas",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        ubicacion: "Machu Picchu, Perú",
        descripcion: "Uno de esos lugares que se sienten todavía más impresionantes en persona. Mucha historia y paisajes inolvidables. ⛰️",
        imagen: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80",
        likes: 211,
        usuariosLike: [],
        usuariosGuardaron: [],
        comentarios: 1,
        listaComentarios: [
            { usuario: "Helena Rodríguez", texto: "Necesito hacer ese viaje algún día.", fecha: 5 }
        ]
    },
    {
        id: "demo-marco",
        uid: "demo-marco",
        esPredeterminada: true,
        usuario: "Marco Salas",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        ubicacion: "París, Francia",
        descripcion: "Terminando el día caminando por París. La ciudad de noche tiene otra energía completamente distinta. 🇫🇷",
        imagen: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80",
        likes: 176,
        usuariosLike: [],
        usuariosGuardaron: [],
        comentarios: 2,
        listaComentarios: [
            { usuario: "Sofía Vargas", texto: "Qué fotón 📸", fecha: 6 },
            { usuario: "Carlos Méndez", texto: "París de noche es otra cosa.", fecha: 7 }
        ]
    }
]

export const usePublicaciones = (registrarActividad) => {
    const [publicacionesFirebase, setPublicacionesFirebase] = useState([])
    const [publicacionesDemo, setPublicacionesDemo] = useState(publicacionesIniciales)

    const publicaciones = useMemo(
        () => [...publicacionesFirebase, ...publicacionesDemo],
        [publicacionesFirebase, publicacionesDemo]
    )

    const cargarPublicaciones = useCallback(async () => {
        try {
            const consulta = query(collection(db, "publicaciones"), orderBy("fecha", "desc"))
            const resultado = await getDocs(consulta)
            setPublicacionesFirebase(resultado.docs.map((documento) => ({
                id: documento.id,
                ...documento.data()
            })))
        } catch (error) {
            console.error("Error cargando publicaciones:", error)
            setPublicacionesFirebase([])
        }
    }, [])

    useEffect(() => {
        cargarPublicaciones()
    }, [cargarPublicaciones])

    const crearPublicacion = async ({ ubicacion, descripcion, imagen }) => {
        const usuarioActual = auth.currentUser
        if (!usuarioActual) return { ok: false, mensaje: "Debes iniciar sesión para publicar" }
        if (!ubicacion.trim() || !descripcion.trim() || !imagen.trim()) {
            return { ok: false, mensaje: "Completa todos los campos" }
        }

        try {
            await addDoc(collection(db, "publicaciones"), {
                uid: usuarioActual.uid,
                usuario: usuarioActual.displayName || usuarioActual.email,
                avatar: localStorage.getItem(`foto-perfil-${usuarioActual.uid}`) || "",
                ubicacion,
                descripcion,
                imagen,
                likes: 0,
                usuariosLike: [],
                usuariosGuardaron: [],
                listaComentarios: [],
                comentarios: 0,
                fecha: serverTimestamp()
            })
            await cargarPublicaciones()
            registrarActividad?.({
                tipo: "publicacion",
                titulo: "Creaste una publicación",
                detalle: ubicacion
            })
            return { ok: true, mensaje: "Publicación creada correctamente" }
        } catch (error) {
            console.error("Error creando publicación:", error)
            return { ok: false, mensaje: "No se pudo crear la publicación" }
        }
    }

    const cambiarLike = async (publicacion) => {
        const usuarioActual = auth.currentUser
        if (!usuarioActual) return

        if (publicacion.esPredeterminada) {
            setPublicacionesDemo((actuales) => actuales.map((item) => {
                if (item.id !== publicacion.id) return item

                const yaDioLike = item.usuariosLike?.includes(usuarioActual.uid)
                return {
                    ...item,
                    usuariosLike: yaDioLike
                        ? item.usuariosLike.filter((uid) => uid !== usuarioActual.uid)
                        : [...(item.usuariosLike || []), usuarioActual.uid],
                    likes: yaDioLike
                        ? Math.max((item.likes || 0) - 1, 0)
                        : (item.likes || 0) + 1
                }
            }))
            const yaDioLike = publicacion.usuariosLike?.includes(usuarioActual.uid)
            registrarActividad?.({
                tipo: "like",
                titulo: yaDioLike ? "Quitaste un Me gusta" : "Diste Me gusta",
                detalle: publicacion.ubicacion
            })
            return
        }

        try {
            const publicacionRef = doc(db, "publicaciones", publicacion.id)
            const yaDioLike = publicacion.usuariosLike?.includes(usuarioActual.uid)
            await updateDoc(publicacionRef, yaDioLike
                ? {
                    usuariosLike: arrayRemove(usuarioActual.uid),
                    likes: Math.max((publicacion.likes || 0) - 1, 0)
                }
                : {
                    usuariosLike: arrayUnion(usuarioActual.uid),
                    likes: (publicacion.likes || 0) + 1
                }
            )
            await cargarPublicaciones()
            registrarActividad?.({
                tipo: "like",
                titulo: yaDioLike ? "Quitaste un Me gusta" : "Diste Me gusta",
                detalle: publicacion.ubicacion
            })
        } catch (error) {
            console.error("Error actualizando el like:", error)
        }
    }

    const agregarComentario = async (publicacion, texto) => {
        const usuarioActual = auth.currentUser
        if (!usuarioActual || !texto.trim()) return false

        const nuevoComentario = {
            uid: usuarioActual.uid,
            usuario: usuarioActual.displayName || usuarioActual.email,
            texto: texto.trim(),
            fecha: Date.now()
        }

        if (publicacion.esPredeterminada) {
            setPublicacionesDemo((actuales) => actuales.map((item) => (
                item.id === publicacion.id
                    ? {
                        ...item,
                        listaComentarios: [...(item.listaComentarios || []), nuevoComentario],
                        comentarios: (item.comentarios || 0) + 1
                    }
                    : item
            )))
            registrarActividad?.({
                tipo: "comentario",
                titulo: "Comentaste una publicación",
                detalle: publicacion.ubicacion
            })
            return true
        }

        try {
            const publicacionRef = doc(db, "publicaciones", publicacion.id)
            await updateDoc(publicacionRef, {
                listaComentarios: arrayUnion(nuevoComentario),
                comentarios: (publicacion.comentarios || 0) + 1
            })
            await cargarPublicaciones()
            registrarActividad?.({
                tipo: "comentario",
                titulo: "Comentaste una publicación",
                detalle: publicacion.ubicacion
            })
            return true
        } catch (error) {
            console.error("Error agregando comentario:", error)
            return false
        }
    }

    const cambiarGuardado = async (publicacion) => {
        const usuarioActual = auth.currentUser
        if (!usuarioActual) return

        if (publicacion.esPredeterminada) {
            setPublicacionesDemo((actuales) => actuales.map((item) => {
                if (item.id !== publicacion.id) return item

                const yaGuardada = item.usuariosGuardaron?.includes(usuarioActual.uid)
                return {
                    ...item,
                    usuariosGuardaron: yaGuardada
                        ? item.usuariosGuardaron.filter((uid) => uid !== usuarioActual.uid)
                        : [...(item.usuariosGuardaron || []), usuarioActual.uid]
                }
            }))
            const yaGuardada = publicacion.usuariosGuardaron?.includes(usuarioActual.uid)
            registrarActividad?.({
                tipo: "guardado",
                titulo: yaGuardada ? "Quitaste una publicación de guardados" : "Guardaste una publicación",
                detalle: publicacion.ubicacion
            })
            return
        }

        try {
            const publicacionRef = doc(db, "publicaciones", publicacion.id)
            const yaGuardada = publicacion.usuariosGuardaron?.includes(usuarioActual.uid)
            await updateDoc(publicacionRef, {
                usuariosGuardaron: yaGuardada
                    ? arrayRemove(usuarioActual.uid)
                    : arrayUnion(usuarioActual.uid)
            })
            await cargarPublicaciones()
            registrarActividad?.({
                tipo: "guardado",
                titulo: yaGuardada ? "Quitaste una publicación de guardados" : "Guardaste una publicación",
                detalle: publicacion.ubicacion
            })
        } catch (error) {
            console.error("Error guardando publicación:", error)
        }
    }

    const eliminarPublicacion = async (publicacion) => {
        const usuarioActual = auth.currentUser

        if (!usuarioActual || publicacion.esPredeterminada || publicacion.uid !== usuarioActual.uid) {
            return { ok: false, mensaje: "Solo puedes eliminar tus propias publicaciones" }
        }

        try {
            await deleteDoc(doc(db, "publicaciones", publicacion.id))
            await cargarPublicaciones()
            registrarActividad?.({
                tipo: "eliminacion",
                titulo: "Eliminaste una publicación",
                detalle: publicacion.ubicacion
            })
            return { ok: true, mensaje: "Publicación eliminada" }
        } catch (error) {
            console.error("Error eliminando publicación:", error)
            return { ok: false, mensaje: "No se pudo eliminar la publicación" }
        }
    }

    return {
        publicaciones,
        crearPublicacion,
        cambiarLike,
        agregarComentario,
        cambiarGuardado,
        eliminarPublicacion
    }
}
