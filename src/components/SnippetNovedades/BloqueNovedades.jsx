import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { Modal } from '../Modal/Modal';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import './bloque_novedades.css'

export const BloqueNovedades = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity',
                'primary_release_date.gte': sixMonthsAgo.toISOString().split('T')[0],
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
            },
        });
        setSelectedMovie(data);
        const modal = new bootstrap.Modal(document.getElementById(`modalNovedad-${id}`));
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
            const modal = new bootstrap.Modal(document.getElementById(`modalNovedad-${selectedMovie.id}`));
            modal.show();
        }
    }, [selectedMovie]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            fetchNowPlaying(currentPage - 1);
            window.scrollTo(0, 500);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchNowPlaying(currentPage + 1);
            window.scrollTo(0, 500);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const moviesToShow = movies.slice(0, 12);

    return (
        <>
            <div>
                <main>
                    {selectedMovie && (
                        <Modal
                            key={selectedMovie.id}
                            idModal={`modalNovedad-${selectedMovie.id}`}
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

            <h2 className="text-center text-light snippet_novedades_title">Novedades</h2>

                <div className="row justify-content-center mx-auto gap-5 mt-5 mb-3 novedades fs-5">
                    {moviesToShow.map((movie) => {
                        const releaseDate = new Date(movie.release_date);
                        const today = new Date();
                        const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                        return (
                            <FilmCard
                                key={movie.id}
                                size={{ width: '16rem' }}
                                image={movie.poster_path}
                                title={movie.title}
                                overview={movie.overview}
                                releaseDate={formatDate(movie.release_date)}
                                voteAverage={(movie.vote_average * 10).toFixed(2)}
                                onclick={() => selectMovie(movie)}
                                movieType={''}
                                classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                proxEstreno={isUpcoming}
                            />
                        );
                    })}
                </div>

            <div className="container pb-5 mt-5 text-center ">
                <a href="novedades.html"><button className='btn btn-primary botones-ver-mas ps-3 pe-3'>Ver más</button></a>
            </div>
        </>
    );
};
