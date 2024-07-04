import React from "react";
import { useEffect, useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import axios from 'axios';
import { Modal } from '../Modal/Modal';
import { BloqueProximosEstrenos } from "./BloqueProximosEstrenos";
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import { CardActores } from '../CardActores/CardActores';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import smartTv from '../../assets/img/smart-tv.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import avatar from '../../assets/img/avatar.webp';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import './snippet_pp.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../SnippetNovedades/bloque_novedades.css'
import { Tooltip } from "flowbite-react";
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Link } from "react-router-dom";

export const SnippetProximosEstrenos = () => {

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [trailer, setTrailer] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [playing, setPlaying] = useState(false);
    const { store, actions } = useContext(Context);

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie?include_adult=false`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity.desc',
                'primary_release_date.gte': formattedTomorrow,
                page: page,
            },
        });

        const filteredResults = results.filter(movie => {
            return !['tl', 'ja', 'ko', 'th', 'ar'].includes(movie.original_language);
        });

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(filteredResults);
    };

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}?language=es-ES`, {
            params: {
                api_key: API_KEY,
                append_to_response: 'videos,credits,watch/providers,recommendations',
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
            // Extraer el elenco de la respuesta de la API
            const recommend = data.recommendations.results;
            // Configurar el estado 'cast' con la lista de miembros del elenco
            setRecommendations(recommend.slice(0, 10));
        }

        setSelectedMovie(data);
    };

    const selectMovie = async (movie) => {
        await fetchMovie(movie.id);
    };

    useEffect(() => {
        fetchNowPlaying(currentPage);
    }, [currentPage]);


    useEffect(() => {
        if (selectedMovie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalEstrenos-${selectedMovie.id}`));
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

    const moviesToShow = movies.slice(0, 5);

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
                            idModal={`modalEstrenos-${selectedMovie.id}`}
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
                                        className="btn btn-primary"
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
                            mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.length > 0 ? selectedMovie.production_companies.map((company, index) => (
                                <span key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                            )) : 'No informado'}
                            mapCountries={selectedMovie.production_countries && selectedMovie.production_countries.map((country, index) => (
                                <span key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
                            ))}
                            budget={''}
                            revenue={''}
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



            <div>

                <div className="d-flex flex-column container-fluid snippet_pp fade-in">

                    <h2 className="text-center text-light snippet_pp_title">Próximos estrenos</h2>


                    {moviesToShow.map((movie) => {



                        return (
                            <>
                                <BloqueProximosEstrenos
                                    key={movie.id}
                                    img={`${IMAGE_PATH}${movie.poster_path}`}
                                    title={movie.title}
                                    description={''}
                                    date={<div className="d-flex align-items-center"><img style={{ width:'1.5rem' }} src={calendar}/><span className="fs-4 ms-2">{formatDate(movie.release_date)}</span></div>}
                                    info_multimedia={`${window.location.origin}/pelicula/${movie.id}`}
                                    verMas={() => window.scrollTo(0, 0)}
                                />
                                <hr className="border-2 border-top border-secondary mt-4 mb-4" />
                            </>
                        );
                    })}
                    <div className="text-center mb-5 mt-3 ">
                        <Link to="/peliculas_estrenos"><button className='btn btn-primary botones-ver-mas fw-bold ps-3 pe-3'>MÁS ESTRENOS</button></Link>
                    </div>
                </div>


            </div>


        </>
    );
};