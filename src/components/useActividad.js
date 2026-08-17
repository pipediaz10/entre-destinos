import { useCallback, useMemo, useState } from "react"
import { auth } from "../services/firebase"

const obtenerClave = () => `actividad-${auth.currentUser?.uid || "invitado"}`

const leerActividad = () => {
    try {
        const guardada = localStorage.getItem(obtenerClave())
        return guardada ? JSON.parse(guardada) : []
    } catch (error) {
        console.error("No se pudo cargar la actividad:", error)
        return []
    }
}

export const useActividad = () => {
    const [actividad, setActividad] = useState(leerActividad)

    const registrarActividad = useCallback(({ tipo, titulo, detalle }) => {
        const nuevaActividad = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            tipo,
            titulo,
            detalle,
            fecha: Date.now()
        }

        setActividad((actual) => {
            const actualizada = [nuevaActividad, ...actual].slice(0, 100)
            localStorage.setItem(obtenerClave(), JSON.stringify(actualizada))
            return actualizada
        })
    }, [])

    const limpiarActividad = useCallback(() => {
        localStorage.removeItem(obtenerClave())
        setActividad([])
    }, [])

    const actividadOrdenada = useMemo(
        () => [...actividad].sort((a, b) => b.fecha - a.fecha),
        [actividad]
    )

    return {
        actividad: actividadOrdenada,
        registrarActividad,
        limpiarActividad
    }
}
