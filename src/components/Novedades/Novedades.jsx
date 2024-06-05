
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'
import { FilmCard } from '../FilmCard/FilmCard';
import { Modal } from '../Modal/Modal';
import estrella from '../../assets/img/estrella.png'
import lapiz from '../../assets/img/lapiz.png'
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg'
import './novedades.css';
import '../FilmCard/filmcard.css'

export const Novedades = () => {

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";


    // variables de estado
    const [movies, setMovies] = useState([]);
    const [movie, setMovie] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el número total de páginas
    const [showNoResults, setShowNoResults] = useState(false);


    const fetchNowPlaying = async (page) => {

        const { data: { results, total_pages } } = await axios.get('https://api.themoviedb.org/3/movie/now_playing?language=es-ES&', {
            params: {
                api_key: API_KEY,
                page: page,
            },
        });
        //console.log('data',results);
        //setSelectedMovie(results[0])

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(results);
        setMovie(results[0]);

    };

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}?language=es-ES`, {
            params: {
                api_key: API_KEY,
            },
        });
        //return data
        setMovie(data);
    };

    const selectMovie = async (movie) => {
        const movieData = await fetchMovie(movie.id);
        if (movieData) {
            setMovie(movieData);
        }
    };
    

    useEffect(() => {
        fetchNowPlaying(currentPage);
    }, [currentPage]);



    // Funciones para manejar la paginación
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            fetchNowPlaying(currentPage - 1);
            window.scrollTo(0, 500)
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchNowPlaying(currentPage + 1);
            window.scrollTo(0, 500)
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const releaseDate = new Date(movie.release_date);
    const today = new Date();
    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";



    return (
        <>


            <div>
                <main>
                    {movie ? (
                        <>
                            {/* <div className="modal fade" id="modalNovedad" tabIndex="-1" aria-labelledby="modalNovedad" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-block">
                                    <div className="modal-content modal-movie" style={{
                                        backgroundImage: movie.poster_path ? `url("${IMAGE_PATH}${movie.poster_path}")` : `url("${fondoNotFound}")`,
                                    }}>
                                        <div className="modal-header text-light border-0">
                                            <h1 className="modal-title position-relative text-light" id="modalNovedad">{movie.title}</h1>
                                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body pt-0 text-light position-relative">
                                            <div className='d-flex gap-2 data-extra flex-wrap align-items-center'>
                                                <p className='fs-4 d-flex align-items-center'>{movie.runtime} minutos <span className='fw-bold fs-1 ps-2'>·</span></p>
                                                {movie && movie.genres && movie.genres.map((genre, index) => (
                                                    <p className='fs-4' key={genre.id}>{genre.name}{index < movie.genres.length - 1 ? ', ' : ''}</p>
                                                ))}
                                                <p className='fs-4 d-flex align-items-center'><span className='fw-bold fs-1 pe-2'>·</span> {formatDate(movie.release_date)}</p>
                                                <p className='fs-4 text-uppercase d-flex align-items-center'><span className='fw-bold fs-1 pe-2'>·</span> {movie.original_language}</p>
                                            </div>
                                            <div className='d-flex gap-4 pt-3 flex-wrap'>
                                                <div>
                                                    <img src={`${IMAGE_PATH}${movie.poster_path}`} className='imagen-modal' onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = fondoNotFound
                                                    }} />
                                                </div>
                                                <div className='bloque-derecho-modal'>
                                                    <p className='fs-4 texto-modal pb-1'>{movie.overview}</p>
                                                    <p className='fs-4 pt-4 d-flex align-items-baseline gap-2'><img className='icono-modal' src={estrella} /><span className='fw-bold'>Puntuación de usuarios:</span><span className={`${movie.vote_average * 10 >= 80 ? 'puntaje-verde' : movie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}> {(movie.vote_average * 10).toFixed(2)}%</span>
                                                    </p>
                                                    <p className='fs-4 pt-1 d-flex align-items-baseline gap-2'><img className='icono-modal' src={lapiz} /><span className='fw-bold'>Valoraciones:</span> {movie.vote_count}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className='pt-4 text-primary subtitle-modal'>Más información</h2>

                                                <p className='fs-4 '><span className='fw-bold'>Productora: </span>
                                                    {movie && movie.production_companies && movie.production_companies.map((companies, index) => (
                                                        <span className='ps-2' key={companies.id}>{companies.name}{index < movie.production_companies.length - 1 ? ', ' : ''}</span>
                                                    ))}</p>
                                                <p className='fs-4'>
                                                    <span className='fw-bold pe-2'>País:
                                                    </span>
                                                    {movie && movie.production_countries && movie.production_countries.map((countries, index) => (
                                                        <span>{countries.name}{index < movie.production_countries.length - 1 ? ', ' : ''}</span>))}
                                                </p>
                                                <p className='fs-4'><span className='fw-bold'>Presupuesto: </span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(movie.budget)}</p>
                                                <p className='fs-4'><span className='fw-bold'>Recaudación: </span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(movie.revenue)}</p>


                                            </div>

                                        </div>
                                        <div className="modal-footer position-relative border-0">
                                            <button type="button" className="btn btn-secondary fw-bold" data-bs-dismiss="modal">CERRAR</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <Modal
                                key={movie.id}
                                idModal={`modalNovedad-${movie.id}`} 
                                postherPad={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fondoNotFound}
                                noImg={fondoNotFound}
                                title={movie.title}
                                runTime={movie.runtime}
                                mapGenre={movie.genres && movie.genres.map((genre, index) => (
                                    <p className='fs-4' key={genre.id}>{genre.name}{index < movie.genres.length - 1 ? ', ' : ''}</p>
                                ))}
                                releaseDate={formatDate(movie.release_date)}
                                originalLanguage={movie.original_language}
                                overview={movie.overview}
                                classPuntaje={`${movie.vote_average * 10 >= 80 ? 'puntaje-verde' : movie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                                voteAverage={(movie.vote_average * 10).toFixed(2)}
                                voteCount={movie.vote_count}
                                mapProductionCompanies={movie.production_companies && movie.production_companies.map((company, index) => (
                                    <span className='ps-2' key={company.id}>{company.name}{index < movie.production_companies.length - 1 ? ', ' : ''}</span>
                                ))}
                                mapCountries={movie.production_countries && movie.production_countries.map((country, index) => (
                                    <span key={country.iso_3166_1}>{country.name}{index < movie.production_countries.length - 1 ? ', ' : ''}</span>
                                ))}
                                budget={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(movie.budget)}
                                revenue={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(movie.revenue)}
                                estrella={estrella}
                                lapiz={lapiz}
                            />





                        </>
                    ) : null}
                </main>
            </div>




            <h2 className="text-center text-light novedades-title">Novedades</h2>

            <div>
                {/* contenedor para mostrar los posters y las peliculas en la peticion a la api */}
                <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 mb-3 novedades fs-5">

                    {movies.map((movie) => {

                        const releaseDate = new Date(movie.release_date);
                        const today = new Date();
                        const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

                        return (
                            <FilmCard
                                key={movie.id}
                                image={movie.poster_path}
                                title={movie.title}
                                overview={movie.overview}
                                releaseDate={formatDate(movie.release_date)}
                                vote_average={(movie.vote_average * 10).toFixed(2)}
                                onclick={() => selectMovie(movie)}
                                dataBstoggle="modal"
                                dataBsTarget={`#modalNovedad-${movie.id}`} // Aquí utiliza el ID correcto
                                topMovie={movie.vote_average > 7.75 && movie.vote_count > 49 ? "Top movie" : ''}
                                proxEstreno={isUpcoming}
                            />
                        );
                    })}

                </div>

            </div>
            <div className="text-center container pb-5">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>
        </>
    )
}



