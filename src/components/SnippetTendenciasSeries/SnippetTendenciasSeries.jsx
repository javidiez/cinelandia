import React from "react";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { BloqueTendenciasSeries } from "./BloqueTendenciasSeries";
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SinppetProximosEstrenos/snippet_pp.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Link } from "react-router-dom";

export const SnippetTendenciasSeries = () => {

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);


    const fetchTopRatedSeries = async () => {
        setLoading(true);

        try {
            const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/tv`, {
                params: {
                    api_key: API_KEY,
                    language: 'es-ES',
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 1000,
                    'vote_average.gte': 8.1,
                },
            });

            // Establece las series filtradas y la cantidad total de páginas en el estado
            setMovies(results);
            setTotalPages(total_pages);
        } catch (error) {
            console.error("Error fetching top rated series:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopRatedSeries(currentPage);
    }, [currentPage]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const moviesToShow = movies.slice(0, 5);

    useEffect(() => {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 20, // Espacio entre las tarjeta

        });
    }, []);

    return (
        <>
            <div>

                <div className="d-flex flex-column container-fluid snippet_pp fade-in">

                    <h2 className="text-center text-light snippet_tendencias_title">Mejor valoradas</h2>

                    {moviesToShow.map((movie) => {

                        return (
                            <React.Fragment key={movie.id}>
                                <BloqueTendenciasSeries
                                    key={movie.id}
                                    img={`${IMAGE_PATH}${movie.poster_path}`}
                                    title={movie.name}
                                    description={''}
                                    voteAverage={<div className="d-flex align-items-baseline"><img style={{ width: '1.5rem' }} src={estrella} /><span className="fs-3 ms-2">{Math.round(movie.vote_average * 10)} %</span></div>}
                                    selectedSerie
                                    date={<div className="d-flex align-items-center"><img style={{ width: '1.5rem' }} src={calendar} /><span className="fs-5 ms-2">{formatDate(movie.first_air_date)}</span></div>}
                                    info_multimedia={`${window.location.origin}/serie/${movie.id}/${movie.name}`}
                                     
                                />
                                <hr className="border-2 border-top border-secondary mt-4 mb-4" />
                            </React.Fragment>
                        );
                    })}
                    <div className="text-center mb-5 mt-3 ">
                        <Link to="/series_toprated"><button className='btn btn-primary botones-ver-mas fw-bold ps-3 pe-3'>VER MÁS</button></Link>
                    </div>
                </div>


            </div>


        </>
    );
};