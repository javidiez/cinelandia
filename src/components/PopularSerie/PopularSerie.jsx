import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
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

export const PopularesSerie = () => {
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
    const [playing, setPlaying] = useState(false);

    const fetchPopularesSerie = async (page) => {
        setLoading(true);
        try {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/tv/popular`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    page: page,
                },
            });

            setCurrentPage(page);
            setTotalPages(total_pages);

            // Filtrar duplicados
            const uniqueResults = results.filter((result, index, self) => 
                index === self.findIndex((t) => t.id === result.id)
            );

            setMovies(uniqueResults);
        } catch (error) {
            console.error("Error fetching popular series:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMovie = async (id) => {
        try {
            const { data } = await axios.get(`${API_URL}/tv/${id}`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    append_to_response: 'videos,credits,watch/providers',
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
    

            setSelectedSerie(data);
            const modal = bootstrap.Modal.getOrCreateInstance(`#modalPopularSerie-${id}`);
            modal.show();
        } catch (error) {
            console.error("Error fetching series details:", error);
        }
    };

    const selectMovie = async (movie) => {
        await fetchMovie(movie.id);
    };

    useEffect(() => {
        fetchPopularesSerie(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (selectedSerie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalPopularSerie-${selectedSerie.id}`));
            modal.show();
        }
    }, [selectedSerie]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
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
        setSelectedSerie(null); // Cierra el modal
    };

    return (
        <>
            <div>
                <main>
                    {selectedSerie && (
                        <ModalSerie
                            key={selectedSerie.id}
                            idModal={`modalPopularSerie-${selectedSerie.id}`}
                            postherPad={selectedSerie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedSerie.poster_path}` : fondoNotFound}
                            noImg={fondoNotFound}
                            originalName={selectedSerie.name}
                            seasons={selectedSerie.number_of_seasons > 1 ? `${selectedSerie.number_of_seasons} temporadas` : `${selectedSerie.number_of_seasons} temporada`}
                            episodes={selectedSerie.number_of_episodes > 1 ? `${selectedSerie.number_of_episodes} episodios` : `${selectedSerie.number_of_episodes} episodio`}
                            mapGenre={selectedSerie.genres && selectedSerie.genres.map((genre, index) => (
                                <p className='fs-4' key={genre.id}>{genre.name}{index < selectedSerie.genres.length - 1 ? ', ' : ''}</p>
                            ))}
                            firstAirDate={formatDate(selectedSerie.first_air_date)}
                            lastAirDate={formatDate(selectedSerie.last_air_date)}
                            originalLanguage={selectedSerie.original_language}
                            overview={selectedSerie.overview}
                            classPuntaje={`${selectedSerie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedSerie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                            voteAverage={(selectedSerie.vote_average * 10).toFixed(2)}
                            voteCount={selectedSerie.vote_count}
                            mapProductionCompanies={selectedSerie.production_companies && selectedSerie.production_companies.map((company, index) => (
                                <span className='ps-2' key={company.id}>{company.name}{index < selectedSerie.production_companies.length - 1 ? ', ' : ''}</span>
                            ))}
                            mapCountries={selectedSerie.production_countries && selectedSerie.production_countries.map((country, index) => (
                                <span key={country.iso_3166_1}>{country.name}{index < selectedSerie.production_countries.length - 1 ? ', ' : ''}</span>
                            ))}
                            mapNextEpisodeToAir={selectedSerie.next_episode_to_air && selectedSerie.next_episode_to_air.length > 0 ? selectedSerie.next_episode_to_air.map((nextEpisode, index) => (
                                <span className='ps-2' key={nextEpisode.id}>{nextEpisode.air_date}{nextEpisode.episode_number}</span>
                              )) : 'No'}
                            mapCreatedBy={selectedSerie.created_by && selectedSerie.created_by.length > 0
                                ? selectedSerie.created_by.map((createdBy, index) => (
                                    <span className='ps-2' key={createdBy.id}>
                                        {createdBy.name}{index < selectedSerie.created_by.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                                : 'No informado'}
                            mapSeasonsSeasonName={selectedSerie.seasons && selectedSerie.seasons.map((season, index) => (
                                <span key={season.id}>{season.name}</span>
                            ))}
                            mapSeasonsSeasonDate={selectedSerie.seasons && selectedSerie.seasons.map((season, index) => (
                                <span key={season.id}>{formatDate(season.air_date) == '01/01/1970' ? 'No informado' : formatDate(season.air_date)}</span>
                            ))}
                            mapSeasonsSeasonEpisodes={selectedSerie.seasons && selectedSerie.seasons.map((episodes, index) => (
                                <span key={episodes.id}>{episodes.episode_count == 0 ? 'Sin definir' : episodes.episode_count}</span>
                            ))}
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

                        />
                    )}
                </main>
            </div>

            <h2 className="text-center text-light novedades-title">Series populares</h2>

            <div className="text-center container">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>

            <div>
                <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 mb-3 novedades fs-5">
                    {movies.map((movie) => {
                        const releaseDate = new Date(movie.release_date);
                        const today = new Date();
                        const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

                        return (
                            <FilmCard
                                key={movie.id}
                                image={movie.poster_path}
                                title={movie.name}
                                overview={movie.overview}
                                releaseDate={formatDate(movie.first_air_date)}
                                voteAverage={isUpcoming ? '' : <><span className="fw-bold">Valoración:</span> {(movie.vote_average * 10).toFixed(2)}%</>}
                                onclick={() => selectMovie(movie)}
                                movieType={''}
                                classMovieType={""}
                                topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
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
    );
};
