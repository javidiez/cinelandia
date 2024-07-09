import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import '../InfoMovie/infoMovie.css'
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import '../SnippetNovedades/bloque_novedades.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import '../BloqueGeneros/bloquegeneros.css'
import '../Novedades/novedades.css'
import './bloque_generos_movie.css'
import '../WatchlistSerieMovie/watchlistSerieMovie.css';
import Swiper from 'swiper';
import { Context } from '../../store/appContext';


const API_KEY = '4f5f43495afcc67e9553f6c684a82f84';
const API_URL = 'https://api.themoviedb.org/3';

const BloqueGenerosMovie = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('28');
    const [movies, setMovies] = useState([]);
    const [destacadas, setDestacadas] = useState([]);
    const [page, setPage] = useState(1);
    const [pageDestacada, setPageDestacada] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPagesDestacada, setTotalPagesDestacada] = useState(1);

    const { store, actions } = useContext(Context);

    // Obtener lista de géneros al montar el componente
    const fetchGenres = async () => {
        try {
            const { data: { genres } } = await axios.get(`${API_URL}/genre/movie/list`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES'
                },
            });
            setGenres(genres);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const fetchMoviesByGenre = async (page) => {
        try {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    with_genres: selectedGenre,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 30,
                    page: page
                },
            });

            setPage(page);
            setTotalPages(total_pages);
            setMovies(results);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const fetchDestacadasByGenre = async (pageDestacada) => {
        try {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    with_genres: selectedGenre,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 99,
                    'vote_average.gte': 7.5,
                    page: pageDestacada
                },
            });

            setPageDestacada(pageDestacada);
            setTotalPagesDestacada(total_pages);
            setDestacadas(results);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        fetchMoviesByGenre(page);
    }, [selectedGenre, page]);

    useEffect(() => {
        fetchDestacadasByGenre(pageDestacada);
    }, [selectedGenre, pageDestacada]);


    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
        setPage(1);
        setPageDestacada(1)
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
           
            if (window.innerWidth >= 768) {
                window.scrollTo(0, 150);
            }

            // Seleccionar el contenedor que contiene los elementos desplazables
            const swiper = document.querySelector('.swiper-wrapper-paginas');

            // Realizar scroll hacia la izquierda
            if (swiper) {
                swiper.scrollTo({
                    left: 0, // Hacer scroll al inicio del contenedor
                    behavior: 'smooth', // Opcional: hacerlo con animación smooth
                });
            }
        }
    };

    const goToPreviousPageDestacada = () => {
        if (pageDestacada > 1) {
            setPageDestacada(pageDestacada - 1);
        }
    };

    const goToNextPageDestacada = () => {
        if (pageDestacada < totalPagesDestacada) {
            setPageDestacada(pageDestacada + 1);
            
            // Scroll hacia arriba solo en dispositivos móviles
            if (window.innerWidth >= 768) {
                window.scrollTo(0, 150);
            }
    
            // Seleccionar el contenedor que contiene los elementos desplazables
            const swiper = document.querySelector('.swiper-wrapper-paginas_destacada');
    
            // Realizar scroll hacia la izquierda
            if (swiper) {
                swiper.scrollTo({
                    left: 0, // Hacer scroll al inicio del contenedor
                    behavior: 'smooth', // Opcional: hacerlo con animación smooth
                });
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
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 20, // Espacio entre las tarjeta

        });
    }, []);

    const [tipoContenido, setTipoContenido] = useState('todas');

    const handleSwitchChangeDestacada = (tipo) => {
        setTipoContenido(tipo);
    };


    return (
        <>

            <div className='row container-fluid justify-content-center bloque-generos ms-1 switcheo_destacada'>
                <div className='col-12 col-lg-2 select-generos'>
                    <p className='mb-3 text-light title-select-generos'>Géneros Peliculas</p>
                    <select className='form-select form-select-lg' value={selectedGenre} onChange={handleGenreChange}>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id} className='fs-4'>{genre.name}</option>
                        ))}
                    </select>
                    <div className='d-flex justify-content-center align-items-start'>
                        <input checked={tipoContenido === 'todas'}
                            onChange={() => handleSwitchChangeDestacada('todas')} type="radio" className="btn-check" name="destacadas" id="todas-outlined" autoComplete="off" />
                        <label className="btn btn-outline-light mt-4 fs-5" htmlFor="todas-outlined">Todas</label>

                        <input checked={tipoContenido === 'destacadas'}
                            onChange={() => handleSwitchChangeDestacada('destacadas')} type="radio" className="btn-check" name="destacadas" id="destacadas-outlined" autoComplete="off" />
                        <label className="btn btn-outline-light ms-3 mt-4 fs-5" htmlFor="destacadas-outlined">Destacadas</label>
                    </div>
                </div>




                <div className="col-12 col-lg-10 fade-in fs-5 justify-content-center align-items-center text-center">

                    {/* ---------------MOBILE------------------------ */}
                    <div className={`${tipoContenido === 'todas' ? 'show_destacada fade-in' : 'hide_destacada'}`}>

                        <div className="mt-1 bloque-card-mobile fade-in">

                            <div className="swiper-container-paginas">
                                <div className="text-center container mb-4">
                                    <button onClick={goToPreviousPage} disabled={page === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                    <button onClick={goToNextPage} disabled={page === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                                </div>

                                <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex novedades">
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
                                                    title={movie.title ? movie.title : movie.name}
                                                    overview={movie.overview}
                                                    voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                                    releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                                    info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                                                    movieType={''}
                                                    classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                                    topMovie={movie.vote_average > 7.49 && movie.vote_count > 99 ? "Destacada" : ''}
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
                                <div className="text-center container mb-5">
                                    <button onClick={goToPreviousPage} disabled={page === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                    <button onClick={goToNextPage} disabled={page === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={`${tipoContenido === 'destacadas' ? 'show_destacada fade-in' : 'hide_destacada'}`}>
                        <div className="mt-1 bloque-card-mobile fade-in">

                            <div className="swiper-container-paginas">

                                <div className="text-center container mb-4">
                                    <button onClick={goToPreviousPageDestacada} disabled={pageDestacada === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                    <button onClick={goToNextPageDestacada} disabled={pageDestacada === totalPagesDestacada} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                                </div>

                                <div className="swiper-wrapper-paginas_destacada scrollableDiv-paginas d-flex novedades">
                                    {destacadas.map((movie) => {
                                        const releaseDate = new Date(movie.release_date);
                                        const today = new Date();
                                        const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                        return (
                                            <div className='swiper-slide-paginas ps-4 pt-3 fade-in' key={movie.id}>
                                                <FilmCard
                                                    key={movie.id}
                                                    size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                                    image={movie.poster_path}
                                                    title={movie.title ? movie.title : movie.name}
                                                    overview={movie.overview}
                                                    voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                                    releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                                    info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                                                    movieType={''}
                                                    classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                                    topMovie={movie.vote_average > 7.49 && movie.vote_count > 99 ? "Destacada" : ''}
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
                                <div className="text-center container mb-5">
                                    <button onClick={goToPreviousPageDestacada} disabled={pageDestacada === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                    <button onClick={goToNextPageDestacada} disabled={pageDestacada === totalPagesDestacada} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ---------------DESKTOP------------------------ */}
                    <div className={`${tipoContenido === 'todas' ? 'show_destacada fade-in' : 'hide_destacada'}`}>

                        <div className="flex-wrap justify-content-center mx-auto gap-5 mt-5 mb-3  fade-in fs-5 bloque-cards-desktop-generos">

                            <div className="text-center container mb-5">
                                <button onClick={goToPreviousPage} disabled={page === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                <button onClick={goToNextPage} disabled={page === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                            </div>


                            {movies.map(movie => {

                                const releaseDate = new Date(movie.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";
                                return (

                                    <div className='fade-in novedades' key={movie.id}>

                                        <FilmCard
                                            key={movie.id}
                                            size={{ width: 'clamp(16rem,20vw,18rem)' }}
                                            image={movie.poster_path}
                                            title={movie.title ? movie.title : movie.name}
                                            overview={movie.overview}
                                            voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                            releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                            info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                                            movieType={''}
                                            classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                            topMovie={movie.vote_average > 7.49 && movie.vote_count > 99 ? "Destacada" : ''}
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
                                )
                            })}
                            <div className="text-center container mb-5">
                                <button onClick={goToPreviousPage} disabled={page === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                <button onClick={goToNextPage} disabled={page === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                            </div>
                        </div>


                    </div>

                    <div className={`${tipoContenido === 'destacadas' ? 'show_destacada fade-in' : 'hide_destacada'}`}>
                        <div className="flex-wrap justify-content-center mx-auto gap-5 mt-5 mb-3 fade-in fs-5 bloque-cards-desktop-generos">
                            <div className="text-center container mb-5">
                                <button onClick={goToPreviousPageDestacada} disabled={pageDestacada === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                <button onClick={goToNextPageDestacada} disabled={pageDestacada === totalPagesDestacada} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                            </div>

                            {destacadas.map(movie => {

                                const releaseDate = new Date(movie.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";
                                return (

                                    <div className='fade-in novedades' key={movie.id}>

                                        <FilmCard
                                            key={movie.id}
                                            size={{ width: 'clamp(16rem,20vw,18rem)' }}
                                            image={movie.poster_path}
                                            title={movie.title ? movie.title : movie.name}
                                            overview={movie.overview}
                                            voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                            releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                            info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                                            movieType={''}
                                            classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                            topMovie={movie.vote_average > 7.49 && movie.vote_count > 99 ? "Destacada" : ''}
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
                                )
                            })}
                            <div className="text-center container mb-5">
                                <button onClick={goToPreviousPageDestacada} disabled={pageDestacada === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                                <button onClick={goToNextPageDestacada} disabled={pageDestacada === totalPagesDestacada} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default BloqueGenerosMovie;
