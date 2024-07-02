
import { useEffect, useState, useContext, useRef } from 'react';
import { Context } from '../../store/appContext';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import { CardActores } from '../CardActores/CardActores';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import smartTv from '../../assets/img/smart-tv.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import avatar from '../../assets/img/avatar.webp';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import { Tooltip } from "flowbite-react";
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import '../Navbar/navbar.css'
import './peliculaSingle.css'
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';


export const PeliculaSingle = () => {
    const { id } = useParams();

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);
    const { store, actions } = useContext(Context);
    const videoContainerRef = useRef(null);


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
            setCast(castMembers.slice(0, 20));
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
            setRecommendations(recommend.slice(0, 20));
        }

        setSelectedMovie(data);

        const modal = new bootstrap.Modal(document.getElementById(`modalWatchlist-${id}`));
        modal.show();
    };

    useEffect(() => {
        fetchMovie(id)
    }, [id])

    const handlePlayTrailer = () => {
        setPlaying(true);
        setTimeout(() => {
            if (videoContainerRef.current) {
                videoContainerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    return (
        <>
            {selectedMovie && (
                <>

                    <div className='contenedor-multimedia container rounded' style={{ backgroundImage: selectedMovie.backdrop_path ? `url(https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path})` : `url(${fondoNotFound})` }}>
                        <div className='contenido_multimedia p-4'>
                            <div className='row'>
                                <div className='col-sm-auto container-posther_path'>
                                    <img
                                        className='poster_path img-fluid rounded'
                                        src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : fondoNotFound}
                                        alt={selectedMovie.title}
                                    />
                                </div>
                                <div className='col'>
                                    <div className='d-flex justify-content-between'>
                                        <p className='text-light multimedia_single_title'>{selectedMovie.title}</p>
                                        <div className='mt-4 ms-5'>
                                            <button
                                                className="btn btn-primary ver-trailer save-button-single-multimedia"
                                                type="button"
                                                onClick={store.watchlist?.some(movie => movie.id === selectedMovie.id)
                                                    ? () => actions.deleteFavouriteMovie(selectedMovie)
                                                    : () => actions.addFavouriteMovie(selectedMovie)}
                                            >
                                                {store.watchlist?.some(movie => movie.id === selectedMovie.id)
                                                    ? <i className="fa-solid fa-bookmark"></i>
                                                    : <i className="fa-regular fa-bookmark"></i>}
                                            </button>
                                        </div>
                                    </div>
                                    <p className='text-light fs-5'>{selectedMovie.overview ? selectedMovie.overview : <span className='sin-descripcion'>Sin descripción</span>}</p>
                                    <div className='fs-4 pt-3 d-flex align-items-baseline gap-2 puntaje'>
                                        <div className='d-flex align-items-baseline justify-content-start'>
                                            <img className='icono-modal me-2' src={estrella} alt="Estrella" />
                                            <span className='fw-bold text-light'>Puntuación de usuarios:</span>
                                        </div>
                                        <div className='porcentaje-valoracion'>
                                            <span className={selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}> {selectedMovie.vote_average ? (selectedMovie.vote_average * 10).toFixed(2) : '0'}%</span>
                                        </div>

                                    </div>
                                    <p className='fs-4 pt-1 d-flex align-items-baseline gap-2'>
                                        <img className='icono-modal' src={lapiz} alt="Lapiz" />
                                        <span className='fw-bold pt-2 text-light'>Valoraciones: </span><span className='text-light'>{selectedMovie.vote_count ? selectedMovie.vote_count : 0}</span>
                                    </p>
                                    <p className='fs-4 pt-1 align-items-baseline gap-2'>
                                        {platforms && platforms.length > 0 ? (
                                            <>
                                                <div>
                                                    <img className='icono-modal me-2' alt="smarttv" src={smartTv} />
                                                    <span className='fw-bold text-light'>Plataformas</span>
                                                </div>
                                                <div className='d-flex flex-wrap'>
                                                    {platforms.map((platform, index) => (
                                                        <Tooltip content={platform.provider_name} trigger="hover" placement="bottom" className='d-flex align-items-start bg-dark text-light ps-2 pe-0 pt-0 pb-0 fs-5 rounded'>
                                                            <img key={index} className='border platforms me-2 mt-3' src={`https://image.tmdb.org/t/p/w200${platform.logo_path}`} alt={platform.provider_name} />
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </>
                                        ) : ''}
                                    </p>


                                </div>

                                <div>
                                    {!playing && trailer && (
                                        <button
                                            className="btn btn-success fw-bold ver-trailer mt-4"
                                            onClick={handlePlayTrailer}
                                            type="button"
                                        >
                                            VER TRAILER
                                        </button>
                                    )}
                                    <div ref={videoContainerRef} className="video-container mt-3">
                                        {playing && (
                                            <div>
                                                <button onClick={() => setPlaying(false)} className="btn btn-primary fw-bold mb-3">
                                                    CERRAR
                                                </button>
                                                <YouTube
                                                    videoId={trailer ? trailer.key : ''}
                                                    className="reproductor"
                                                    containerClassName={"youtube-container amru"}
                                                    opts={{
                                                        width: "100%",
                                                        height: "100%",
                                                        playerVars: {
                                                            autoplay: 1,
                                                            controls: 1,
                                                            cc_load_policy: 0,
                                                            fs: 0,
                                                            iv_load_policy: 0,
                                                            modestbranding: 0,
                                                            rel: 0,
                                                            showinfo: 0,
                                                        },
                                                    }}
                                                />
                                            </div>
                                        )}

                                    </div>
                                </div>
                                <div className='d-flex flex-wrap'>
                                    <div className='me-5 mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Duración</div>
                                        <div className='text-light fs-5'>{selectedMovie.runtime > 0 ? `${selectedMovie.runtime} minutos` : 'Duración no informada'}</div>
                                    </div>
                                    <div className='me-5  mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Géneros</div>
                                        <div className='d-flex text-light fs-5'>{selectedMovie.genres && selectedMovie.genres.map((genre, index) => (
                                            <p className='pe-1' key={genre.id}>{genre.name}{index < selectedMovie.genres.length - 1 ? ', ' : ''}</p>
                                        ))}</div>
                                    </div>
                                    <div className='me-5  mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Fecha de estreno</div>
                                        <div className='text-light fs-5'>{formatDate(selectedMovie.release_date)}</div>
                                    </div>
                                    <div className='me-5  mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Idioma</div>
                                        <div className='text-light text-uppercase fs-5'>{selectedMovie.original_language}</div>
                                    </div>
                                </div>
                                {cast && cast.length > 0 ?

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
                                <h2 className='pt-4 text-info subtitle-modal'>Más información</h2>
                                <div className='text-light'>
                                    <div>
                                        <div>
                                            <p className='fs-2 fw-bold mt-3'>Productoras:</p>
                                            {selectedMovie.production_companies && selectedMovie.production_companies.map((company, index) => (
                                                <span className='fs-4' key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className='fs-2 fw-bold mt-3'>País:</p>
                                        <div>
                                            {selectedMovie.production_countries && selectedMovie.production_countries.map((country, index) => (
                                                <span className='fs-4' key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        {selectedMovie.budget > 0 ? <><span className='fw-bold fs-2 mt-3'>Presupuesto:</span> <span className='fs-4'>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.budget)}</span></> : <><span className='fw-bold fs-2 mt-3'>Presupuesto: </span>No informado</>}
                                    </div>
                                    <div className='d-flex flex-column'>
                                        {selectedMovie.revenue > 0 ? <><span className='fw-bold fs-2 mt-3'>Recaudación:</span><span className='fs-4'> {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.revenue)}</span></> : <><span className='fw-bold fs-2 mt-3'>Recaudación: </span>No informado</>}
                                    </div>
                                </div>

                                {recommendations && recommendations.length > 0 ? (

                                    <>

                                        <h2 className='pt-5 text-info subtitle-modal'>Te puede interesar</h2>

                                        <div className='d-flex flex-wrap gap-4 mb-4'>
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
                                                                    topMovie={''}
                                                                    proxEstreno={isUpcoming}
                                                                />
                                                            </div>
                                                        );

                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : ''}
                            </div>


                        </div>
                    </div>


                </>
            )}
        </>
    )
}