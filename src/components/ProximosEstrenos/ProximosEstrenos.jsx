import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNowPlaying = async (page) => {
        const fetchMovies = async (currentPage, collectedMovies = []) => {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie?include_adult=false`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    sort_by: 'popularity.desc',
                    'primary_release_date.gte': formattedTomorrow,
                    page: currentPage,
                },
            });
    
            // Filtrar resultados para excluir películas en TL, JA, KO
            const filteredResults = results.filter(movie => !['tl', 'ja', 'ko', 'zh', 'th', 'ar'].includes(movie.original_language));
    
            // Combinar las películas válidas con las previamente recopiladas
            const newCollectedMovies = [...collectedMovies, ...filteredResults];
    
            // Si tenemos suficientes películas válidas, devolver las primeras 20
            if (newCollectedMovies.length >= 20 || currentPage >= total_pages) {
                return {
                    movies: newCollectedMovies.slice(0, 20),
                    total_pages,
                };
            }
    
            // Si no tenemos suficientes películas válidas, continuar con la siguiente página
            return fetchMovies(currentPage + 1, newCollectedMovies);
        };
    
        const { movies, total_pages } = await fetchMovies(page);
    
        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(movies);
    };
    
    useEffect(() => {
        fetchNowPlaying(currentPage);
    }, [currentPage]);

    const goToPreviousPage = () => {
        if (currentPage > 1) { // Asegúrate de que currentPage sea mayor a 1, ya que no hay página 0
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
        }
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


    return (
        <>
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
                                    <div className='swiper-slide-paginas ps-4 pt-3 fade-in' key={movie.id}>
                                        <FilmCard
                                            key={movie.id}
                                            size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                            image={movie.poster_path}
                                            title={movie.title}
                                            overview={movie.overview}
                                            voteAverage={''}
                                            releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar}/>  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar}/>{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                            movieType={''}
                                            info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
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
                            <React.Fragment key={movie.id}>
                            <FilmCard
                                key={movie.id}
                                image={movie.poster_path}
                                title={movie.title}
                                overview={movie.overview}
                                releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                voteAverage={''}
                                info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                                movieType={''}
                                classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                proxEstreno={''}
                                 
                            />
                            </React.Fragment>
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
