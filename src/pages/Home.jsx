// Importamos el logo de Entre Destinos
import logo from "../assets/logo.png"


export const Home = ({ cambiarPagina }) => {

    // Lista temporal de destinos.
    // Más adelante estos datos pueden venir desde Firebase.
    const destinos = [
        {
            id: 1,
            nombre: "Costa Rica",
            descripcion: "Naturaleza y aventura",
            imagen: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80"
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


                    <button
                        className="profile-button"
                        onClick={() => cambiarPagina("perfil")}
                    >
                        Mi perfil
                    </button>

                </div>

            </header>


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
                            Encuentra lugares increíbles, organiza tus viajes
                            y descubre paquetes turísticos.
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

                            <h4>
                                Destinos destacados
                            </h4>


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


                {/* ============================= */}
                {/* PAQUETES DE VIAJE */}
                {/* ============================= */}

                <section className="home-section">

                    <div className="section-title">

                        <div>

                            <h4>
                                Paquetes recomendados
                            </h4>


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


            {/* ============================= */}
            {/* MENÚ INFERIOR */}
            {/* ============================= */}

            <nav className="bottom-menu">

                <button className="menu-activo">
                    Inicio
                </button>


                <button>
                    Explorar
                </button>


                <button>
                    Mis viajes
                </button>


                <button
                    onClick={() => cambiarPagina("perfil")}
                >
                    Perfil
                </button>

            </nav>

        </div>

    )
}