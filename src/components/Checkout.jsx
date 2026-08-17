import { useMemo, useState } from "react"
import { auth } from "../services/firebase"

const hoy = new Date().toISOString().split("T")[0]

const formatearTelefono = (valor) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 8)

    if (numeros.length > 4) {
        return `${numeros.slice(0, 4)}-${numeros.slice(4)}`
    }

    return numeros
}

const formatearTarjeta = (valor) => {
    return valor
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim()
}

const formatearVencimiento = (valor, valorAnterior) => {
    let numeros = valor.replace(/\D/g, "").slice(0, 4)

    if (numeros.length === 1 && Number(numeros) > 1) {
        numeros = `0${numeros}`
    }

    if (numeros.length >= 2) {
        const mes = Number(numeros.slice(0, 2))

        if (mes < 1 || mes > 12) {
            return valorAnterior
        }
    }

    if (numeros.length > 2) {
        return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
    }

    return numeros
}

const vencimientoValido = (valor) => {
    if (!/^\d{2}\/\d{2}$/.test(valor)) return false

    const [mes, ano] = valor.split("/").map(Number)
    if (mes < 1 || mes > 12) return false

    const fechaActual = new Date()
    const anoActual = Number(String(fechaActual.getFullYear()).slice(-2))
    const mesActual = fechaActual.getMonth() + 1

    return ano > anoActual || (ano === anoActual && mes >= mesActual)
}

