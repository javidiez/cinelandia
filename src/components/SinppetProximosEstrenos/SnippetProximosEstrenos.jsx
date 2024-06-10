import React from "react";
import { useEffect, useState } from 'react';
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
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import './snippet_pp.css'

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

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie?include_adult=false&popularity`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity.desc',
                'primary_release_date.gte': formattedTomorrow,
                page: page,
            },
        });

        const sortedResults = results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(sortedResults);
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
            setCast(castMembers.slice(0, 6));
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
            setRecommendations(recommend.slice(0, 6));
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

    const releaseDate = new Date(movies.release_date);
    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

    const moviesToShow = movies.slice(0, 5);

    const handleCloseModal = () => {
        setPlaying(false); // Detiene el video
        setSelectedMovie(null); // Cierra el modal
    };

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
                            overview={selectedMovie.overview}
                            classPuntaje={`${selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                            voteAverage={(selectedMovie.vote_average * 10).toFixed(2)}
                            voteCount={selectedMovie.vote_count}
                            mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.map((company, index) => (
                                <span className='ps-2' key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                            ))}
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
                            cast={cast && cast.map((actor, index) => (

                                <CardActores
                                    key={index}
                                    castImg={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                    castName={actor.name}
                                    noImg={avatar}
                                    castCharacter={actor.character ? ` (${actor.character})` : ''}
                                />

                            ))}
                            providers={platforms && platforms.length > 0 ? (
                                <>
                                    <div>
                                        <img className='icono-modal me-2' alt="smarttv" src={smartTv} />
                                        <span className='fw-bold'>Plataformas</span>
                                    </div>
                                    {platforms.map((platform, index) => (
                                        <img key={index} className='border platforms me-2 mt-2' src={`https://image.tmdb.org/t/p/w200${platform.logo_path}`} alt={platform.provider_name} />
                                    ))}
                                </>
                            ) : ''}
                            recommendations={recommendations && recommendations.length > 0 ? (

                                <>

                                    <h2 className='pt-5 pb-4 text-primary subtitle-modal'>Recomendaciones</h2>

                                    <div className='d-flex flex-wrap gap-4'>
                                        {recommendations.map((recommend) => {
                                            const releaseDate = new Date(recommend.release_date);
                                            const today = new Date();
                                            const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                            return (
                                                <div className='film-card-modal'>
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
                                </>
                            ) : ''}

                        />
                    )}
                </main>
            </div>



            <div>

                <div className="d-flex flex-column container-fluid snippet_pp">

                    <h2 className="text-center text-light snippet_pp_title">Próximos estrenos</h2>







                    {moviesToShow.map((movie) => {



                        return (
                            <>
                                <BloqueProximosEstrenos
                                    key={movie.id}
                                    img={`${IMAGE_PATH}${movie.poster_path}`}
                                    title={movie.title}
                                    description={''}
                                    date={formatDate(movie.release_date)}
                                    onclick={() => selectMovie(movie)}
                                />
                                <hr className="border-2 border-top border-secondary" />
                            </>
                        );
                    })}
                    <div className="text-center mb-5 mt-3 ">
                        <a href="./proximos_estrenos.html"><button className='btn btn-primary botones-ver-mas ps-3 pe-3'>Ver mas</button></a>
                    </div>
                </div>


            </div>


        </>
    );
};