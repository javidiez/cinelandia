
import { useEffect } from 'react';
import axios from 'axios'
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
import { Modal } from '../Modal/Modal';
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
  const [selectedMovie, setMovie] = useState("");

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
      const modal = new bootstrap.Modal(document.getElementById(`topModal-${id}`));
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
          {selectedMovie.title ? (
                  <Modal
                  key={selectedMovie.id}
                  idModal={`topModal-${selectedMovie.id}`}
                  postherPad={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : fondoNotFound}
                  noImg={fondoNotFound}
                  title={selectedMovie.title}
                  runTime={selectedMovie.runtime}
                  mapGenre={selectedMovie.genres && selectedMovie.genres.length > 0 ? selectedMovie.genres.map((genre, index) => (
                    <p className='fs-4' key={genre.id}>{genre.name}{index < selectedMovie.genres.length - 1 ? ', ' : ''}</p>
                  )) : <p className='fs-4'>Género no informado</p>}
                  releaseDate={selectedMovie.release_date ? formatDate(selectedMovie.release_date) : 'Fecha no informada'}
                  originalLanguage={selectedMovie.original_language}
                  overview={selectedMovie.overview}
                  classPuntaje={`${selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                  voteAverage={(selectedMovie.vote_average * 10).toFixed(2)}
                  voteCount={selectedMovie.vote_count}
                  mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.length > 0 ? selectedMovie.production_companies.map((company, index) => (
                      <span className='ps-2' key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                  )) : 'No informado'}
                  mapCountries={selectedMovie.production_countries && selectedMovie.production_countries.length > 0 ? selectedMovie.production_countries.map((country, index) => (
                      <span key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
                  )) : 'No informado'}
                  budget={selectedMovie.budget > 0 ? <><span className='fw-bold'>Presupuesto:</span> {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.budget)}</> : <><span className='fw-bold'>Presupuesto: </span>No informado</>}
                  revenue={selectedMovie.revenue > 0 ? <><span className='fw-bold'>Recaudación:</span> {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(selectedMovie.revenue)}</> : <><span className='fw-bold'>Recaudación: </span>No informado</>}
                  estrella={estrella}
                  lapiz={lapiz}
              />
          ) : (

            <ModalSerie
              key={selectedMovie.id}
              idModal={`topModal-${selectedMovie.id}`}
              postherPad={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : fondoNotFound}
              noImg={fondoNotFound}
              originalName={selectedMovie.name}
              seasons={selectedMovie.number_of_seasons > 1 ? `${selectedMovie.number_of_seasons} temporadas` : `${selectedMovie.number_of_seasons} temporada`}
              episodes={selectedMovie.number_of_episodes > 1 ? `${selectedMovie.number_of_episodes} episodios` : `${selectedMovie.number_of_episodes} episodio`}
              mapGenre={selectedMovie.genres && selectedMovie.genres.length > 0 ? selectedMovie.genres.map((genre, index) => (
                <p className='fs-4' key={genre.id}>{genre.name}{index < selectedMovie.genres.length - 1 ? ', ' : ''}</p>
              )) : <p className='fs-4'>Género no informado</p>}
              firstAirDate={formatDate(selectedMovie.first_air_date)}
              lastAirDate={formatDate(selectedMovie.last_air_date)}
              originalLanguage={selectedMovie.original_language}
              overview={selectedMovie.overview}
              classPuntaje={`${selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
              voteAverage={(selectedMovie.vote_average * 10).toFixed(2)}
              voteCount={selectedMovie.vote_count}
              mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.length > 0 ? selectedMovie.production_companies.map((company, index) => (
                <span className='ps-2' key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
              )) : 'No informado'}
              mapCountries={selectedMovie.production_countries && selectedMovie.production_countries.length > 0 ? selectedMovie.production_countries.map((country, index) => (
                <span key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
              )) : 'No informado'}
              mapCreatedBy={selectedMovie.created_by && selectedMovie.created_by.length > 0
                ? selectedMovie.created_by.map((createdBy, index) => (
                  <span className='ps-2' key={createdBy.id}>
                    {createdBy.name}{index < selectedMovie.created_by.length - 1 ? ', ' : ''}
                  </span>
                ))
                : 'No informado'}
              mapNextEpisodeToAir={selectedMovie.next_episode_to_air && selectedMovie.next_episode_to_air.length > 0 ? selectedMovie.next_episode_to_air.map((nextEpisode, index) => (
                <span className='ps-2' key={nextEpisode.id}>{nextEpisode.air_date}{nextEpisode.episode_number}</span>
              )) : 'No'}
              mapSeasonsSeasonName={selectedMovie.seasons && selectedMovie.seasons.map((season, index) => (
                <span key={season.id}>{season.name}</span>
              ))}
              mapSeasonsSeasonDate={selectedMovie.seasons && selectedMovie.seasons.map((season, index) => (
               <span key={season.id}>{formatDate(season.air_date)}</span>
              ))}
              mapSeasonsSeasonEpisodes={selectedMovie.seasons && selectedMovie.seasons.map((episodes, index) => (
               <span key={episodes.id}>{episodes.episode_count}</span>
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
                releaseDate={movie.title && movie.release_date ? formatDate(movie.release_date) : movie.name ? formatDate(movie.first_air_date) : 'no informada'}
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