import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import { Modal } from '../Modal/Modal';
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

export const ProximosEstrenos = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity',
                'primary_release_date.gte': formattedTomorrow,
                page: page,
            },
        });

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(results);
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
        const modal = new bootstrap.Modal(document.getElementById(`modalEstrenos-${id}`));
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
            const modal = new bootstrap.Modal(document.getElementById(`modalEstrenos-${selectedMovie.id}`));
            modal.show();
        }
    }, [selectedMovie]);

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            fetchNowPlaying(currentPage - 1);
            window.scrollTo(0, 150);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchNowPlaying(currentPage + 1);

            // Seleccionar el contenedor que contiene los elementos desplazables
            const swiper = document.querySelector('.swiper-wrapper-paginas');

            // Realizar scroll hacia la izquierda
            if (swiper) {
                swiper.scrollTo({
                    top: 500,
                    left: 0, // Hacer scroll al inicio del contenedor
                    behavior: 'smooth', // Opcional: hacerlo con animación smooth
                });
            }

            if (currentPage > 0) {
                fetchNowPlaying(currentPage + 1);
                window.scrollTo(0, 150);
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
                            voteAverage={selectedMovie.vote_average ? (selectedMovie.vote_average * 10).toFixed(2) : '0'}
                            voteCount={selectedMovie.vote_count ? selectedMovie.vote_count : 0}
                            mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.length > 0 ? selectedMovie.production_companies.map((company, index) => (
                                <span key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                            )) : 'No informado'}
                            mapCountries={selectedMovie.production_countries && selectedMovie.production_countries.length > 0 ? selectedMovie.production_countries.map((country, index) => (
                                <span key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
                            )) : 'No informado'}
                            budget={selectedMovie.budget > 0 ? <><span className='fw-bold'>Presupuesto:</span> {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.budget)}</> : <><span className='fw-bold'>Presupuesto: </span>No informado</>}
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
                        />
                    )}
                </main>
            </div>

            <h2 className="text-center text-light novedades-title">Próximos estrenos</h2>

            <div className="text-center container">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>

            <div>
                <div className="mt-4 novedades bloque-card-mobile fade-in">
                    <div className="swiper-container-paginas">
                        <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex">
                            {movies.map((movie) => {
                                const releaseDate = new Date(movie.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                return (
                                    <div className='swiper-slide-paginas ps-4 pt-3 fade-in'>
                                        <FilmCard
                                            key={movie.id}
                                            size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                            image={movie.poster_path}
                                            title={movie.title}
                                            overview={movie.overview}
                                            releaseDate={movie.release_date ? <><span className='fw-bold'>Fecha</span> {formatDate(movie.release_date)}</> : ''}
                                            voteAverage={isUpcoming ? '' : <><span className="fw-bold">Valoración:</span> {(movie.vote_average * 10).toFixed(2)}%</>} onclick={() => selectMovie(movie)}
                                            movieType={''}
                                            classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                            topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                            proxEstreno={''}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>


                <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 mb-3 novedades fs-5  bloque-cards-desktop">
                    {movies.map((movie) => {
                        const releaseDate = new Date(movie.release_date);
                        const today = new Date();
                        const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                        return (
                            <FilmCard
                                key={movie.id}
                                image={movie.poster_path}
                                title={movie.title}
                                overview={movie.overview}
                                releaseDate={<><span className='fw-bold'>Fecha</span> {formatDate(movie.release_date)}</>}
                                voteAverage={''}
                                onclick={() => selectMovie(movie)}
                                movieType={''}
                                classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                proxEstreno={''}
                            />
                        );
                    })}
                </div>


            </div>
            <div className="text-center container pb-5">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>
        </>
    );
};
