import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import avatar from '../../assets/img/avatar.webp';
import calendar from '../../assets/img/calendar.png';
import estrella from '../../assets/img/estrella.png';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css';
import '../SnippetNovedades/bloque_novedades.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import '../Personas/personasSerieMovie.css'
import '../PeliculaSingle/peliculaSingle.css'
import './personaSingle.css'
import { Link, useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

export const PersonaSingle = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    const [selectedPerson, setSelectedPerson] = useState(null);
    const [combinedCredits, setCombinedCredits] = useState(null);


    const { store, actions } = useContext(Context);
    const { id, actor_name } = useParams();

    const fetchPersonas = async (id) => {
        const { data } = await axios.get(`${API_URL}/person/${id}?language=es-ES`, {
            params: {
                api_key: API_KEY,
                append_to_response: 'combined_credits',
            },
        });
        if (data.combined_credits && data.combined_credits.cast) {
            const personsCredits = data.combined_credits.cast;
            setCombinedCredits(personsCredits);
        }
        setSelectedPerson(data);
    };

    useEffect(() => {
        fetchPersonas(id)
        window.scrollTo(0, 0)
    }, [id])


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
            spaceBetween: 40, // Espacio entre las tarjeta

        });
    }, []);


    return (
        <>
            {selectedPerson && (
                <>
                    <div className='contenedor-multimedia container' style={{ backgroundImage: selectedPerson.profile_path ? `url(https://image.tmdb.org/t/p/w500${selectedPerson.profile_path})` : `url(${fondoNotFound})` }}>
                        <div className='contenido_multimedia p-4'>
                            <div className='row'>
                                <div className='col-sm-auto container-posther_path_person'>
                                    <img className='img-posther_path_person rounded' src={selectedPerson.profile_path ? `https://image.tmdb.org/t/p/w500${selectedPerson.profile_path}` : avatar} />

                                </div>
                                <div className='col'>
                                    <div className='d-flex justify-content-between'>

                                        <p className='text-light multimedia_single_title'>{selectedPerson.name}</p>

                                        <div className='mt-4 ms-5 d-flex align-items-start gap-3'>

                                            <WhatsappShareButton url={`${window.location.origin}/persona/${selectedPerson.id}/${selectedPerson.name}`}>
                                                <i className="fa-solid fa-square-share-nodes share-icon-person text-light"></i>
                                            </WhatsappShareButton>

                                        </div>
                                    </div>
                                    <div className='text-light fs-4'>
                                        <div className='mb-2'>
                                            {selectedPerson.birthday && selectedPerson.birthday.length > 0 ? <><span className='fw-bold'>Fecha de nacimiento:</span> {formatDate(selectedPerson.birthday)}</> : ''}
                                        </div>
                                        <div className='mb-2'>
                                            {selectedPerson.deathday && selectedPerson.deathday.length > 0 ? <><span className='fw-bold'>Fecha de fallecimiento:</span> {formatDate(selectedPerson.deathday)}</> : ''}
                                        </div>
                                        <div className='mb-2'>
                                            {selectedPerson.place_of_birth && selectedPerson.place_of_birth.length > 0 ? <><span className='fw-bold'>Lugar de nacimiento:</span> {selectedPerson.place_of_birth}</> : ''}
                                        </div>
                                        <div>
                                            <div className="accordion mt-3" id="biografia">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header">
                                                        <button className="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                            <span className='fs-5'>Biografía</span>
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#biografia">
                                                        <div className="accordion-body bg-dark text-light fs-5">
                                                            {selectedPerson.biography && selectedPerson.biography.length > 0 ? selectedPerson.biography : 'Biografía no informada'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {combinedCredits && combinedCredits.length > 0 ? (
                                <>
                                    <h2 className='pt-5 text-info subtitle-modal'>Aparece en</h2>

                                    <div className='d-flex flex-wrap gap-4 mb-5'>
                                        <div className="swiper-container">
                                            <div className="swiper-wrapper scrollableDiv">
                                                {combinedCredits.map((actor, index) => {
                                                    const releaseDate = new Date(actor.release_date);
                                                    const today = new Date();
                                                    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                                    return (
                                                        <div className='film-card-modal swiper-slide gap-5 me-5 ms-3' key={index}>
                                                            <FilmCardRecommendations
                                                                key={actor.id}
                                                                size={{ width: '13rem' }}
                                                                image={actor.poster_path}
                                                                title={actor.media_type == "movie" ? actor.title : actor.name}
                                                                overview={actor.overview}
                                                                releaseDate={actor.title && actor.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(actor.release_date)}</div> : actor.name && actor.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(actor.first_air_date)}</div> : ''}
                                                                voteAverage={isUpcoming || isNaN(actor.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard-recommend' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard-recommend' src={estrella} /> {Math.round(actor.vote_average * 10)} %</div>}
                                                                movieType={actor.media_type == "movie" ? 'Película' : 'Serie'}
                                                                classMovieType={actor.media_type == "movie" ? 'movie-type-movie-person' : 'movie-type-serie-person'}
                                                                topMovie={actor.vote_average > 7.75 && actor.vote_count > 99 ? <span className='destacada-recommend'>Destacada</span> : ''}
                                                                proxEstreno={isUpcoming}
                                                                info_multimedia={actor.title ? `${window.location.origin}/pelicula/${actor.id}/${actor.title.replace(/[ ]/gi, "-")}` : `${window.location.origin}/serie/${actor.id}/${actor.name.replace(/[ ]/gi, "-")}`}
                                                                saveButton={actor.title ?
                                                                    <button
                                                                        className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                                                                        type="button"
                                                                        onClick={store.watchlist?.some(pelicula => pelicula.id === actor.id)
                                                                            ? () => actions.deleteFavouriteMovie(actor)
                                                                            : () => actions.addFavouriteMovie(actor)}
                                                                    >
                                                                        {store.watchlist?.some(pelicula => pelicula.id === actor.id)
                                                                            ? <i class="bi bi-bookmark-fill"></i>
                                                                            : <i class="bi bi-bookmark"></i>}
                                                                    </button>
                                                                    :
                                                                    <button
                                                                        className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                                                                        type="button"
                                                                        onClick={store.watchlistSerie?.some(pelicula => pelicula.id === actor.id)
                                                                            ? () => actions.deleteFavouriteSerie(actor)
                                                                            : () => actions.addFavouriteSerie(actor)}
                                                                    >
                                                                        {store.watchlistSerie?.some(pelicula => pelicula.id === actor.id)
                                                                            ? <i class="bi bi-bookmark-fill"></i>
                                                                            : <i class="bi bi-bookmark"></i>}
                                                                    </button>
                                                                }

                                                            />
                                                        </div>
                                                    );

                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : ''}
                        </div>

                    </div>
                </>



            )

            }

        </>
    );
};
