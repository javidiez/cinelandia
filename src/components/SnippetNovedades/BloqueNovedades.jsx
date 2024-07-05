import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css';
import './bloque_novedades.css';
import '../Modal/modal.css';
import '../WatchlistSerieMovie/watchlistSerieMovie.css';
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Link } from 'react-router-dom';
import { Context } from '../../store/appContext';


export const BloqueNovedades = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const { store, actions } = useContext(Context);

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
        setMovies(results);
    };

    useEffect(() => {
        fetchNowPlaying(currentPage);
    }, [currentPage]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const moviesToShow = movies.slice(0, 12);

    useEffect(() => {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 20, // Espacio entre las tarjeta

        });
    }, []);

    return (
        <>
            <h2 className="text-center text-light snippet_novedades_title fade-in">Novedades</h2>
            <div className="mt-4 novedades bloque-card-mobile fade-in">
                <div className="swiper-container-paginas">
                    <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex">
                        {movies.map((movie) => {
                            const releaseDate = new Date(movie.release_date);
                            const today = new Date();
                            const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                            return (
                                <div className='swiper-slide-paginas ps-5 pt-3 fade-in' key={movie.id}>
                                    <FilmCard
                                        key={movie.id}
                                        size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                        image={movie.poster_path}
                                        title={movie.title ? movie.title : movie.name}
                                        overview={movie.overview}
                                        releaseDate={<div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} /> {formatDate(movie.release_date)}</div>}
                                        voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                        info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                                        movieType={''}
                                        classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                                        topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                                        proxEstreno={isUpcoming}
                                        saveButton={
                                            <button
                                                className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                                                type="button"
                                                onClick={store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                                    ? () => actions.deleteFavouriteMovie(movie)
                                                    : () => actions.addFavouriteMovie(movie)}
                                            >
                                                {store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                                    ? <i className="fa-solid fa-bookmark"></i>
                                                    : <i className="fa-regular fa-bookmark"></i>}
                                            </button>
                                        }
                                        
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex-wrap justify-content-center mx-auto gap-5 mt-5 mb-3 novedades fade-in fs-5 bloque-cards-desktop-generos">
                {moviesToShow.map((movie) => {
                    const releaseDateMovie = new Date(movie.release_date);
                    const today = new Date();
                    const isUpcoming = releaseDateMovie > today ? "Próximo estreno" : "";

                    const formatDateReleaseDate = (dateString) => {
                        const date = new Date(dateString);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    };


                    return (
                        <React.Fragment key={movie.id}>
                        <FilmCard
                            key={movie.id}
                            size={{ width: '15.5rem' }}
                            image={movie.poster_path}
                            title={movie.title}
                            overview={movie.overview}
                            releaseDate={<div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} /> {formatDate(movie.release_date)}</div>}
                            voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                            info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}`}
                            movieType={''}
                            classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                            topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                            proxEstreno={isUpcoming}
                            saveButton={
                                <button
                                    className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                                    type="button"
                                    onClick={store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                        ? () => actions.deleteFavouriteMovie(movie)
                                        : () => actions.addFavouriteMovie(movie)}
                                >
                                    {store.watchlist?.some(pelicula => pelicula.id === movie.id)
                                        ? <i className="fa-solid fa-bookmark"></i>
                                        : <i className="fa-regular fa-bookmark"></i>}
                                </button>
                            }
                             
                           
                        />
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="container pb-5 mt-5 text-center ">
                <Link to="/novedades"><button className='btn btn-primary botones-ver-mas fw-bold ps-3 pe-3'>MÁS NOVEDADES</button></Link>
            </div>
        </>
    );
};
