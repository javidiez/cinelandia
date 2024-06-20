import logo from "../../assets/img/logo.png";
import './navbar.css'

export const Navbar = () => {

    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 0) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }
    });

    // Función para manejar el clic en la lupa
    const handleLupaClick = (e) => {
        e.preventDefault();
        window.location.href = "index.html#search-focus"; // Redirigir a index.html y agregar el hash para enfocar el buscador
        setTimeout(() => {
            const buscador = document.getElementById('buscador');
            if (buscador) {
                buscador.focus();
            }
        }, 0);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplazar la pantalla hasta arriba
    }

    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="container-fluid">
                <div className="d-flex justify-content-between">
                    <Link className="navbar-brand d-flex align-items-center" to="/index.html">
                        <img src={logo} className="logo" />
                        <p className="text-light fw-bold ps-3">CINELANDIA</p>
                    </Link>
                </div>
                <div>
                    <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon">
                        </span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav pe-3">
                            <li className="nav-item">
                                <Link className="nav-link text-light fs-3 fw-bold" aria-current="page" to="index.html">Home</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle text-light fs-3 fw-bold" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Películas
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item text-light" to="/novedades.html">Novedades</Link></li>
                                    <li><Link className="dropdown-item text-light" to="/populares.html">Populares</Link></li>
                                    <li><Link className="dropdown-item text-light" to="/toprated.html">Mejor valoradas</Link></li>
                                    <li><Link className="dropdown-item text-light" to="/proximos_estrenos.html">Próximos estrenos</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle text-light fs-3 fw-bold" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Series
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item text-light" to="/novedades_series.html">Novedades</Link></li>
                                    <li><Link className="dropdown-item text-light" to="/trending_series.html">Tendencias</Link></li>
                                    <li><Link className="dropdown-item text-light" to="/populares_series.html">Populares</Link></li>
                                    <li><Link className="dropdown-item text-light" to="/topratedserie.html">Mejor valoradas</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light fs-3 fw-bold" to="/generos.html">Géneros</Link>
                            </li>
                        </ul>
                        <div className="d-flex pe-5">
                            <Link to="index.html#search-focus" id="search-icon">
                                <button className="btn text-light p-2 btn-lupa" onClick={handleLupaClick}>
                                    <i className="fa-solid fa-magnifying-glass fs-4"></i>
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    )


}