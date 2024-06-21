import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import { ModalSerie } from '../ModalSerie/ModalSerie';
import '../InfoMovie/infoMovie.css'
import { CardActores } from '../CardActores/CardActores';
import estrella from '../../../public/assets/img/estrella.png';
import lapiz from '../../../public/assets/img/lapiz.png';
import smartTv from '../../../public/assets/img/smart-tv.png';
import fondoNotFound from '../../../public/assets/img/fondo-not-found.jpeg';
import avatar from '../../../public/assets/img/avatar.webp';
import '../SnippetNovedades/bloque_novedades.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import '../BloqueGeneros/bloquegeneros.css'
import Swiper from 'swiper';
import { Tooltip } from "flowbite-react";
import '../Novedades/novedades.css'


const API_KEY = '4f5f43495afcc67e9553f6c684a82f84';
const API_URL = 'https://api.themoviedb.org/3';

const BloqueGenerosSerie = () => {
    const [genresSeries, setGenresSeries] = useState([]);
    const [selectedGenreSerie, setSelectedGenreSerie] = useState('10759');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [platforms, setPlatforms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [playing, setPlaying] = useState(false);


    useEffect(() => {
        // Obtener lista de géneros al montar el componente
        const fetchGenresSeries = async () => {
            try {
                const { data: { genres } } = await axios.get(`${API_URL}/genre/tv/list`, {
                    params: {
                        api_key: API_KEY,
                        language: 'es-ES',
                    },
                });
                setGenresSeries(genres);
            } catch (error) {
                console.error('Error al obtener la lista de géneros:', error);
            }
        };

        fetchGenresSeries();
    }, []);


    useEffect(() => {
        // Obtener series por género cuando el género seleccionado o la página cambian
        if (selectedGenreSerie) {
            const fetchMoviesByGenreSeries = async () => {
                try {
                    const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/tv`, {
                        params: {
                            api_key: API_KEY,
                            language: 'es-ES',
                            with_genres: selectedGenreSerie,
                            sort_by: 'popularity.desc',
                            'vote_count.gte': 30,
                            page: page,
                        },
                    });


                    setMovies(results);
                    setTotalPages(total_pages);
                } catch (error) {
                    console.error('Error al obtener series por género:', error);
                }
            };

            fetchMoviesByGenreSeries();
        }
    }, [selectedGenreSerie, page]);

    const handleGenreChangeSerie = (event) => {
        setSelectedGenreSerie(event.target.value);
        setPage(1); // Resetear a la primera página al cambiar de género
    };

    const fetchSerie = async (id) => {
        try {
            const { data } = await axios.get(`${API_URL}/tv/${id}?language=es-ES`, {
                params: {
                    api_key: API_KEY,
                    append_to_response: 'videos,credits,watch/providers,recommendations',
                },
            });

            if (data.videos && data.videos.results) {
                const trailer = data.videos.results.find((vid) => vid.name === "Official Trailer");
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
            const modal = new bootstrap.Modal(document.getElementById(`modalGenero-${id}`));
            modal.show();
        } catch (error) {
            console.error("Error fetching movie/series data:", error);
        }
    };

    const selectSerie = async (movie) => {
        fetchSerie(movie.id);
        setSelectedMovie(movie);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleCloseModal = () => {
        setPlaying(false);
        setSelectedMovie(null);
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

                        <ModalSerie
                            key={selectedMovie.id}
                            idModal={`modalGenero-${selectedMovie.id}`}
                            postherPad={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : fondoNotFound}
                            noImg={fondoNotFound}
                            originalName={selectedMovie.name}
                            seasons={selectedMovie.number_of_seasons > 1 ? `${selectedMovie.number_of_seasons} temporadas` : selectedMovie.number_of_seasons ? `${selectedMovie.number_of_seasons} temporada` : 'Temporadas desconocidas'}
                            episodes={selectedMovie.number_of_episodes > 1 ? `${selectedMovie.number_of_episodes} episodios` : selectedMovie.number_of_episodes ? `${selectedMovie.number_of_episodes} episodio` : 'Episodios desconocidos'}
                            mapGenre={selectedMovie.genres && selectedMovie.genres.length > 0 ? selectedMovie.genres.map((genre, index) => (
                                <p className='fs-4' key={genre.id}>{genre.name}{index < selectedMovie.genres.length - 1 ? ', ' : ''}</p>
                            )) : <p className='fs-4'>Género no informado</p>}
                            firstAirDate={selectedMovie.first_air_date ? formatDate(selectedMovie.first_air_date) : 'Fecha desconocida'}
                            lastAirDate={selectedMovie.last_air_date ? formatDate(selectedMovie.last_air_date) : 'No informado'}
                            originalLanguage={selectedMovie.original_language ? selectedMovie.original_language : <span className='text-lowercase'>Idioma desconocido</span>}
                            overview={selectedMovie.overview}
                            classPuntaje={`${selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                            voteAverage={selectedMovie.vote_average ? (selectedMovie.vote_average * 10).toFixed(2) : '0'}
                            voteCount={selectedMovie.vote_count ? selectedMovie.vote_count : 0}
                            mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.length > 0 ? selectedMovie.production_companies.map((company, index) => (
                                <span className='ps-2' key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                            )) : 'No informado'}
                            mapCountries={selectedMovie.production_countries && selectedMovie.production_countries.length > 0 ? selectedMovie.production_countries.map((country, index) => (
                                <span key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
                            )) : 'No informado'}
                            mapCreatedBy={selectedMovie.created_by && selectedMovie.created_by.length > 0
                                ? selectedMovie.created_by.map((createdBy, index) => (
                                    <span className='ps-2' key={createdBy.id}>
                                        {createdBy.name}{index < selectedMovie.created_by.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                                : 'No informado'}
                            mapNextEpisodeToAir={selectedMovie.next_episode_to_air && selectedMovie.next_episode_to_air.length > 0 ? selectedMovie.next_episode_to_air.map((nextEpisode, index) => (
                                <span className='ps-2' key={nextEpisode.id}>{nextEpisode.air_date}{nextEpisode.episode_number}</span>
                            )) : 'No'}
                            mapSeasonsSeasonName={selectedMovie.seasons && selectedMovie.seasons.map((season, index) => (
                                <span key={season.id}>{season.name}</span>
                            ))}
                            mapSeasonsSeasonDate={selectedMovie.seasons && selectedMovie.seasons.map((season, index) => (
                                <span key={season.id}>{formatDate(season.air_date) == '01/01/1970' ? 'Sin definir' : formatDate(season.air_date)}</span>
                            ))}
                            mapSeasonsSeasonEpisodes={selectedMovie.seasons && selectedMovie.seasons.map((episodes, index) => (
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

                                    <h2 className='pt-4 pb-4 text-info subtitle-modal'>Te puede interesar</h2>

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
                    )
                    }
                </main>
            </div>

            <div className='row container-fluid justify-content-center bloque-generos ms-1'>
                <div className='col-12 col-lg-2'>
                    <p className='mb-3 text-light title-select-generos'>Géneros Series</p>
                    <select className='form-select form-select-lg' value={selectedGenreSerie} onChange={handleGenreChangeSerie}>
                        {genresSeries.map(genre => (
                            <option key={genre.id} value={genre.id} className='fs-4'>{genre.name}</option>
                        ))}
                    </select>
                </div>



                <div className="col-12 col-lg-10 fade-in fs-5">



                    <div className="text-center container">
                        {page > 1 && (
                            <button className='btn btn-dark botones-paginacion ps-3 pe-3' onClick={() => setPage(page - 1)}>Anterior</button>
                        )}
                        {page < totalPages && (
                            <button className='btn btn-dark botones-paginacion ps-3 pe-3' onClick={() => setPage(page + 1)}>Siguiente</button>
                        )}
                    </div>

                    <div className="mt-4 mb-3 novedades bloque-card-mobile fade-in">
                        <div className="swiper-container-paginas">
                            <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex">
                                {movies.map((movie) => {
                                    const releaseDate = new Date(movie.release_date);
                                    const today = new Date();
                                    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                    return (
                                        <div className='swiper-slide-paginas pt-5 ps-5 fade-in'>
                                            <FilmCard
                                                key={movie.id}
                                                size={{ width: 'clamp(16rem,20vw,18rem)' }}
                                                image={movie.poster_path}
                                                title={movie.title ? movie.title : movie.name}
                                                overview={movie.overview}
                                                releaseDate={movie.title && movie.release_date ? <><span className='fw-bold'>Fecha:</span> {formatDate(movie.release_date)}</> : movie.name && movie.first_air_date ? <><span className='fw-bold'>Fecha: </span>{formatDate(movie.first_air_date)}</> : 'Fecha no informada'}
                                                voteAverage={<><span className='fw-bold'>Valoración:</span> {(movie.vote_average * 10).toFixed(2)} %</>}
                                                onclick={() => selectSerie(movie)}
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
                    <div className="flex-wrap justify-content-center mx-auto gap-5 mt-5 mb-3 novedades fade-in fs-5 bloque-cards-desktop-generos">

                        {movies.map(movie => {

                            const releaseDate = new Date(movie.release_date);
                            const today = new Date();
                            const isUpcoming = releaseDate > today ? "Próximo estreno" : "";
                            return (

                                <div className='fade-in'>
                                    <FilmCard
                                        key={movie.id}
                                        size={{ width: 'clamp(16rem,20vw,18rem)' }}
                                        image={movie.poster_path}
                                        title={movie.title ? movie.title : movie.name}
                                        overview={movie.overview}
                                        releaseDate={movie.title && movie.release_date ? <><span className='fw-bold'>Fecha:</span> {formatDate(movie.release_date)}</> : movie.name && movie.first_air_date ? <><span className='fw-bold'>Fecha: </span>{formatDate(movie.first_air_date)}</> : 'Fecha no informada'}
                                        voteAverage={<><span className='fw-bold'>Valoración:</span> {(movie.vote_average * 10).toFixed(2)} %</>}
                                        onclick={() => selectSerie(movie)}
                                        movieType={''}
                                        classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                        topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                        proxEstreno={isUpcoming}
                                    />
                                </div>
                            )
                        })}
                    </div>
                    <div className="text-center container mb-5">
                        {page > 1 && (
                            <button className='btn btn-dark botones-paginacion ps-3 pe-3' onClick={() => setPage(page - 1)}>Anterior</button>
                        )}
                        {page < totalPages && (
                            <button className='btn btn-dark botones-paginacion ps-3 pe-3' onClick={() => { setPage(page + 1); window.scrollTo(0, 0) }}>Siguiente</button>
                        )}
                    </div>
                </div>


            </div>
        </>
    );
};

export default BloqueGenerosSerie;
