import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import './novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../WatchlistSerieMovie/watchlistSerieMovie.css';
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import '../Navbar/navbar.css'
import { Context } from '../../store/appContext';

export const Novedades = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { store, actions } = useContext(Context);

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity',
                'primary_release_date.gte': sixMonthsAgo.toISOString().split('T')[0],
                page: page,
            },
        });

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(results);
    };

    useEffect(() => {
        fetchNowPlaying(currentPage);
    }, [currentPage]);


    useEffect(() => {
        if (selectedMovie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalNovedad-${selectedMovie.id}`));
            modal.show();
        }
    }, [selectedMovie]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            fetchNowPlaying(currentPage - 1);
            window.scrollTo(0, 100);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchNowPlaying(currentPage + 1);

            // Seleccionar el contenedor que contiene los elementos desplazables
            const swiper = document.querySelector('.swiper-wrapper-paginas');
            const container = document.querySelector('.bloque-cards-desktop');

            // Realizar scroll hacia la izquierda
            if (swiper) {
                swiper.scrollTo({
                    top: 400,
                    left: 0, // Hacer scroll al inicio del contenedor
                    behavior: 'smooth', // Opcional: hacerlo con animación smooth
                });
            }

            if (currentPage > 0) {
                fetchNowPlaying(currentPage + 1);
                window.scrollTo(0, 100);
            }
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const swiper = new Swiper('.swiper-container', '.swiper-container-paginas', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 20, // Espacio entre las tarjeta

        });
    }, []);


    return (
        <>

            <h2 className="text-center text-light novedades-title">Novedades</h2>

            <div className="text-center container">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>

            <div className="mt-4 novedades bloque-card-mobile fade-in">
                <div className="swiper-container-paginas">
                    <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex">
                        {movies.map((movie) => {
                            const releaseDate = new Date(movie.release_date);
                            const today = new Date();
                            const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                            return (
                                <div className='swiper-slide-paginas ps-4 pt-3 fade-in' key={movie.id}>
                                    <FilmCard
                                        key={movie.id}
                                        size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                        image={movie.poster_path}
                                        title={movie.title}
                                        overview={movie.overview}
                                        voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella}/> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella}/> {Math.round(movie.vote_average * 10)} %</div>}
                                        releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar}/>  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar}/>{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                        info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                                        movieType={''}
                                        classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                        topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                        proxEstreno={isUpcoming}
                                        saveButton={
                                            <button
                                                className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                                                type="button"
                                                onClick={store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                                    ? () => actions.deleteFavouriteMovie(movie)
                                                    : () => actions.addFavouriteMovie(movie)}
                                            >
                                                {store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                                    ? <i className="fa-solid fa-bookmark"></i>
                                                    : <i className="fa-regular fa-bookmark"></i>}
                                            </button>
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mx-auto gap-5 mt-5 mb-3 novedades fs-5 bloque-cards-desktop">
                {movies.map((movie) => {
                    const releaseDate = new Date(movie.release_date);
                    const today = new Date();
                    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                    return (
                        <React.Fragment key={movie.id}>
                        <FilmCard
                            key={movie.id}
                            size={{ width: 'clamp(16rem,20vw,18rem)' }}
                            image={movie.poster_path}
                            title={movie.title}
                            overview={movie.overview}
                            voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella}/> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella}/> {Math.round(movie.vote_average * 10)} %</div>}
                            releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar}/>  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar}/>{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                            info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                            movieType={''}
                            classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                            topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                            proxEstreno={isUpcoming}
                            saveButton={
                                <button
                                    className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                                    type="button"
                                    onClick={store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                        ? () => actions.deleteFavouriteMovie(movie)
                                        : () => actions.addFavouriteMovie(movie)}
                                >
                                    {store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                        ? <i className="fa-solid fa-bookmark"></i>
                                        : <i className="fa-regular fa-bookmark"></i>}
                                </button>
                            }
                        />
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="text-center container pb-5">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>
        </>
    );
};
