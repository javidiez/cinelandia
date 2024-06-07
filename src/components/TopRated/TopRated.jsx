import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { Modal } from '../Modal/Modal';
import { Buscador } from '../Buscador/Buscador';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'

export const TopRated = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";

    const [movies, setMovies] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    //const [selectedMovie, setSelectedMovie] = useState({})
    const [selectedMovie, setSelectedMovie] = useState("");
  
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el número total de páginas
    const [showNoResults, setShowNoResults] = useState(false);

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/movie/top_rated?language=es-ES`, {
            params: {
                api_key: API_KEY,
                page: page,
            },
        });

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(results);
    };


    const fetchMovies = async (searchKey = "", page = 1) => {
        const type = searchKey ? "search" : "";
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/${type}/multi?include_adult=false&language=es-ES`, {
          params: {
            api_key: API_KEY,
            query: searchKey,
            include_adult: false,
            page: page,
          },
        });
        //console.log('data',results);
        //setSelectedMovie(results[0])
    
        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(results);
        setMovie(results[0]);
    
      };




    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}?language=es-ES`, {
            params: {
                api_key: API_KEY,
            },
        });
        setSelectedMovie(data);
        const modal = new bootstrap.Modal(document.getElementById(`modalTopRated-${id}`));
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
            const modal = new bootstrap.Modal(document.getElementById(`modalTopRated-${selectedMovie.id}`));
            modal.show();
        }
    }, [selectedMovie]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            fetchNowPlaying(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchNowPlaying(currentPage + 1);
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

    const searchMovies = async (e) => {
        e.preventDefault();
        setMovies([]);  // Reiniciar la lista de películas antes de realizar una nueva búsqueda
    
        // Realizar la búsqueda de películas
        await fetchMovies(searchKey);
    
        // Verificar si no hay resultados después de la búsqueda
        if (movies.length === 0) {
          // Mostrar el mensaje "No se encontraron resultados"
          setShowNoResults(true);
        } else {
          // Ocultar el mensaje "No se encontraron resultados"
          setShowNoResults(false);
        }
      };
    


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
                            runTime={selectedMovie.runtime}
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
                            budget={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.budget)}
                            revenue={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.revenue)}
                            estrella={estrella}
                            lapiz={lapiz}

                        />
                    )}
                </main>
            </div>

            <h2 className="text-center text-light novedades-title">Películas mejor valoradas</h2>

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
                                title={movie.title}
                                overview={movie.overview}
                                releaseDate={formatDate(movie.release_date)}
                                voteAverage={(movie.vote_average * 10).toFixed(2)}
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
    );
};
