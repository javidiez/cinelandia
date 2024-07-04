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
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import { Tooltip } from "flowbite-react";
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import '../Navbar/navbar.css'
import '../PeliculaSingle/peliculaSingle.css'
import './SerieSingle.css'
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

export const SerieSingle = () => {

    const { id, serie_name } = useParams();

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    const [selectedSerie, setSelectedSerie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);
    const { store, actions } = useContext(Context);
    const videoContainerRef = useRef(null);

    const fetchSerie = async (id) => {
        try {
            const { data } = await axios.get(`${API_URL}/tv/${id}`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
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
                // Extraer el elenco de la respuesta de la API
                const recommend = data.recommendations.results;
                // Configurar el estado 'cast' con la lista de miembros del elenco
                setRecommendations(recommend.slice(0, 20));
            }


            setSelectedSerie(data);
        } catch (error) {
            console.error("Error fetching series details:", error);
        }
    };

    useEffect(() => {
        fetchSerie(id)
        window.scrollTo(0, 0)
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


    useEffect(() => {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 20, // Espacio entre las tarjeta

        });
    }, []);

    const mapSeasonsSeasonRows = () => {
        if (!selectedSerie || !selectedSerie.seasons) return null;

        return selectedSerie.seasons.map((season, index) => (
            <tr key={season.id}>
                <td className="large-cell-season">{season.name}</td>
                <td className=''>{season.episode_count > 0 ? season.episode_count : 'No informado'}</td>
                <td>{formatDate(season.air_date) === '01/01/1970' ? 'No informado' : formatDate(season.air_date)}</td>
            </tr>
        ));
    };

    return (
        <>
            {selectedSerie && (
                <>

                    <div className='contenedor-multimedia container' style={{ backgroundImage: selectedSerie.backdrop_path ? `url(https://image.tmdb.org/t/p/w500${selectedSerie.backdrop_path})` : `url(${fondoNotFound})` }}>
                        <div className='contenido_multimedia p-4'>
                            <div className='row'>
                                <div className='col-sm-auto container-posther_path'>
                                    <img
                                        className='poster_path img-fluid rounded'
                                        src={selectedSerie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedSerie.poster_path}` : fondoNotFound}
                                        alt={selectedSerie.name}
                                    />
                                </div>

                                <div className='col'>
                                    <div className='d-flex justify-content-between'>

                                        <p className='text-light multimedia_single_title'>{selectedSerie.name}</p>

                                        <div className='mt-4 ms-5 d-flex align-items-start gap-3'>

                                            <button
                                                className="btn btn-primary ver-trailer save-button-single-multimedia"
                                                type="button"
                                                onClick={store.watchlistSerie?.some(movie => movie.id === selectedSerie.id)
                                                    ? () => actions.deleteFavouriteSerie(selectedSerie)
                                                    : () => actions.addFavouriteSerie(selectedSerie)}
                                            >
                                                {store.watchlistSerie?.some(movie => movie.id === selectedSerie.id)
                                                    ? <i className="fa-solid fa-bookmark"></i>
                                                    : <i className="fa-regular fa-bookmark"></i>}
                                            </button>
                                            <WhatsappShareButton url={`${window.location.origin}/serie/${selectedSerie.id}`}>
                                                <i className="fa-solid fa-square-share-nodes share-icon text-light"></i>
                                            </WhatsappShareButton>
                                        </div>

                                    </div>
                                    <p className='text-light fs-5'>{selectedSerie.overview ? selectedSerie.overview : <span className='sin-descripcion fs-5'>Sin descripción</span>}</p>
                                    <div className='fs-4 pt-3 d-flex align-items-baseline gap-2 puntaje'>
                                        <div className='d-flex align-items-baseline justify-content-start'>
                                            <img className='icono-modal me-2' src={estrella} alt="Estrella" />
                                            <span className='fw-bold text-light me-2'>Puntuación:</span>
                                            <span className={selectedSerie.vote_average * 10 >= 80 ? 'puntaje-verde py-0' : selectedSerie.vote_average * 10 > 60 ? 'puntaje-amarillo py-0' : 'puntaje-rojo py-0'}> {selectedSerie.vote_average ? Math.round(selectedSerie.vote_average * 10) : '0'} %</span>
                                        </div>

                                    </div>
                                    <p className='fs-4 pt-1 d-flex align-items-baseline gap-2'>
                                        <img className='icono-modal' src={lapiz} alt="Lapiz" />
                                        <span className='fw-bold pt-2 text-light'>Valoraciones: </span><span className='text-light'>{selectedSerie.vote_count ? selectedSerie.vote_count : 0}</span>
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
                                <div className='d-flex flex-wrap mt-4'>
                                    <div className='me-5 mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Temporadas</div>
                                        <div className='text-light fs-5'>{selectedSerie.number_of_seasons > 1 ? `${selectedSerie.number_of_seasons} temporadas` : selectedSerie.number_of_seasons ? `${selectedSerie.number_of_seasons} temporada` : 'Temporadas desconocidas'}</div>
                                    </div>
                                    <div className='me-5 mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Episodios</div>
                                        <div className='text-light fs-5'>{selectedSerie.number_of_episodes > 1 ? `${selectedSerie.number_of_episodes} episodios` : selectedSerie.number_of_episodes ? `${selectedSerie.number_of_episodes} episodio` : 'Episodios desconocidos'}</div>
                                    </div>
                                    <div className='me-5  mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Géneros</div>
                                        <div className='d-flex flex-wrap text-light fs-5'>{selectedSerie.genres && selectedSerie.genres.map((genre, index) => (
                                            <p className='pe-1' key={genre.id}>{genre.name}{index < selectedSerie.genres.length - 1 ? ', ' : ''}</p>
                                        ))}</div>
                                    </div>
                                    <div className='me-5  mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Fecha de estreno</div>
                                        <div className='text-light fs-5'>{selectedSerie.first_air_date ? formatDate(selectedSerie.first_air_date) : 'Desconocida'}</div>

                                    </div>
                                    <div className='me-5  mb-3'>

                                        <div className='fs-2 text-light fw-bold'>Último episodio</div>
                                        <div className='text-light fs-5'>{selectedSerie.last_air_date ? formatDate(selectedSerie.last_air_date) : 'No informado'}</div>
                                    </div>
                                    <div className='me-5  mb-3'>
                                        <div className='fs-2 text-light fw-bold'>Idioma</div>
                                        <div className='text-light text-uppercase fs-5'>{selectedSerie.original_language}</div>
                                    </div>
                                </div>
                                <div>
                                    {!playing && trailer && (
                                        <button
                                            className="btn btn-success fw-bold ver-trailer mt-2"
                                            onClick={handlePlayTrailer}
                                            type="button"
                                        >
                                            VER TRAILER
                                        </button>
                                    )}
                                    <div ref={videoContainerRef} className="video-container mt-2">
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

                                <h2 className='pt-3 pb-3 text-info subtitle-modal'>Información sobre Temporadas</h2>
                                <div className="table-responsive d-flex justify-content-center overflow-hidden">
                                    <table className="table">
                                        <thead>
                                            <tr>

                                                <th scope="col">Temporada</th>
                                                <th scope="col">Episodios</th>
                                                <th scope="col">Estreno</th>
                                            </tr>

                                        </thead>
                                        <tbody className='letra-tabla-seasons'>
                                            {mapSeasonsSeasonRows()}
                                        </tbody>
                                    </table>
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
                                <h2 className='pt-4 text-info subtitle-modal mas-info-single-page'>Más información</h2>
                                <div className='text-light'>
                                    <div>
                                        <div>
                                            <p className='fs-2 fw-bold mt-3'>Productoras:</p>
                                            {selectedSerie.production_companies && selectedSerie.production_companies.length > 0 ? selectedSerie.production_companies.map((company, index) => (
                                                <span className='fs-4' key={company.id}>{company.name}{index < selectedSerie.production_companies.length - 1 ? ', ' : ''}</span>
                                            )) : <span className='fs-4'>No informado</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className='fs-2 fw-bold mt-3'>País:</p>
                                        <div>
                                            {selectedSerie.production_countries && selectedSerie.production_countries.length > 0 ? selectedSerie.production_countries.map((country, index) => (
                                                <span className='fs-4' key={country.iso_3166_1}>{country.name}{index < selectedSerie.production_countries.length - 1 ? ', ' : ''}</span>
                                            )) : <span className='fs-4'>No informado</span>}
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <p className='fs-2 fw-bold mt-3'>Creador:</p>
                                        {selectedSerie.created_by && selectedSerie.created_by.length > 0
                                            ? selectedSerie.created_by.map((createdBy, index) => (
                                                <span className='fs-4' key={createdBy.id}>
                                                    {createdBy.name}{index < selectedSerie.created_by.length - 1 ? ', ' : ''}
                                                </span>
                                            ))
                                            : <span className='fs-4'>No informado</span>}
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

                                                            <div className='me-4 film-card-recommend'>
                                                                <FilmCardRecommendations
                                                                    key={recommend.id}
                                                                    size={{ width: '13rem' }}
                                                                    image={recommend.poster_path}
                                                                    title={recommend.name}
                                                                    overview={recommend.overview}
                                                                    releaseDate={recommend.title && recommend.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(recommend.release_date)}</div> : recommend.name && recommend.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(recommend.first_air_date)}</div> : 'Fecha no informada'}
                                                                    voteAverage={isUpcoming || isNaN(recommend.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard-recommend' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard-recommend' src={estrella} /> {Math.round(recommend.vote_average * 10)} %</div>}
                                                                    movieType={''}
                                                                    classMovieType={recommend.title ? 'movie-type-movie' : 'movie-type-serie'}
                                                                    topMovie={recommend.vote_average > 7.75 && recommend.vote_count > 99 ? <span className='destacada-recommend'>Destacada</span> : ''}
                                                                    proxEstreno={isUpcoming}
                                                                    info_multimedia={`${window.location.origin}/serie/${recommend.id}/${recommend.name}`}
                                                                     
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