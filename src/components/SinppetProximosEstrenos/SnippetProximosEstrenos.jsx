import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BloqueProximosEstrenos } from "./BloqueProximosEstrenos";
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import './snippet_pp.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { Link } from "react-router-dom";

export const SnippetProximosEstrenos = () => {

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie?include_adult=false`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity.desc',
                'primary_release_date.gte': formattedTomorrow,
                page: page,
            },
        });

        const filteredResults = results.filter(movie => {
            return !['tl', 'ja', 'ko', 'th', 'ar'].includes(movie.original_language);
        });

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(filteredResults);
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

                    <h2 className="text-center text-light snippet_pp_title">Próximos estrenos</h2>


                    {moviesToShow.map((movie) => {



                        return (
                            <React.Fragment key={movie.id}>
                                <BloqueProximosEstrenos
                                    key={movie.id}
                                    img={`${IMAGE_PATH}${movie.poster_path}`}
                                    title={movie.title}
                                    description={''}
                                    date={<div className="d-flex align-items-center"><img style={{ width:'1.5rem' }} src={calendar}/><span className="fs-4 ms-2">{formatDate(movie.release_date)}</span></div>}
                                    info_multimedia={`${window.location.origin}/pelicula/${movie.id}/${movie.title}`}
                                     
                                />
                                <hr className="border-2 border-top border-secondary mt-4 mb-4" />
                            </React.Fragment>
                        );
                    })}
                    <div className="text-center mb-5 mt-3 ">
                        <Link to="/peliculas_estrenos"><button className='btn btn-primary botones-ver-mas fw-bold ps-3 pe-3'>MÁS ESTRENOS</button></Link>
                    </div>
                </div>


            </div>


        </>
    );
};