import { Context } from "../../store/appContext";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../SwitchPeliSerie/SwitchPeliSerie.css'
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import '../WatchlistSerieMovie/watchlistSerieMovie.css';
import Swiper from 'swiper';

export const WatchlistSerie = () => {

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);

    const { store, actions } = useContext(Context);
    const [selectedGenreSerie, setSelectedGenreSerie] = useState('');
    const [genres, setGenres] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);

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
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjFhZTY4YTkwMDljZjI5YWIyNWUwNzNkNzJjYTc2ZCIsIm5iZiI6MTcyMDY4NDUyNS42MDg4MTgsInN1YiI6IjY2NTFmNGM0NDUwOTg2YjE3ZjE3MGI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jw8RayQMSSz19qT6jjCgOPRYnuIgAGQfeZMhYref8gE'
            }
          };
          
    
        // Fetch genres from API
        fetch('https://api.themoviedb.org/3/genre/tv/list?language=es', options)
            .then(response => response.json())
            .then(data => setGenres(data.genres))
            .catch(error => console.error('Error fetching genres:', error));
    }, []);

useEffect(() => {
    if (selectedGenreSerie) {
        setFilteredSeries(store.watchlistSerie.filter(movie => Array.isArray(movie.genre_ids) && movie.genre_ids.includes(parseInt(selectedGenreSerie))));
    } else {
        setFilteredSeries(store.watchlistSerie);
    }
}, [selectedGenreSerie, store.watchlistSerie]);

const handleGenreChangeSerie = (event) => {
    setSelectedGenreSerie(event.target.value);
};

    return (
        <>
            <div className="mt-4 bloque-card-mobile-watchlist fade-in ">
                <div className="swiper-container-watchlist">
                    <h2 className="ms-3 title-watchlist text-light">Series</h2>

                    {/* <p className=' ms-3 mb-3 text-light fs-4 mt-4'>Filtro por Géneros</p>
                    <select className='form-select select-genre-watchlist ms-3' id="genreSerie" value={selectedGenreSerie} onChange={handleGenreChangeSerie}>
                        <option value=''>Todos</option>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id} className='fs-4'>{genre.name}</option>
                        ))}
                    </select> */}

                    <div className="swiper-wrapper-watchlist scrollableDiv-watchlist gap-5 pt-5 mb-5">
                        {filteredSeries && filteredSeries.length > 0 ? (
                            filteredSeries.map((fav, index) => {
                                const releaseDate = new Date(fav.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";
                                return (
                                    <div key={index} className='fade-in novedades mb-4'>
                                        <FilmCard
                                            key={fav.id}
                                            size={{ width: 'clamp(15rem,20vw,16rem)' }}
                                            image={fav.poster_path}
                                            title={fav.title ? fav.title : fav.name}
                                            overview={fav.overview}
                                            voteAverage={isUpcoming || isNaN(fav.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(fav.vote_average * 10)} %</div>}
                                            releaseDate={fav.title && fav.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(fav.release_date)}</div> : fav.name && fav.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(fav.first_air_date)}</div> : 'Fecha no informada'}
                                            info_multimedia={`${window.location.origin}/serie/${fav.id}/${fav.name ? fav.name.replace(/[ ]/gi, "-") : ''}`}
                                            movieType={''}
                                            classMovieType={fav.title ? 'movie-type-movie' : 'movie-type-serie'}
                                            topMovie={fav.vote_average > 7.75 && fav.vote_count > 99 ? "Destacada" : ''}
                                            proxEstreno={isUpcoming}
                                            saveButton={
                                                <button
                                                    className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                                                    type="button"
                                                    onClick={store.watchlistSerie?.some(pelicula => pelicula.id === fav.id)
                                                        ? () => actions.deleteFavouriteSerie(fav)
                                                        : () => actions.addFavouriteSerie(fav)}
                                                >
                                                    {store.watchlistSerie?.some(pelicula => pelicula.id === fav.id)
                                                        ? <i className="fa-solid fa-bookmark"></i>
                                                        : <i className="fa-regular fa-bookmark"></i>}
                                                </button>
                                            }
                                            
                                        />
                                    </div>
                                )
                            })) :
                            <p className="text-light fs-1">Ninguna serie en Watchlist, haga clic en <span className="btn btn-primary fa-regular fa-bookmark fs-1"></span> para guardar series</p>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};
