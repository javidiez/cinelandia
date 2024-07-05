import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import { FilmCard } from '../FilmCard/FilmCard';
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css';
import '../SnippetNovedades/bloque_novedades.css';
import '../Modal/modal.css';
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import '../WatchlistSerieMovie/watchlistSerieMovie.css';
import Swiper from 'swiper';


export const WatchlistMovie = () => {

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const { store, actions } = useContext(Context);

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
            <div className="mt-4 bloque-card-mobile-watchlist fade-in">
                <div className="swiper-container-watchlist">
                    <h2 className="ms-3 title-watchlist text-light mt-5">Películas</h2>
                    <div className="swiper-wrapper-watchlist scrollableDiv-watchlist pt-5 gap-5 mb-5">
                        {store.watchlist && store.watchlist.length > 0 ? (
                            store.watchlist.map((fav, index) => {
                                const releaseDate = new Date(fav.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";
                                return (
                                    <div key={index} className='fade-in novedades mb-4'>
                                        <FilmCard
                                            key={fav.id}
                                            size={{ width: 'clamp(15rem,20vw,18rem)' }}
                                            image={fav.poster_path}
                                            title={fav.title ? fav.title : fav.name}
                                            overview={fav.overview}
                                            voteAverage={isUpcoming || isNaN(fav.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(fav.vote_average * 10)} %</div>}
                                            releaseDate={fav.title && fav.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(fav.release_date)}</div> : fav.name && fav.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(fav.first_air_date)}</div> : 'Fecha no informada'}
                                            info_multimedia={`${window.location.origin}/pelicula/${fav.id}/${fav.title.replace(/[ ]/gi, "-")}`}
                                            movieType={''}
                                            classMovieType={fav.title ? 'movie-type-movie' : 'movie-type-serie'}
                                            topMovie={fav.vote_average > 7.75 && fav.vote_count > 99 ? "Destacada" : ''}
                                            proxEstreno={isUpcoming}
                                             
                                        />
                                    </div>
                                )
                            })) :
                            <p className="text-light fs-1">Ninguna película en Watchlist, haga clic en <i className="btn btn-primary fa-regular fa-bookmark fs-1"></i> para guardar películas</p>
                        }
                    </div>
                </div>
            </div>
        </>
    )

}