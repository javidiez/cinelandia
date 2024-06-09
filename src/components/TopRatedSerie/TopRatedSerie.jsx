import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css';

export const TopRatedSerie = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";

    const [movies, setMovies] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchTopRatedSeries = async () => {
        setLoading(true);

        try {
            let allResultsMap = {}; // Objeto de mapa para almacenar las series sin duplicados
            let totalPages = 1;
            let currentPage = 1;

            // Realiza bucle hasta que hayas obtenido todas las páginas de resultados
            while (currentPage <= totalPages) {
                const { data: { results, total_pages } } = await axios.get(`${API_URL}/tv/top_rated`, {
                    params: {
                        api_key: API_KEY,
                        language: 'es-ES',
                        page: currentPage,
                    },
                });

                // Agrega cada serie al objeto de mapa utilizando el id como clave
                results.forEach(serie => {
                    allResultsMap[serie.id] = serie;
                });

                totalPages = total_pages;
                currentPage++;
            }

            // Extrae los valores del objeto de mapa (las series únicas) y conviértelos en una matriz
            const allResults = Object.values(allResultsMap);

            // Ordena todas las películas por fecha de first_air_date
            allResults.sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));

            // Establece las películas ordenadas en el estado
            setMovies(allResults);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching top rated series:", error);
        } finally {
            setLoading(false);
        }
    };



    const fetchSerie = async (id) => {
        try {
            const { data } = await axios.get(`${API_URL}/tv/${id}`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                },
            });
            setSelectedSerie(data);
        } catch (error) {
            console.error("Error fetching series details:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSerieSelect = async (serie) => {
        await fetchSerie(serie.id);
    };

    useEffect(() => {
        fetchTopRatedSeries(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (selectedSerie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalTopRatedSerie-${selectedSerie.id}`));
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

    const handleCloseModal = () => {
        setSelectedSerie(null); // Cierra el modal
    };

    return (
        <>
            <div>
                <main>
                    {selectedSerie && (
                        <ModalSerie
                            key={selectedSerie.id}
                            idModal={`modalTopRatedSerie-${selectedSerie.id}`}
                            postherPad={selectedSerie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedSerie.poster_path}` : fondoNotFound}
                            noImg={fondoNotFound}
                            originalName={selectedSerie.name}
                            seasons={selectedSerie.number_of_seasons > 1 ? `${selectedSerie.number_of_seasons} temporadas` : `${selectedSerie.number_of_seasons} temporada`}
                            episodes={`${selectedSerie.number_of_episodes} episodios`}
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
                                <span key={season.id}>{formatDate(season.air_date) == '01/01/1970' ? 'No informado' : formatDate(season.air_date) }</span>
                            ))}
                            mapSeasonsSeasonEpisodes={selectedSerie.seasons && selectedSerie.seasons.map((episodes, index) => (
                                <span key={episodes.id}>{episodes.episode_count == 0 ? 'Sin definir' : episodes.episode_count}</span>
                            ))}
                            estrella={estrella}
                            lapiz={lapiz}
                            onClose={handleCloseModal}
                        />
                    )}
                </main>
            </div>

            <h2 className="text-center text-light novedades-title">Series mejor valoradas</h2>

            {loading ? (
                <div className="text-center text-light mt-5 fs-1">Cargando miles de series, aguarde unos segundos...</div>
            ) : (
                <>
                    <div className="text-center container">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                    </div>

                    <div>
                        <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 mb-3 novedades fs-5">
                            {movies.slice((currentPage - 1) * 20, currentPage * 20).map((movie) => {
                                const releaseDate = new Date(movie.first_air_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

                                return (
                                    <FilmCard
                                        key={movie.id}
                                        size={{ width: '18rem' }}
                                        image={movie.poster_path}
                                        title={movie.name}
                                        overview={movie.overview}
                                        releaseDate={formatDate(movie.first_air_date)}
                                        voteAverage={isUpcoming ? '' : <><span className="fw-bold">Valoración:</span> {(movie.vote_average * 10).toFixed(2)}%</>}
                                        onclick={() => handleSerieSelect(movie)}
                                        movieType={''}
                                        classMovieType={''}
                                        topMovie={''}
                                        proxEstreno={isUpcoming}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-center container pb-5">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                    </div>
                </>
            )}
        </>
    );
};

