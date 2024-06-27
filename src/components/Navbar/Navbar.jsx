import React from 'react';
import { useEffect } from 'react';
import logo from '../../assets/img/logo.png'
import './navbar.css';
import { Link } from "react-router-dom";

export const Navbar = ({ reload }) => {

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 0) {
                navbar.classList.add('shrink');
            } else {
                navbar.classList.remove('shrink');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLupaClick = (e) => {
        e.preventDefault();
        window.location.href = "index.html#search-focus";
        setTimeout(() => {
            const buscador = document.getElementById('buscador');
            if (buscador) {
                buscador.focus();
            }
        }, 0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between">
                        <Link className="navbar-brand d-flex align-items-center" to="/home" onClick={reload}>
                            <img src={logo} className="logo user-select-none" />
                            <p className="text-light fw-bold ps-3 user-select-none">CINELANDIA</p>
                        </Link>
                    </div>
                    <div>
                        <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav pe-3">
                                <li className="nav-item">
                                    <Link className="nav-link text-light fs-3 fw-bold" aria-current="page" onClick={reload} to="/home">Home</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle text-light fs-3 fw-bold" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Películas
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item text-light" to="/novedades">Novedades</Link></li>
                                        <li><Link className="dropdown-item text-light" to="/peliculas_populares">Populares</Link></li>
                                        <li><Link className="dropdown-item text-light" to="/peliculas_toprated">Mejor valoradas</Link></li>
                                        <li><Link className="dropdown-item text-light" to="/peliculas_estrenos">Próximos estrenos</Link></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle text-light fs-3 fw-bold" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Series
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item text-light" to="/novedades_series">Novedades</Link></li>
                                        <li><Link className="dropdown-item text-light" to="/series_trending">Tendencias</Link></li>
                                        <li><Link className="dropdown-item text-light" to="/series_populares">Populares</Link></li>
                                        <li><Link className="dropdown-item text-light" to="/series_toprated">Mejor valoradas</Link></li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-light fs-3 fw-bold" to="/generos">Géneros</Link>
                                </li>
                            </ul>
                            <div className="d-flex pe-5">
                                <Link to="/home#search-focus" id="search-icon">
                                    <button className="btn text-light p-2 btn-lupa" onClick={handleLupaClick}>
                                        <i className="fa-solid fa-magnifying-glass fs-4"></i>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>


            <nav className="navbar bg-body-tertiary fixed-top navbar-mobile">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/home" onClick={reload}>
                        <img src={logo} className="logo user-select-none" />
                        <p className="text-light fw-bold ps-3 user-select-none">CINELANDIA</p>
                    </a>
                    <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <img src={logo} className="logo user-select-none" />
                            <p className="text-light fw-bold ps-3 user-select-none">CINELANDIA</p>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul className="navbar-nav pe-3">
                                <li className="nav-item">
                                    <a className="nav-link text-light fs-3 fw-bold" aria-current="page" onClick={reload} href="/home">Home</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle text-light fs-3 fw-bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Películas
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item text-light" href="/novedades">Novedades</a></li>
                                        <li><a className="dropdown-item text-light" href="/peliculas_populares">Populares</a></li>
                                        <li><a className="dropdown-item text-light" href="/peliculas_toprated">Mejor valoradas</a></li>
                                        <li><a className="dropdown-item text-light" href="/peliculas_estrenos">Próximos estrenos</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle text-light fs-3 fw-bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Series
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item text-light" href="/novedades_series">Novedades</a></li>
                                        <li><a className="dropdown-item text-light" href="/series_trending">Tendencias</a></li>
                                        <li><a className="dropdown-item text-light" href="/series_populares">Populares</a></li>
                                        <li><a className="dropdown-item text-light" href="/series_toprated">Mejor valoradas</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-light fs-3 fw-bold" href="/generos">Géneros</a>
                                </li>
                            </ul>
                            <div className="d-flex pe-5">
                                <a href="/home#search-focus" id="search-icon">
                                    <button className="btn text-light p-2 btn-lupa" onClick={handleLupaClick}>
                                        <i className="fa-solid fa-magnifying-glass fs-4"></i>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};