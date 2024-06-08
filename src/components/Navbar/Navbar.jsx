import logo from "../../assets/img/logo.png";
import './navbar.css'

export const Navbar = () => {

    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
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
                    <a className="navbar-brand d-flex align-items-center" href="index.html">
                        <img src={logo} className="logo" />
                        <p className="text-light fw-bold display-5 ps-3">CINELANDIA</p>
                    </a>
                </div>
                <div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav pe-3">
                            <li className="nav-item">
                                <a className="nav-link text-light fs-3 fw-bold" aria-current="page" href="index.html">Home</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-light fs-3 fw-bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Películas
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item text-light" href="novedades.html">Novedades</a></li>
                                    <li><a className="dropdown-item text-light" href="populares.html">Populares</a></li>
                                    <li><a className="dropdown-item text-light" href="toprated.html">Mejor valoradas</a></li>
                                    <li><a className="dropdown-item text-light" href="proximos_estrenos.html">Próximos estrenos</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-light fs-3 fw-bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Series
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item text-light" href="novedades_series.html">Novedades</a></li>
                                    <li><a className="dropdown-item text-light" href="trending_series.html">Tendencias</a></li>
                                    <li><a className="dropdown-item text-light" href="populares_series.html">Populares</a></li>
                                    <li><a className="dropdown-item text-light" href="topratedserie.html">Mejor valoradas</a></li>
                                    <li><a className="dropdown-item text-light" href="proximos_estrenos.html">Próximos estrenos</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light fs-3 fw-bold" href="#">Contacto</a>
                            </li>
                        </ul>
                        <div className="d-flex pe-5">
                            <a href="index.html#search-focus" id="search-icon">
                                <button className="btn text-light p-2 btn-lupa" onClick={handleLupaClick}>
                                    <i className="fa-solid fa-magnifying-glass fs-4"></i>
                                </button>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    )


}