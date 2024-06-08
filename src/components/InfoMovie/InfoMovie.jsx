
import { useEffect } from 'react';
import axios from 'axios'
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
import { Buscador } from '../Buscador/Buscador';
import { useState } from 'react';
import './infoMovie.css'
import estrella from '../../assets/img/estrella.png'
import lapiz from '../../assets/img/lapiz.png'
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg'


function InfoMovie() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  // variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  //const [selectedMovie, setSelectedMovie] = useState({})
  const [movie, setMovie] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el número total de páginas
  const [showNoResults, setShowNoResults] = useState(false);

  // funcion para realizar la peticion get a la api
  const fetchMovies = async (searchKey = "", page = 1) => {
    const type = searchKey ? "search" : "";
    const { data: { results, total_pages } } = await axios.get(`${API_URL}/${type}/multi?include_adult=false&language=es-ES`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
        include_adult: false,
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


  const fetchMovie = async (id, mediaType) => {
    try {
      const { data } = await axios.get(`${API_URL}/${mediaType}/${id}?language=es-ES`, {
        params: {
          api_key: API_KEY,
        },
      });

      setMovie(data);
      const modal = new bootstrap.Modal(document.getElementById(`topModal`));
      modal.show();
    } catch (error) {
      console.error("Error fetching movie/series data:", error);
    }
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id, movie.media_type);
    setMovie(movie);
  };


  // funcion para buscar peliculas
  const searchMovies = async (e) => {
    e.preventDefault();
    setMovies([]);  // Reiniciar la lista de películas antes de realizar una nueva búsqueda

    // Realizar la búsqueda de películas
    await fetchMovies(searchKey);

    // Verificar si no hay resultados después de la búsqueda
    if (movies.length === 0) {
      // Mostrar el mensaje "No se encontraron resultados"
      setShowNoResults(true);
    } else {
      // Ocultar el mensaje "No se encontraron resultados"
      setShowNoResults(false);
    }
  };

  useEffect(() => {
    fetchMovies();

    if (window.location.hash === '#search-focus') {
      const searchInput = document.querySelector('#buscador'); // Asegúrate de que el input del buscador tenga este id
      if (searchInput) {
        searchInput.focus();
      }
    }



  }, []);


  // Funciones para manejar la paginación
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      fetchMovies(searchKey, currentPage - 1);
      window.scrollTo(0, 500)
    }

  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchMovies(searchKey, currentPage + 1);
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

  return (
    <div>

      {/* el buscador */}

      <Buscador title="Todas tus películas y series favoritas" buttonText="BUSCAR" onChange={(e) => setSearchKey(e.target.value)} onSubmit={searchMovies} />

      <div>
        <main>
          {movie.title ? (
            <>
              <div className="modal fade" id="topModal" tabIndex="-1" aria-labelledby="topModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-block">
                  <div className="modal-content modal-movie" style={{
                    backgroundImage: movie.poster_path ? `url("${IMAGE_PATH}${movie.poster_path}")` : `url("${fondoNotFound}")`,
                  }}>

                    <div className="modal-header text-light border-0">
                      <h1 className="modal-title position-relative text-light" id="searchModal1">{movie.title}</h1>
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
              </div>



            </>
          ) : (

            <ModalSerie
              key={movie.id}
              idModal={`topModal`}
              postherPad={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fondoNotFound}
              noImg={fondoNotFound}
              originalName={movie.original_name}
              seasons={movie.number_of_seasons > 1 ? `${movie.number_of_seasons} temporadas` : `${movie.number_of_seasons} temporada`}
              episodes={movie.number_of_episodes > 1 ? `${movie.number_of_episodes} episodios` : `${movie.number_of_episodes} episodio`}
              mapGenre={movie.genres && movie.genres.length > 0 ? movie.genres.map((genre, index) => (
                <p className='fs-4' key={genre.id}>{genre.name}{index < movie.genres.length - 1 ? ', ' : ''}</p>
              )) : <p className='fs-4'>Genero no informado</p>}
              firstAirDate={formatDate(movie.first_air_date)}
              lastAirDate={formatDate(movie.last_air_date)}
              originalLanguage={movie.original_language}
              overview={movie.overview}
              classPuntaje={`${movie.vote_average * 10 >= 80 ? 'puntaje-verde' : movie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
              voteAverage={(movie.vote_average * 10).toFixed(2)}
              voteCount={movie.vote_count}
              mapProductionCompanies={movie.production_companies && movie.production_companies.length ? movie.production_companies.map((company, index) => (
                <span className='ps-2' key={company.id}>{company.name}{index < movie.production_companies.length - 1 ? ', ' : ''}</span>
              )) : 'No informado'}
              mapCountries={movie.production_countries && movie.production_countries.length > 0 ? movie.production_countries.map((country, index) => (
                <span key={country.iso_3166_1}>{country.name}{index < movie.production_countries.length - 1 ? ', ' : ''}</span>
              )) : 'No informado'}
              mapCreatedBy={movie.created_by && movie.created_by.length > 0
                ? movie.created_by.map((createdBy, index) => (
                  <span className='ps-2' key={createdBy.id}>
                    {createdBy.name}{index < movie.created_by.length - 1 ? ', ' : ''}
                  </span>
                ))
                : 'No informado'}
              mapNextEpisodeToAir={movie.next_episode_to_air && movie.next_episode_to_air.length > 0 ? movie.next_episode_to_air.map((nextEpisode, index) => (
                <span className='ps-2' key={nextEpisode.id}>{nextEpisode.air_date}{nextEpisode.episode_number}</span>
              )) : 'No'}
              mapSeasonsSeasonName={movie.seasons && movie.seasons.map((season, index) => (
                <tr><td><span key={season.id}>{season.name}</span></td></tr>
              ))}
              mapSeasonsSeasonDate={movie.seasons && movie.seasons.map((season, index) => (
                <tr><td><span  key={season.id}>{formatDate(season.air_date)}</span></td></tr>
              ))}
              mapSeasonsSeasonEpisodes={movie.seasons && movie.seasons.map((episodes, index) => (
                <tr> <td><span key={episodes.id}>{episodes.episode_count}</span></td></tr>
              ))}
              estrella={estrella}
              lapiz={lapiz}
            />
          )
          }
        </main>
      </div>

      {movies.length > 0 ? (
        <>

          <h2 className="hero-text text-center text-light pt-5">Resultados de la búsqueda</h2>
          <div className="text-center container">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
          </div>
        </>

      ) : showNoResults && (
        <h3 className='text-center container text-light mt-5'>No se encontraron resultados</h3>
      )}

      <div>
        {/* contenedor para mostrar los posters y las peliculas en la peticion a la api */}
        <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 novedades fs-5">
          {movies.map((movie) => {

            const releaseDate = new Date(movie.release_date);
            const today = new Date();
            const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

            return (
              <FilmCard
                key={movie.id}
                size={{ width: '18rem' }}
                image={movie.poster_path}
                title={movie.title ? movie.title : movie.name}
                overview={movie.overview}
                releaseDate={movie.title ? formatDate(movie.release_date) : formatDate(movie.first_air_date)}
                voteAverage={isUpcoming ? '' : <><span className="fw-bold">Valoración:</span> {(movie.vote_average * 10).toFixed(2)}%</>}
                onclick={() => selectMovie(movie)}
                movieType={movie.title ? 'Película' : 'Serie'}
                classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                proxEstreno={isUpcoming}
              />
            );
          })}

        </div>

      </div>

      {movies.length > 0 ? (
        <>
          <div className="text-center container mb-5">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
          </div>
          <hr className="container-fluid border-2 border-top border-secondary mt-5 mb-5 pe-5 ps-5" />
        </>

      ) : ""
      }



    </div>
  );
}

export default InfoMovie;