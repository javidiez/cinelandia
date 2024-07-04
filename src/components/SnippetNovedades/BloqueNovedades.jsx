import { useEffect, useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { Modal } from '../Modal/Modal';
import { CardActores } from '../CardActores/CardActores';
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import smartTv from '../../assets/img/smart-tv.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import avatar from '../../assets/img/avatar.webp';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css';
import './bloque_novedades.css';
import '../Modal/modal.css';
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Tooltip } from "flowbite-react";
import { Link } from 'react-router-dom';


export const BloqueNovedades = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);
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
        setMovies(results);
    };

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}?language=es-ES`, {
            params: {
                api_key: API_KEY,
                append_to_response: 'videos,credits,watch/providers,recommendations,release_dates',
            },
        });

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(
                (vid) => vid.name === "Official Trailer"
            );
            setTrailer(trailer ? trailer : data.videos.results[0]);
        }

        if (data.credits && data.credits.cast) {
            // Extraer el elenco de la respuesta de la API
            const castMembers = data.credits.cast;
            // Configurar el estado 'cast' con la lista de miembros del elenco
            setCast(castMembers.slice(0, 10));
        }
        if (data["watch/providers"] && data["watch/providers"].results) {
            const country = data["watch/providers"].results.ES; // Cambia 'ES' por el código del país que desees
            if (country && country.flatrate) {
                setPlatforms(country.flatrate);
            } else {
                setPlatforms(null); // Reiniciar plataformas si no hay flatrate
            }
        } else {
            setPlatforms(null); // Reiniciar plataformas si no hay resultados
        }

        if (data.recommendations && data.recommendations.results) {
            const recommend = data.recommendations.results;
            setRecommendations(recommend.slice(0, 10));
        }

        setSelectedMovie(data);

        const modal = new bootstrap.Modal(document.getElementById(`modalNovedad-${id}`));
        modal.show();
    };

    const selectMovie = async (movie) => {
        await fetchMovie(movie.id);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const moviesToShow = movies.slice(0, 12);

    const handleCloseModal = () => {
        setPlaying(false); // Detiene el video
        setSelectedMovie(null); // Cierra el modal
    };

    useEffect(() => {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 20, // Espacio entre las tarjeta

        });
    }, []);

    return (
        <>
            <div>
                <main>
                    {selectedMovie && (
                        <Modal
                            key={selectedMovie.id}
                            shareUrl={`${window.location.origin}/pelicula/${selectedMovie.id}`}
                            watchlistButtons={
                                selectedMovie && (
                                    <Tooltip
                                        content={store.watchlist?.some(movie => movie.id === selectedMovie.id) ? "Quitar de Watchlist" : "Agregar a Watchlist"}
                                        trigger="hover"
                                        placement="top"
                                        className="d-flex align-items-start bg-dark text-light ps-2 pe-0 px-0 fs-5 rounded"
                                    >
                                        <button
                                            className="btn btn-primary ver-trailer"
                                            type="button"
                                            onClick={store.watchlist?.some(movie => movie.id === selectedMovie.id)
                                                ? () => actions.deleteFavouriteMovie(selectedMovie)
                                                : () => actions.addFavouriteMovie(selectedMovie)}
                                        >
                                            {store.watchlist?.some(movie => movie.id === selectedMovie.id)
                                                ? <i className="fa-solid fa-bookmark"></i>
                                                : <i className="fa-regular fa-bookmark"></i>}
                                        </button>
                                    </Tooltip>
                                )
                            }
                            idModal={`modalNovedad-${selectedMovie.id}`}
                            postherPad={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : fondoNotFound}
                            noImg={fondoNotFound}
                            title={selectedMovie.title}
                            runTime={selectedMovie.runtime > 0 ? `${selectedMovie.runtime} minutos` : 'Duración no informada'}
                            mapGenre={selectedMovie.genres && selectedMovie.genres.map((genre, index) => (
                                <p className='fs-4' key={genre.id}>{genre.name}{index < selectedMovie.genres.length - 1 ? ', ' : ''}</p>
                            ))}
                            releaseDate={formatDate(selectedMovie.release_date)}
                            originalLanguage={selectedMovie.original_language}
                            overview={selectedMovie.overview ? selectedMovie.overview : <span className='sin-descripcion'>Sin descripción</span>}
                            classPuntaje={`${selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                            voteAverage={selectedMovie.vote_average ? Math.round(selectedMovie.vote_average * 10) : '0'}
                            voteCount={selectedMovie.vote_count ? selectedMovie.vote_count : 0}
                            mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.map((company, index) => (
                                <span key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                            ))}
                            mapCountries={selectedMovie.production_countries && selectedMovie.production_countries.map((country, index) => (
                                <span key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
                            ))}
                            budget={selectedMovie.budget > 0 ? <><span className='fw-bold'>Presupuesto:</span> {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.budget)}</> : <><span className='fw-bold'>Presupuesto: </span>No informado</>}
                            revenue={selectedMovie.revenue > 0 ? <><span className='fw-bold'>Recaudación:</span> {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.revenue)}</> : <><span className='fw-bold'>Recaudación: </span>No informado</>}
                            estrella={estrella}
                            lapiz={lapiz}
                            smartTv={smartTv}
                            onClose={handleCloseModal}
                            trailer={trailer}
                            cast={cast && cast.length > 0 ?

                                <div className='d-flex flex-column'>
                                    <div>
                                        <h2 className='pt-4 pb-4 text-info subtitle-modal'>Reparto principal</h2>
                                    </div>
                                    <div className="swiper-container">
                                        <div className="swiper-wrapper scrollableDiv">
                                            {cast.map((actor, index) => (
                                                <div key={index} className="swiper-slide gap-5">
                                                    <CardActores
                                                        castImg={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                        castName={actor.name}
                                                        noImg={avatar}
                                                        castCharacter={actor.character ? ` (${actor.character})` : ''}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div> : ''}
                            providers={platforms && platforms.length > 0 ? (
                                <>
                                    <div>
                                        <img className='icono-modal me-2' alt="smarttv" src={smartTv} />
                                        <span className='fw-bold'>Plataformas</span>
                                    </div>
                                    <div className='d-flex flex-wrap'>
                                        {platforms.map((platform, index) => (
                                            <Tooltip content={platform.provider_name} trigger="hover" placement="bottom" className='d-flex align-items-start bg-dark text-light ps-2 pe-0 pt-0 pb-0 fs-5 rounded'>
                                                <img key={index} className='border platforms me-2 mt-2' src={`https://image.tmdb.org/t/p/w200${platform.logo_path}`} alt={platform.provider_name} />
                                            </Tooltip>
                                        ))}
                                    </div>
                                </>
                            ) : ''}
                            recommendations={recommendations && recommendations.length > 0 ? (

                                <>

                                    <h2 className='pt-5 text-info subtitle-modal'>Te puede interesar</h2>

                                    <div className='d-flex flex-wrap gap-4'>
                                        <div className="swiper-container">
                                            <div className="swiper-wrapper scrollableDiv">
                                                {recommendations.map((recommend) => {

                                                    const releaseDate = new Date(recommend.release_date);
                                                    const today = new Date();
                                                    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                                    return (

                                                        <div className='film-card-modal swiper-slide gap-5'>
                                                            <FilmCardRecommendations
                                                                key={recommend.id}
                                                                size={{ width: '9rem' }}
                                                                image={recommend.poster_path}
                                                                title={recommend.title}
                                                                overview={recommend.overview}
                                                                releaseDate={<><span className='fw-bold'>Fecha</span> {formatDate(recommend.release_date)}</>}
                                                                voteAverage={''}
                                                                movieType={''}
                                                                classMovieType={recommend.title ? 'movie-type-movie' : 'movie-type-serie'}
                                                                topMovie={recommend.vote_average > 7.75 && recommend.vote_count > 99 ? <span className='destacada-recommend'>Destacada</span> : ''}
                                                                proxEstreno={isUpcoming}
                                                                info_multimedia={`${window.location.origin}/pelicula/${recommend.id}`}
                                                                verMas={() => window.scrollTo(0, 0)}
                                                            />
                                                        </div>
                                                    );

                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : ''}
                        />
                    )}
                </main>


            </div>

            <h2 className="text-center text-light snippet_novedades_title fade-in">Novedades</h2>
            <div className="mt-4 novedades bloque-card-mobile fade-in">
                <div className="swiper-container-paginas">
                    <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex">
                        {movies.map((movie) => {
                            const releaseDate = new Date(movie.release_date);
                            const today = new Date();
                            const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                            return (
                                <div className='swiper-slide-paginas ps-5 pt-3 fade-in'>
                                    <FilmCard
                                        key={movie.id}
                                        size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                        image={movie.poster_path}
                                        title={movie.title ? movie.title : movie.name}
                                        overview={movie.overview}
                                        releaseDate={<div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} /> {formatDate(movie.release_date)}</div>}
                                        voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                        info_multimedia={`${window.location.origin}/pelicula/${movie.id}`}
                                        movieType={''}
                                        classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                        topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                        proxEstreno={isUpcoming}
                                        saveButton={<button
                                            className="btn btn-primary mt-4 fw-bold fs-5"
                                            type="button"
                                            onClick={store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                                ? () => actions.deleteFavouriteMovie(movie)
                                                : () => actions.addFavouriteMovie(movie)}
                                        >
                                            {store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                                ? <i className="fa-solid fa-bookmark"></i>
                                                : <i className="fa-regular fa-bookmark"></i>}
                                        </button>}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex-wrap justify-content-center mx-auto gap-5 mt-5 mb-3 novedades fade-in fs-5 bloque-cards-desktop-generos">
                {moviesToShow.map((movie) => {
                    const releaseDateMovie = new Date(movie.release_date);
                    const today = new Date();
                    const isUpcoming = releaseDateMovie > today ? "Próximo estreno" : "";

                    const formatDateReleaseDate = (dateString) => {
                        const date = new Date(dateString);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    };


                    return (
                        <FilmCard
                            key={movie.id}
                            size={{ width: '15.5rem' }}
                            image={movie.poster_path}
                            title={movie.title}
                            overview={movie.overview}
                            releaseDate={<div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} /> {formatDate(movie.release_date)}</div>}
                            voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                            info_multimedia={`${window.location.origin}/pelicula/${movie.id}`}
                            movieType={''}
                            classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                            topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                            proxEstreno={isUpcoming}
                            saveButton={

                                <button
                                    className="btn btn-primary mt-4 fw-bold fs-5"
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
                    );
                })}
            </div>

            <div className="container pb-5 mt-5 text-center ">
                <Link to="/novedades"><button className='btn btn-primary botones-ver-mas fw-bold ps-3 pe-3'>MÁS NOVEDADES</button></Link>
            </div>
        </>
    );
};
