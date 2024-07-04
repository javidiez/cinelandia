import { Context } from "../../store/appContext";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
import { CardActores } from '../CardActores/CardActores';
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import smartTv from '../../assets/img/smart-tv.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import avatar from '../../assets/img/avatar.webp';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../SwitchPeliSerie/SwitchPeliSerie.css'
import './BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Tooltip } from "flowbite-react";
import { Link } from 'react-router-dom';

export const BloqueSeries = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNovedadesSerie = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/tv`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity.desc',
                'vote_count.gte': 30,
                'first_air_date.gte': sixMonthsAgo.toISOString().split('T')[0],
                page: page,
            },
        });

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(results);
    };

    useEffect(() => {
        fetchNovedadesSerie(currentPage);
    }, [currentPage]);



    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    const seriesToShow = movies.slice(0, 12);

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
                                <div className='swiper-slide-paginas ps-5 pt-3 fade-in'>
                                    <FilmCard
                                        key={movie.id}
                                        size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                        image={movie.poster_path}
                                        title={movie.title ? movie.title : movie.name}
                                        overview={movie.overview}
                                        voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                                        releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                                        info_multimedia={`${window.location.origin}/serie/${movie.id}/${movie.name}`}
                                         
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
                {seriesToShow.map((movie) => {
                    const releaseDate = new Date(movie.first_air_date);
                    const today = new Date();
                    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                    return (

                        <FilmCard
                            key={movie.id}
                            size={{ width: '15.5rem' }}
                            image={movie.poster_path}
                            title={movie.name}
                            overview={movie.overview}
                            voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                            releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                            info_multimedia={`${window.location.origin}/serie/${movie.id}/${movie.name}`}
                             
                            movieType={''}
                            classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                            topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                            proxEstreno={isUpcoming}
                            

                        />

                    );
                })}
            </div>

            <div className="container pb-5 mt-5 text-center ">
                <Link to="/novedades_series"><button className='btn btn-primary botones-ver-mas fw-bold ps-3 pe-3'>MÁS NOVEDADES</button></Link>
            </div>

        </>
    );
};
