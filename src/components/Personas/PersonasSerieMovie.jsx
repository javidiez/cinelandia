import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilmCardRecommendations } from '../FilmCardRecommendations/FilmCardRecommendations';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import avatar from '../../assets/img/avatar.webp';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css';
import '../SnippetNovedades/bloque_novedades.css'
import { Tooltip } from "flowbite-react";
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import { ModalPersonas } from '../ModalPersonas/ModalPersonas';
import { CardPersonas } from '../CardPersonas/CardPersonas';
import './personasSerieMovie.css'

export const PersonasSerieMovie = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [combinedCredits, setCombinedCredits] = useState(null);

    const fetchPersonasSerieMovie = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/person/popular`, {
            params: {
                api_key: API_KEY,
                page: page,
            },
        });

        setCurrentPage(page);
        setTotalPages(total_pages);
        setPersons(results);
    };

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
        const modal = new bootstrap.Modal(document.getElementById(`modalPersona-${id}`));
        modal.show();
    };

    const selectPersona = async (persona) => {
        await fetchPersonas(persona.id);
    };

    useEffect(() => {
        fetchPersonasSerieMovie(currentPage);
    }, [currentPage]);


    useEffect(() => {
        if (selectedPerson) {
            const modal = new bootstrap.Modal(document.getElementById(`modalPersona-${selectedPerson.id}`));
            modal.show();
        }
    }, [selectedPerson]);


    const goToPreviousPage = () => {
        if (currentPage > 1) {
            fetchPersonasSerieMovie(currentPage - 1);
            window.scrollTo(0, 130);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchPersonasSerieMovie(currentPage + 1);

            // Seleccionar el contenedor que contiene los elementos desplazables
            const swiper = document.querySelector('.swiper-wrapper-paginas');

            // Realizar scroll hacia la izquierda
            if (swiper) {
                swiper.scrollTo({
                    top: 130,
                    left: 0, // Hacer scroll al inicio del contenedor
                    behavior: 'smooth', // Opcional: hacerlo con animación smooth
                });
            }

            if (currentPage > 0) {
                fetchPersonasSerieMovie(currentPage + 1);
                window.scrollTo(0, 130);
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

    const handleCloseModal = () => {
        setSelectedPerson(null); // Cierra el modal
    };

    useEffect(() => {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
            spaceBetween: 40, // Espacio entre las tarjeta

        });
    }, []);


    return (
        <>
            <main>
                {selectedPerson && (
                    <ModalPersonas
                        key={selectedPerson.id}
                        idModal={`modalPersona-${selectedPerson.id}`}
                        profilePad={selectedPerson.profile_path ? `https://image.tmdb.org/t/p/w500${selectedPerson.profile_path}` : fondoNotFound}
                        noImg={fondoNotFound}
                        name={selectedPerson.name}
                        birthday={selectedPerson.birthday && selectedPerson.birthday.length > 0 ? <><span className='fw-bold'>Fecha de nacimiento:</span> {formatDate(selectedPerson.birthday)}</> : ''}
                        deathday={selectedPerson.deathday && selectedPerson.deathday.length > 0 ? <><span className='fw-bold'>Fecha de fallecimiento:</span> {formatDate(selectedPerson.deathday)}</> : ''}
                        place_of_birth={selectedPerson.place_of_birth && selectedPerson.place_of_birth.length > 0 ? <><span className='fw-bold'>Lugar de nacimiento:</span> {selectedPerson.place_of_birth}</> : ''}
                        biography={selectedPerson.biography && selectedPerson.biography.length > 0 ? selectedPerson.biography : 'Biografía no informada'}
                        onClose={handleCloseModal}
                        moviesSeriesActing={combinedCredits && combinedCredits.length > 0 ? (
                            <>
                                <h2 className='pt-5 text-info subtitle-modal'>Lo podés encontrar en</h2>

                                <div className='d-flex flex-wrap gap-4'>
                                    <div className="swiper-container">
                                        <div className="swiper-wrapper scrollableDiv">
                                            {combinedCredits.map((actor) => {
                                                const releaseDate = new Date(actor.release_date);
                                                const today = new Date();
                                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                                return (
                                                    <div className='film-card-modal swiper-slide gap-5'>
                                                        <FilmCardRecommendations
                                                            key={actor.id}
                                                            size={{ width: '9rem' }}
                                                            image={actor.poster_path}
                                                            title={actor.media_type == "movie" ? actor.original_title : actor.name}
                                                            overview={actor.overview}
                                                            releaseDate={actor.media_type == "movie" ? <><span className='fw-bold'>Fecha</span> {formatDate(actor.release_date)}</> : <><span className='fw-bold'>Fecha</span> {formatDate(actor.first_air_date)}</>}
                                                            voteAverage={''}
                                                            movieType={actor.media_type == "movie" ? 'Película' : 'Serie'}
                                                            classMovieType={actor.media_type == "movie" ? 'movie-type-movie-person' : 'movie-type-serie-person'}
                                                            topMovie={''}
                                                            proxEstreno={isUpcoming}

                                                        />
                                                    </div>
                                                );

                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : ''}
                    />
                )}
            </main>

            <h2 className="text-center text-light novedades-title">Personas</h2>

            <div className="text-center container mt-5">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Siguiente</button>
            </div>

            <div>

                <div className="novedades bloque-card-mobile fade-in">
                    <div className="swiper-container-paginas person-block-mobile">
                        <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex gap-5">
                            {persons.map((actor) => {

                                return (
                                    <div className='film-card-modal swiper-slide m-4'>
                                        <CardPersonas
                                            castImg={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                            castName={actor.name}
                                            noImg={avatar}
                                            castCharacter={''}
                                            verMas={() => selectPersona(actor)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>


                <div className="container-fluid gap-3 mx-auto mt-5 mb-3 bloque-cards-desktop-person person-block">
                    {persons.map((actor) => {
                        return (
                            <div className='film-card-modal mb-4'>
                                <CardPersonas
                                    castImg={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                    castName={actor.name}
                                    noImg={avatar}
                                    castCharacter={''}
                                    verMas={() => selectPersona(actor)}
                                />
                            </div>
                        );


                    })}
                </div>


            </div>
            <div className="text-center container pb-5">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Siguiente</button>
            </div>
        </>
    );
};
