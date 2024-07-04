
import React from "react";
import { useEffect, useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import axios from 'axios';
import { ModalSerie } from "../ModalSerie/ModalSerie";
import { BloqueTendenciasSeries } from "./BloqueTendenciasSeries";
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
import '../SinppetProximosEstrenos/snippet_pp.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../SnippetNovedades/bloque_novedades.css'
import { Tooltip } from "flowbite-react";
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Link } from "react-router-dom";

export const SnippetTendenciasSeries = () => {

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    const [movies, setMovies] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);
    const { store, actions } = useContext(Context);

    const fetchTopRatedSeries = async () => {
        setLoading(true);

        try {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/tv`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 1000,
                    'vote_average.gte': 8.1,
                },
            });


            // Establece las series filtradas y la cantidad total de páginas en el estado
            setMovies(results);
            setTotalPages(total_pages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching top rated series:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/tv/${id}?language=es-ES`, {
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

        setSelectedSerie(data);
    };

    const selectMovie = async (movie) => {
        await fetchMovie(movie.id);
    };

    useEffect(() => {
        fetchTopRatedSeries(currentPage);
    }, [currentPage]);


    useEffect(() => {
        if (selectedSerie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalTendenciasSerieSnippet-${selectedSerie.id}`));
            modal.show();
        }
    }, [selectedSerie]);


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
        setSelectedSerie(null); // Cierra el modal
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
                    {selectedSerie && (
                        <ModalSerie
                            key={selectedSerie.id}
                            idModal={`modalTendenciasSerieSnippet-${selectedSerie.id}`}
                            watchlistButtons={
                                selectedSerie && (
                                    <Tooltip
                                        content={store.watchlistSerie?.some(movie => movie.id === selectedSerie.id) ? "Quitar de Watchlist" : "Agregar a Watchlist"}
                                        trigger="hover"
                                        placement="top"
                                        className="d-flex align-items-start bg-dark text-light ps-2 pe-0 px-0 fs-5 rounded"
                                    >
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={store.watchlistSerie?.some(movie => movie.id === selectedSerie.id)
                                                ? () => actions.deleteFavouriteSerie(selectedSerie)
                                                : () => actions.addFavouriteSerie(selectedSerie)}
                                        >
                                            {store.watchlistSerie?.some(movie => movie.id === selectedSerie.id)
                                                ? <i className="fa-solid fa-bookmark"></i>
                                                : <i className="fa-regular fa-bookmark"></i>}
                                        </button>
                                    </Tooltip>
                                )
                            }
                            postherPad={selectedSerie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedSerie.poster_path}` : fondoNotFound}
                            noImg={fondoNotFound}
                            originalName={selectedSerie.name}
                            seasons={selectedSerie.number_of_seasons > 1 ? `${selectedSerie.number_of_seasons} temporadas` : selectedSerie.number_of_seasons ? `${selectedSerie.number_of_seasons} temporada` : 'Temporadas desconocidas'}
                            episodes={selectedSerie.number_of_episodes > 1 ? `${selectedSerie.number_of_episodes} episodios` : selectedSerie.number_of_episodes ? `${selectedSerie.number_of_episodes} episodio` : 'Episodios desconocidos'}
                            mapGenre={selectedSerie.genres && selectedSerie.genres.length > 0 ? selectedSerie.genres.map((genre, index) => (
                                <p className='fs-4' key={genre.id}>{genre.name}{index < selectedSerie.genres.length - 1 ? ', ' : ''}</p>
                            )) : <p className='fs-4'>Género no informado</p>}
                            firstAirDate={selectedSerie.first_air_date ? formatDate(selectedSerie.first_air_date) : 'Fecha desconocida'}
                            lastAirDate={selectedSerie.last_air_date ? formatDate(selectedSerie.last_air_date) : 'No informado'}
                            originalLanguage={selectedSerie.original_language ? selectedSerie.original_language : <span className='text-lowercase'>Idioma desconocido</span>}
                            overview={selectedSerie.overview ? selectedSerie.overview : <span className='sin-descripcion'>Sin descripción</span>}
                            classPuntaje={`${selectedSerie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedSerie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                            voteAverage={selectedSerie.vote_average ? Math.round(selectedSerie.vote_average * 10) : '0'}
                            voteCount={selectedSerie.vote_count ? selectedSerie.vote_count : 0}
                            mapProductionCompanies={selectedSerie.production_companies && selectedSerie.production_companies.length > 0 ? selectedSerie.production_companies.map((company, index) => (
                                <span key={company.id}>{company.name}{index < selectedSerie.production_companies.length - 1 ? ', ' : ''}</span>
                            )) : 'No informado'}
                            mapCountries={selectedSerie.production_countries && selectedSerie.production_countries.length > 0 ? selectedSerie.production_countries.map((country, index) => (
                                <span key={country.iso_3166_1}>{country.name}{index < selectedSerie.production_countries.length - 1 ? ', ' : ''}</span>
                            )) : 'No informado'}
                            mapCreatedBy={selectedSerie.created_by && selectedSerie.created_by.length > 0
                                ? selectedSerie.created_by.map((createdBy, index) => (
                                    <span key={createdBy.id}>
                                        {createdBy.name}{index < selectedSerie.created_by.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                                : 'No informado'}
                            mapNextEpisodeToAir={selectedSerie.next_episode_to_air && selectedSerie.next_episode_to_air.length > 0 ? selectedSerie.next_episode_to_air.map((nextEpisode, index) => (
                                <span key={nextEpisode.id}>{nextEpisode.air_date}{nextEpisode.episode_number}</span>
                            )) : 'No'}
                            mapSeasonsSeasonName={selectedSerie.seasons && selectedSerie.seasons.map((season, index) => (
                                <span key={season.id}>{season.name}</span>
                            ))}
                            mapSeasonsSeasonDate={selectedSerie.seasons && selectedSerie.seasons.map((season, index) => (
                                <span key={season.id}>{formatDate(season.air_date) == '01/01/1970' ? 'Sin definir' : formatDate(season.air_date)}</span>
                            ))}
                            mapSeasonsSeasonEpisodes={selectedSerie.seasons && selectedSerie.seasons.map((episodes, index) => (
                                <span key={episodes.id}>{episodes.episode_count == 0 ? 'Sin definir' : episodes.episode_count}</span>
                            ))}
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
                                                                title={recommend.name}
                                                                overview={recommend.overview}
                                                                releaseDate={<><span className='fw-bold'>Fecha</span> {formatDate(recommend.first_air_date)}</>}
                                                                voteAverage={''}
                                                                movieType={''}
                                                                classMovieType={recommend.title ? 'movie-type-movie' : 'movie-type-serie'}
                                                                topMovie={''}
                                                                proxEstreno={isUpcoming}
                                                                info_multimedia={`${window.location.origin}/serie/${recommend.id}`}
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

                    <h2 className="text-center text-light snippet_tendencias_title">Mejor valoradas</h2>

                    {moviesToShow.map((movie) => {

                        return (
                            <>
                                <BloqueTendenciasSeries
                                    key={movie.id}
                                    img={`${IMAGE_PATH}${movie.poster_path}`}
                                    title={movie.name}
                                    description={''}
                                    voteAverage={<div className="d-flex align-items-baseline"><img style={{ width: '1.5rem' }} src={estrella} /><span className="fs-3 ms-2">{Math.round(movie.vote_average * 10)} %</span></div>}
                                    selectedSerie
                                    date={<div className="d-flex align-items-center"><img style={{ width: '1.5rem' }} src={calendar} /><span className="fs-5 ms-2">{formatDate(movie.first_air_date)}</span></div>}
                                    info_multimedia={`${window.location.origin}/serie/${movie.id}`}
                                    verMas={() => window.scrollTo(0, 0)}
                                />
                                <hr className="border-2 border-top border-secondary mt-4 mb-4" />
                            </>
                        );
                    })}
                    <div className="text-center mb-5 mt-3 ">
                        <Link to="/series_toprated"><button className='btn btn-primary botones-ver-mas fw-bold ps-3 pe-3'>VER MÁS</button></Link>
                    </div>
                </div>


            </div>


        </>
    );
};