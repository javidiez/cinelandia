import { Context } from "../../store/appContext";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
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
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../SwitchPeliSerie/SwitchPeliSerie.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Tooltip } from "flowbite-react";
import { Link } from 'react-router-dom';

export const WatchlistSerie = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const [movies, setMovies] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);
    const { store, actions } = useContext(Context);

    const fetchSerie = async (id) => {
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
        const modal = new bootstrap.Modal(document.getElementById(`modalWatchlistSerie-${selectedSerie.id}`));
        modal.show();
    };

    useEffect(() => {
        if (selectedSerie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalWatchlistSerie-${selectedSerie.id}`));
            modal.show();
        }
    }, [selectedSerie]);

    const selectMovie = async (movie) => {
        await fetchSerie(movie.id);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleCloseModal = () => {
        setPlaying(false); // Detiene el video
        setSelectedSerie(null); // Cierra el modal
    };

    const seriesToShow = movies.slice(0, 12);

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
                            idModal={`modalWatchlistSerie-${selectedSerie.id}`}
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

            <div className="mt-4 bloque-card-mobile-watchlist fade-in ">
                <div className="swiper-container-watchlist">
                    <h2 className="ms-3 title-watchlist text-light">Series</h2>
                    <div className="swiper-wrapper-watchlist scrollableDiv-watchlist gap-5 pt-5 mb-5">
                        {store.watchlistSerie && store.watchlistSerie.length > 0 ? (
                            store.watchlistSerie.map((fav, index) => {
                                const releaseDate = new Date(fav.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";
                                return (
                                    <div key={index} className='fade-in novedades mb-4'>
                                        <FilmCard
                                            key={fav.id}
                                            size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                            image={fav.poster_path}
                                            title={fav.title ? fav.title : fav.name}
                                            overview={fav.overview}
                                            voteAverage={isUpcoming || isNaN(fav.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(fav.vote_average * 10)} %</div>}
                                            releaseDate={fav.title && fav.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(fav.release_date)}</div> : fav.name && fav.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(fav.first_air_date)}</div> : 'Fecha no informada'}
                                            info_multimedia={`${window.location.origin}/serie/${fav.id}/${fav.name}`}
                                            movieType={''}
                                            classMovieType={fav.title ? 'movie-type-movie' : 'movie-type-serie'}
                                            topMovie={fav.vote_average > 7.75 && fav.vote_count > 99 ? "Destacada" : ''}
                                            proxEstreno={isUpcoming}
                                             
                                        />
                                    </div>
                                )
                            })) :
                            <p className="text-light fs-1">Ninguna serie en Watchlist, haga clic en <i className="btn btn-primary fa-regular fa-bookmark fs-1"></i> para guardar series</p>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};
