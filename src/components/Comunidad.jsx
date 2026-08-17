import { CrearPublicacion } from "./CrearPublicacion"
import { PublicacionCard } from "./PublicacionCard"

export const Comunidad = ({
    publicaciones,
    crearPublicacion,
    cambiarLike,
    agregarComentario,
    cambiarGuardado,
    eliminarPublicacion,
    fotoPerfil
}) => (
    <section className="home-section">
        <div className="section-title">
            <div>
                <h4>Comunidad viajera</h4>
                <p>Mira lo que otros viajeros están compartiendo</p>
            </div>
        </div>

        <CrearPublicacion
            crearPublicacion={crearPublicacion}
            fotoPerfil={fotoPerfil}
        />

        <div className="social-feed">
            {publicaciones.map((publicacion) => (
                <PublicacionCard
                    key={publicacion.id}
                    publicacion={publicacion}
                    cambiarLike={cambiarLike}
                    agregarComentario={agregarComentario}
                    cambiarGuardado={cambiarGuardado}
                    eliminarPublicacion={eliminarPublicacion}
                />
            ))}
        </div>
    </section>
)
