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
import '../InfoMovie/infoMovie.css';
import '../SnippetNovedades/bloque_novedades.css'
import { Tooltip } from "flowbite-react";
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';

export const TopRated = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);

    const fetchTopRatedMovies = async (page) => {
        setLoading(true);
        try {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/movie/top_rated?adult=false`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    page: page,
                },
            });

            const filteredMovies = results.filter(movie => movie.vote_average > 7.75);
            filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

            setMovies(filteredMovies);
            setTotalPages(total_pages);
        } catch (error) {
            console.error("Error fetching top rated movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}`, {
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
        fetchTopRatedMovies(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (selectedMovie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalTopRated-${selectedMovie.id}`));
            modal.show();
        }
    }, [selectedMovie]);

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 150);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
      
          // Seleccionar el contenedor que contiene los elementos desplazables
          const swiper = document.querySelector('.swiper-wrapper-paginas');
          
          // Realizar scroll hacia la izquierda
          if (swiper) {
            swiper.scrollTo({
                top:400,
                left: 0, // Hacer scroll al inicio del contenedor
              behavior: 'smooth', // Opcional: hacerlo con animación smooth
            });
          }

          if (currentPage > 0) {
            setCurrentPage(currentPage + 1);
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
                            idModal={`modalTopRated-${selectedMovie.id}`}
                            postherPad={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : fondoNotFound}
                            noImg={fondoNotFound}
                            title={selectedMovie.title}
                            runTime={selectedMovie.runtime > 0 ? `${selectedMovie.runtime} minutos` : 'Duración no informada'}
                            mapGenre={selectedMovie.genres && selectedMovie.genres.map((genre, index) => (
                                <p className='fs-4' key={genre.id}>{genre.name}{index < selectedMovie.genres.length - 1 ? ', ' : ''}</p>
                            ))}
                            releaseDate={formatDate(selectedMovie.release_date)}
                            originalLanguage={selectedMovie.original_language}
                            overview={selectedMovie.overview}
                            classPuntaje={`${selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                            voteAverage={(selectedMovie.vote_average * 10).toFixed(2)}
                            voteCount={selectedMovie.vote_count}
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

            <h2 className="text-center text-light novedades-title">Películas mejor valoradas</h2>

            {loading ? (
                <div className="text-center text-light mt-5 fs-1">Cargando miles de películas...</div>
            ) : (
                <>
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
                            proxEstreno={isUpcoming}
                        />
                        </div>
                    );
                })}
            </div>
            </div>
            </div>

       
                <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 mb-3 novedades fs-5  bloque-cards-desktop">                            {movies.map((movie) => {
                                const releaseDate = new Date(movie.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

                                return (
                                    <FilmCard
                                        key={movie.id}
                                        image={movie.poster_path}
                                        title={movie.title}
                                        overview={movie.overview}
                                        releaseDate={movie.release_date ? <><span className='fw-bold'>Fecha</span> {formatDate(movie.release_date)}</> : 'Fecha no informada'}
                                        voteAverage={isUpcoming ? '' : <><span className="fw-bold">Valoración:</span> {(movie.vote_average * 10).toFixed(2)}%</>}
                                        onclick={() => selectMovie(movie)}
                                        movieType={''}
                                        classMovieType={""}
                                        topMovie={''}
                                        proxEstreno={isUpcoming}
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
            )}
        </>
    );
};