export const Checkout = ({ paquete, paquetes = [], onVolver, onRegistrarActividad }) => {
    const [paqueteId, setPaqueteId] = useState(paquete?.id ? String(paquete.id) : "")
    const [nombreCompleto, setNombreCompleto] = useState(auth.currentUser?.displayName || "")
    const [correo, setCorreo] = useState(auth.currentUser?.email || "")
    const [telefono, setTelefono] = useState("")
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [viajeros, setViajeros] = useState(1)
    const [metodoPago, setMetodoPago] = useState("tarjeta")

    const [nombreTarjeta, setNombreTarjeta] = useState("")
    const [numeroTarjeta, setNumeroTarjeta] = useState("")
    const [vencimiento, setVencimiento] = useState("")
    const [cvv, setCvv] = useState("")
    const [correoPaypal, setCorreoPaypal] = useState("")
    const [telefonoSinpe, setTelefonoSinpe] = useState("")

    const [codigoPromo, setCodigoPromo] = useState("")
    const [descuento, setDescuento] = useState(0)
    const [mensaje, setMensaje] = useState("")

    const paqueteActual = useMemo(
        () => paquetes.find((item) => String(item.id) === paqueteId) || null,
        [paqueteId, paquetes]
    )

    const subtotal = paqueteActual ? paqueteActual.precio * Number(viajeros || 1) : 0
    const cargoServicio = subtotal * 0.05
    const total = Math.max(0, subtotal + cargoServicio - descuento)

    const aplicarPromocion = () => {
        setMensaje("")
        if (!subtotal) {
            setMensaje("Primero selecciona un paquete.")
            return
        }

        if (codigoPromo.trim().toUpperCase() === "VIAJE10") {
            setDescuento(subtotal * 0.10)
            setMensaje("Código VIAJE10 aplicado: 10% de descuento.")
        } else {
            setDescuento(0)
            setMensaje("Código no válido. Para probar el demo usa VIAJE10.")
        }
    }

    const validarPago = () => {
        if (metodoPago === "tarjeta") {
            const tarjetaLimpia = numeroTarjeta.replace(/\s/g, "")
            if (!nombreTarjeta.trim() || !/^\d{16}$/.test(tarjetaLimpia)) {
                return "El número de tarjeta debe contener exactamente 16 dígitos."
            }
            if (!vencimientoValido(vencimiento)) {
                return "Ingresa un vencimiento válido en formato MM/AA."
            }
            if (!/^\d{3}$/.test(cvv)) {
                return "El CVV debe contener exactamente 3 dígitos."
            }
        }

        if (metodoPago === "paypal" && !correoPaypal.trim()) {
            return "Ingresa el correo asociado a PayPal."
        }

        if (metodoPago === "sinpe" && !/^\d{4}-\d{4}$/.test(telefonoSinpe)) {
            return "El teléfono de SINPE debe contener exactamente 8 dígitos."
        }

        return ""
    }

    const confirmarReserva = (event) => {
        event.preventDefault()
        setMensaje("")

        if (!paqueteActual) {
            setMensaje("Selecciona el paquete que quieres reservar.")
            return
        }

        if (!nombreCompleto.trim() || !correo.trim() || !telefono.trim() || !fechaInicio || !fechaFin) {
            setMensaje("Completa tus datos personales y el rango de fechas.")
            return
        }

        if (!/^\d{4}-\d{4}$/.test(telefono)) {
            setMensaje("El teléfono debe contener exactamente 8 dígitos.")
            return
        }

        if (fechaFin < fechaInicio) {
            setMensaje("La fecha final no puede ser anterior a la fecha inicial.")
            return
        }

        const errorPago = validarPago()
        if (errorPago) {
            setMensaje(errorPago)
            return
        }

        onRegistrarActividad?.({
            tipo: "reserva",
            titulo: "Realizaste una reserva",
            detalle: `${paqueteActual.nombre}: ${fechaInicio} al ${fechaFin} · ${viajeros} viajero${Number(viajeros) === 1 ? "" : "s"}`
        })

        setMensaje(
            `Reserva de demostración creada para ${nombreCompleto}: ${paqueteActual.nombre}, del ${fechaInicio} al ${fechaFin}. Total: $${total.toFixed(2)}.`
        )
    }

    return (
        <main className="home-content checkout-page">
            <button className="destination-back" onClick={onVolver}>← Volver</button>

            <div className="checkout-heading">
                <div>
                    <span className="checkout-eyebrow">Reserva tu próximo viaje</span>
                    <h2>Pago y datos de viaje</h2>
                    <p>Selecciona un paquete, indica el rango de fechas y completa el método de pago.</p>
                </div>
            </div>

            <form className="checkout-layout" onSubmit={confirmarReserva}>
                <section className="checkout-form-card">
                    <h3>1. Paquete y fechas</h3>

                    <div className="checkout-field">
                        <label htmlFor="checkout-paquete">Paquete</label>
                        <select
                            id="checkout-paquete"
                            value={paqueteId}
                            onChange={(event) => {
                                setPaqueteId(event.target.value)
                                setDescuento(0)
                                setMensaje("")
                            }}
                            required
                        >
                            <option value="">Selecciona un paquete</option>
                            {paquetes.map((item) => (
                                <option key={item.id} value={String(item.id)}>
                                    {item.nombre} — {item.destino} — ${item.precio}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="checkout-field-row">
                        <div className="checkout-field">
                            <label htmlFor="checkout-fecha-inicio">Fecha de inicio</label>
                            <input
                                id="checkout-fecha-inicio"
                                type="date"
                                min={hoy}
                                value={fechaInicio}
                                onChange={(event) => {
                                    setFechaInicio(event.target.value)
                                    if (fechaFin && event.target.value > fechaFin) setFechaFin("")
                                }}
                                required
                            />
                        </div>

                        <div className="checkout-field">
                            <label htmlFor="checkout-fecha-fin">Fecha de regreso</label>
                            <input
                                id="checkout-fecha-fin"
                                type="date"
                                min={fechaInicio || hoy}
                                value={fechaFin}
                                onChange={(event) => setFechaFin(event.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="checkout-field">
                        <label htmlFor="checkout-viajeros">Viajeros</label>
                        <input
                            id="checkout-viajeros"
                            type="number"
                            min="1"
                            max="10"
                            value={viajeros}
                            onChange={(event) => setViajeros(Math.min(10, Math.max(1, Number(event.target.value) || 1)))}
                            required
                        />
                    </div>

                    <h3>2. Datos del viajero</h3>

                    <div className="checkout-field">
                        <label htmlFor="checkout-nombre">Nombre completo</label>
                        <input
                            id="checkout-nombre"
                            type="text"
                            placeholder="Ej: Nombre Apellido"
                            value={nombreCompleto}
                            onChange={(event) => setNombreCompleto(event.target.value)}
                            required
                        />
                    </div>

                    <div className="checkout-field-row">
                        <div className="checkout-field">
                            <label htmlFor="checkout-correo">Correo electrónico</label>
                            <input
                                id="checkout-correo"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={correo}
                                onChange={(event) => setCorreo(event.target.value)}
                                required
                            />
                        </div>

                        <div className="checkout-field">
                            <label htmlFor="checkout-telefono">Teléfono</label>
                            <input
                                id="checkout-telefono"
                                type="tel"
                                placeholder="8888-8888"
                                value={telefono}
                                onChange={(event) => setTelefono(formatearTelefono(event.target.value))}
                                maxLength="9"
                                required
                            />
                        </div>
                    </div>

                    <h3>3. Método de pago</h3>

                    <div className="checkout-payment-options">
                        <label className={metodoPago === "tarjeta" ? "checkout-payment-active" : ""}>
                            <input type="radio" name="metodoPago" value="tarjeta" checked={metodoPago === "tarjeta"} onChange={(event) => setMetodoPago(event.target.value)} />
                            Tarjeta
                        </label>
                        <label className={metodoPago === "paypal" ? "checkout-payment-active" : ""}>
                            <input type="radio" name="metodoPago" value="paypal" checked={metodoPago === "paypal"} onChange={(event) => setMetodoPago(event.target.value)} />
                            PayPal
                        </label>
                        <label className={metodoPago === "sinpe" ? "checkout-payment-active" : ""}>
                            <input type="radio" name="metodoPago" value="sinpe" checked={metodoPago === "sinpe"} onChange={(event) => setMetodoPago(event.target.value)} />
                            SINPE
                        </label>
                    </div>

                    {metodoPago === "tarjeta" && (
                        <div className="payment-details-box">
                            <div className="checkout-field">
                                <label htmlFor="nombre-tarjeta">Nombre en la tarjeta</label>
                                <input id="nombre-tarjeta" type="text" value={nombreTarjeta} onChange={(event) => setNombreTarjeta(event.target.value)} placeholder="Como aparece en la tarjeta" required />
                            </div>

                            <div className="checkout-field">
                                <label htmlFor="numero-tarjeta">Número de tarjeta</label>
                                <input
                                    id="numero-tarjeta"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="19"
                                    value={numeroTarjeta}
                                    onChange={(event) => setNumeroTarjeta(formatearTarjeta(event.target.value))}
                                    placeholder="4242 4242 4242 4242"
                                    required
                                />
                            </div>

                            <div className="checkout-field-row">
                                <div className="checkout-field">
                                    <label htmlFor="vencimiento">Vencimiento</label>
                                    <input id="vencimiento" type="text" inputMode="numeric" maxLength="5" value={vencimiento} onChange={(event) => setVencimiento(formatearVencimiento(event.target.value, vencimiento))} placeholder="MM/AA" required />
                                </div>
                                <div className="checkout-field">
                                    <label htmlFor="cvv">CVV</label>
                                    <input id="cvv" type="password" inputMode="numeric" maxLength="3" value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="123" required />
                                </div>
                            </div>
                        </div>
                    )}

                    {metodoPago === "paypal" && (
                        <div className="payment-details-box">
                            <div className="checkout-field">
                                <label htmlFor="paypal-email">Correo de PayPal</label>
                                <input id="paypal-email" type="email" value={correoPaypal} onChange={(event) => setCorreoPaypal(event.target.value)} placeholder="tu-correo@paypal.com" required />
                            </div>
                        </div>
                    )}

                    {metodoPago === "sinpe" && (
                        <div className="payment-details-box">
                            <div className="checkout-field">
                                <label htmlFor="sinpe-telefono">Teléfono de SINPE Móvil</label>
                                <input id="sinpe-telefono" type="tel" maxLength="9" value={telefonoSinpe} onChange={(event) => setTelefonoSinpe(formatearTelefono(event.target.value))} placeholder="8888-8888" required />
                            </div>
                        </div>
                    )}

                </section>

                <aside className="checkout-summary-card">
                    <h3>Resumen de la reserva</h3>

                    {paqueteActual ? (
                        <>
                            <img src={paqueteActual.imagen} alt={paqueteActual.nombre} className="checkout-package-image" />
                            <div className="checkout-package-name">
                                <strong>{paqueteActual.nombre}</strong>
                                <span>{paqueteActual.destino}</span>
                                <small>{paqueteActual.dias}</small>
                            </div>
                        </>
                    ) : (
                        <div className="checkout-empty-package">Selecciona un paquete para ver aquí el resumen.</div>
                    )}

                    {(fechaInicio || fechaFin) && (
                        <div className="checkout-date-summary">
                            <span>Fechas</span>
                            <strong>{fechaInicio || "—"} → {fechaFin || "—"}</strong>
                        </div>
                    )}

                    <div className="checkout-promo">
                        <input type="text" placeholder="Código promocional" value={codigoPromo} onChange={(event) => setCodigoPromo(event.target.value)} />
                        <button type="button" onClick={aplicarPromocion}>Aplicar</button>
                    </div>

                    <div className="checkout-totals">
                        <div><span>Paquete x {viajeros}</span><strong>${subtotal.toFixed(2)}</strong></div>
                        <div><span>Cargo de servicio</span><strong>${cargoServicio.toFixed(2)}</strong></div>
                        {descuento > 0 && <div className="checkout-discount"><span>Descuento</span><strong>-${descuento.toFixed(2)}</strong></div>}
                        <div className="checkout-total-final"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
                    </div>

                    {mensaje && <div className="checkout-message">{mensaje}</div>}

                    <button className="checkout-submit" type="submit">Confirmar reserva</button>
                </aside>
            </form>
        </main>
    )
}