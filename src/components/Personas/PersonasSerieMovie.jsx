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
import { Link } from 'react-router-dom';

export const PersonasSerieMovie = () => {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    const [persons, setPersons] = useState([]);
    const [personsSearch, setPersonsSearch] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSearch, setCurrentPageSearch] = useState(1);
    const [totalPagesSearch, setTotalPagesSearch] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [combinedCredits, setCombinedCredits] = useState(null);
    const [searchKey, setSearchKey] = useState("");
    const [showNoResults, setShowNoResults] = useState(false);

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

    const BuscadorPersonasSerieMovie = async (searchKey, page = 1) => {
        const type = searchKey ? "search" : "";
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/${type}/person`, {
            params: {
                api_key: API_KEY,
                query: searchKey,
                page: page,
            },
        });

        setCurrentPageSearch(page);
        setTotalPagesSearch(total_pages);
        setPersonsSearch(results);
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

    const searchPersons = async (e) => {
        e.preventDefault();
        setPersonsSearch([]);
        await BuscadorPersonasSerieMovie(searchKey, 1); // Iniciar en la página 1

        if (personsSearch.length === 0) {
            setShowNoResults(true);
        } else {
            setShowNoResults(false);
        }
    };



    const goToPreviousPageSearch = () => {
        if (currentPageSearch > 1) {
            BuscadorPersonasSerieMovie(searchKey, currentPageSearch - 1);
            window.scrollTo(0, 130);
        }
    };

    const goToNextPageSearch = () => {
        if (currentPageSearch < totalPagesSearch) {
            BuscadorPersonasSerieMovie(searchKey, currentPageSearch + 1);
            window.scrollTo(0, 330);

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
        }
    };


    const goToPreviousPage = () => {
        if (currentPage > 1) {
            fetchPersonasSerieMovie(currentPage - 1);
            window.scrollTo(0, 130);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchPersonasSerieMovie(currentPage + 1);
            window.scrollTo(0, 130);

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
                        profilePad={selectedPerson.profile_path ? `https://image.tmdb.org/t/p/w500${selectedPerson.profile_path}` : avatar}
                        noImg={fondoNotFound}
                        name={selectedPerson.name}
                        birthday={selectedPerson.birthday && selectedPerson.birthday.length > 0 ? <><span className='fw-bold'>Fecha de nacimiento:</span> {formatDate(selectedPerson.birthday)}</> : ''}
                        deathday={selectedPerson.deathday && selectedPerson.deathday.length > 0 ? <><span className='fw-bold'>Fecha de fallecimiento:</span> {formatDate(selectedPerson.deathday)}</> : ''}
                        place_of_birth={selectedPerson.place_of_birth && selectedPerson.place_of_birth.length > 0 ? <><span className='fw-bold'>Lugar de nacimiento:</span> {selectedPerson.place_of_birth}</> : ''}
                        biography={selectedPerson.biography && selectedPerson.biography.length > 0 ? selectedPerson.biography : 'Biografía no informada'}
                        onClose={handleCloseModal}
                        moviesSeriesActing={combinedCredits && combinedCredits.length > 0 ? (
                            <>
                                <h2 className='pt-5 text-info subtitle-modal'>Actúa en</h2>

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
                                                            topMovie={actor.vote_average > 7.75 && actor.vote_count > 99 ? <span className='destacada-recommend'>Destacada</span> : ''}
                                                            proxEstreno={isUpcoming}
                                                            info_multimedia={`${window.location.origin}/pelicula/${actor.id}`}
                                                            verMas={() => window.scrollTo(0, 0)}

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

            <a href="/personas" className='text-decoration-none'><h2 className="text-center text-light novedades-title">Personas</h2></a>

            <form className="d-flex container align-items-center flex-column input-group-lg buscador_central-person mt-5" role="search" onSubmit={searchPersons}>
                <input className="form-control" type="search" placeholder="Personas..." aria-label="Search" id="buscador-person" onChange={(e) => setSearchKey(e.target.value)} />
                <button className="btn btn-primary fw-bold buscar-person" type="submit">BUSCAR</button>
            </form>

            <div className='bloque-resultados'>
                {personsSearch.length > 0 ? (
                    <>

                        <h2 className="fs-1 text-center text-light mt-5">Resultados de la búsqueda</h2>
                        <div className="text-center container mt-4">
                            <button onClick={goToPreviousPageSearch} disabled={currentPageSearch === 1} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Anterior</button>
                            <button onClick={goToNextPageSearch} disabled={currentPageSearch === totalPagesSearch} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Siguiente</button>
                        </div>
                    </>

                ) : showNoResults && (
                    <>
                        <h3 className='text-center container text-light mt-5 fs-1'>No se encontraron resultados</h3>
                        <hr className="border-2 border-top border-secondary mt-5" />
                    </>


                )}

                <div className="mt-4 bloque-card-mobile fade-in">
                    <div className="swiper-container-paginas">
                        <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex">
                            {personsSearch.map((actor) => {
                                const releaseDate = new Date(actor.release_date);
                                const today = new Date();
                                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                                return (
                                    <div className='swiper-slide-paginas ps-4 pt-3 fade-in'>
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
                    {personsSearch.map((actor) => {

                        const releaseDate = new Date(actor.release_date);
                        const today = new Date();
                        const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

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



                {personsSearch.length > 0 ? (
                    <>
                        <div className="text-center container mb-5">
                            <button onClick={goToPreviousPageSearch} disabled={currentPageSearch === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                            <button onClick={goToNextPageSearch} disabled={currentPageSearch === totalPagesSearch} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
                        </div>
                        <hr className="container-fluid border-2 border-top border-secondary pe-5 ps-5 mb-5" />
                    </>

                ) : ""
                }
            </div>

            <div className="text-center container">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion-persons ps-3 pe-3'>Siguiente</button>
            </div>

            <div>

                <div className="bloque-card-mobile fade-in">
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
