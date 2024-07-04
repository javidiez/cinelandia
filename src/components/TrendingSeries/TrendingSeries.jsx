import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';

export const TrendingSerie = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchTrendingSerie = async (page) => {
        setLoading(true);
        try {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/trending/tv/week?language=es-ES`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    page: page,
                },
            });

            setTotalPages(total_pages);

            // Filtrar duplicados y asegurar 20 resultados únicos
            const uniqueResults = results.filter((result, index, self) =>
                index === self.findIndex((t) => t.id === result.id)
            );

            const newMovies = [...movies, ...uniqueResults].filter((result, index, self) =>
                index === self.findIndex((t) => t.id === result.id)
            );

            if (newMovies.length < 20 && page < total_pages) {
                fetchTrendingSerie(page + 1);
            } else {
                setMovies(newMovies.slice(0, 20));
                setCurrentPage(page);
            }
        } catch (error) {
            console.error("Error fetching popular series:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendingSerie(currentPage);
    }, [currentPage]);


    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setMovies([]);
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setMovies([]);
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 150);

            // Seleccionar el contenedor que contiene los elementos desplazables
            const swiper = document.querySelector('.swiper-wrapper-paginas');

            // Realizar scroll hacia la izquierda
            if (swiper) {
                swiper.scrollTo({
                    top: 150,
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

    useEffect(() => {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 20, // Espacio entre las tarjeta

        });
    }, []);

    return (
        <>
            <h2 className="text-center text-light novedades-title">Tendencias</h2>

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
                                            title={movie.name}
                                            overview={movie.overview}
                                            voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                            releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                            info_multimedia={`${window.location.origin}/serie/${movie.id}/${movie.name}`}
                                             
                                            movieType={''}
                                            classMovieType={""}
                                            topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                            proxEstreno={isUpcoming}

                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center mx-auto gap-5 mt-5 mb-3 novedades fs-5 bloque-cards-desktop">
                    {movies.map((movie) => {
                        const releaseDate = new Date(movie.release_date);
                        const today = new Date();
                        const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

                        return (
                            <React.Fragment key={movie.id}>
                            <FilmCard
                                key={movie.id}
                                image={movie.poster_path}
                                ize={{ width: 'clamp(16rem,20vw,18rem)' }}
                                title={movie.name}
                                overview={movie.overview}
                                voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                info_multimedia={`${window.location.origin}/serie/${movie.id}/${movie.name}`}
                                 
                                movieType={''}
                                classMovieType={""}
                                topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                proxEstreno={isUpcoming}

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
