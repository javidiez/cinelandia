import logo from "../../assets/img/logo.png";
import './navbar.css'

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <div className="d-flex justify-content-between">
                    <a className="navbar-brand d-flex align-items-center" href="index.html">
                        <img src={logo} className="logo" />
                        <span className="text-light fw-bold display-5 text-logo ps-3">CINELANDIA</span>
                    </a>
                </div>
                <div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav pe-3">
                            <li className="nav-item">
                                <a className="nav-link text-light fs-3 fw-bold" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light fs-3 fw-bold" href="#">Películas</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light fs-3 fw-bold" href="#">Series</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-light fs-3 fw-bold" href="#">Contacto</a>
                            </li>
                        </ul>
                        <form className="d-flex pe-5" role="search">
                            <input className="form-control buscador" type="search" placeholder="Buscar" aria-label="Search" id="buscador" />
                            <button className="btn btn-warning bg-dark text-light border-dark p-2 btn-lupa" type="submit"><i className="fa-solid fa-magnifying-glass fs-4"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    )


}