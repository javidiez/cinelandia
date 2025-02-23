import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'
import { FilmCard } from '../FilmCard/FilmCard';
import './infoMovie.css'
import estrella from '../../assets/img/estrella.png';
import calendar from '../../assets/img/calendar.png';
import '../SnippetNovedades/bloque_novedades.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import Swiper from 'swiper';
import '../Buscador/buscador.css'
import '../Novedades/novedades.css';
import '../WatchlistSerieMovie/watchlistSerieMovie.css';
import { Context } from '../../store/appContext';

function InfoMovie() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  // variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedMovie, setMovie] = useState({}); // Inicializar como objeto vacío
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNoResults, setShowNoResults] = useState(false);

  const { store, actions } = useContext(Context);

  const fetchMovies = async (searchKey = "", page = 1) => {
    const type = searchKey ? "search" : "";
    const { data: { results, total_pages } } = await axios.get(`${API_URL}/${type}/multi?include_adult=false&language=es-ES`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
        page: page,
      },
    });

    setCurrentPage(page);
    setTotalPages(total_pages);
    setMovies(results);
    setMovie(results[0] || {}); // Manejar si no hay resultados
  };


  const searchMovies = async (e) => {
    e.preventDefault();
    setMovies([]);
    await fetchMovies(searchKey);

    if (movies.length === 0) {
      setShowNoResults(true);
    } else {
      setShowNoResults(false);
    }
  };

  useEffect(() => {
    fetchMovies();

    if (window.location.hash === '#search-focus') {
      const searchInput = document.querySelector('#buscador');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, []);

  const goToPreviousPage = () => {
    if (currentPage <= totalPages) {
      fetchMovies(searchKey, currentPage - 1);
      window.scrollTo(0, 500);

      // Seleccionar el contenedor que contiene los elementos desplazables
      const swiper = document.querySelector('.swiper-wrapper-paginas');
      const container = document.querySelector('.bloque-cards-desktop');

      // Realizar scroll hacia la izquierda
      if (swiper) {
        swiper.scrollTo({
          top: 400,
          left: 0, // Hacer scroll al inicio del contenedor
          behavior: 'smooth', // Opcional: hacerlo con animación smooth
        });
      }


    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchMovies(searchKey, currentPage + 1);
      window.scrollTo(0, 430);

      // Seleccionar el contenedor que contiene los elementos desplazables
      const swiper = document.querySelector('.swiper-wrapper-paginas');
      const container = document.querySelector('.bloque-cards-desktop');

      // Realizar scroll hacia la izquierda
      if (swiper) {
        swiper.scrollTo({
          top: 400,
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

  useEffect(() => {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto', // Mostrará tantos slides como quepan en el contenedor
      spaceBetween: 20, // Espacio entre las tarjeta

    });
  }, []);


  return (
    <div className='d-flex justify-content-center flex-column align-items-center'>

      <form className="d-flex align-items-center flex-column input-group-lg buscador_central" role="search" onSubmit={searchMovies}>
        <input className="form-control" type="search" placeholder="Película o serie..." aria-label="Search" id="buscador" onChange={(e) => setSearchKey(e.target.value)} />
        <button className="btn btn-primary fw-bold buscar" type="submit">BUSCAR</button>
      </form>

      <div className='bloque-resultados'>
        {movies.length > 0 ? (
          <>

            <h2 className="hero-text text-center text-light pt-5">Resultados de la búsqueda</h2>
            <div className="text-center container">
              <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>
          </>

        ) : showNoResults && (
          <>
            <h3 className='text-center container text-light mt-5 fs-1'>No se encontraron resultados</h3>
            <hr className="border-2 border-top border-secondary mt-5" />
          </>


        )}

        <div className="mt-4 novedades bloque-card-mobile fade-in">
          <div className="swiper-container-paginas">
            <div className="swiper-wrapper-paginas scrollableDiv-paginas d-flex">
              {movies.map((movie) => {
                const releaseDate = new Date(movie.release_date);
                const today = new Date();
                const isUpcoming = releaseDate > today ? "Próximo estreno" : "";


                return (
                  <div className='swiper-slide-paginas ps-4 pt-3 fade-in' key={movie.id}>
                    <FilmCard
                      key={movie.id}
                      size={{ width: 'clamp(15rem,20vw,18rem)' }}
                      image={movie.poster_path}
                      title={movie.title ? movie.title : movie.name}
                      overview={movie.overview}
                      voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                      releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                      info_multimedia={movie.title ? `${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}}` : `${window.location.origin}/serie/${movie.id}/${movie.name.replace(/[ ]/gi, "-")}`}
                      movieType={movie.title ? 'Película' : 'Serie'}
                      classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                      topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                      proxEstreno={isUpcoming}
                      saveButton={movie.title ?
                        <button
                          className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                          type="button"
                          onClick={store.watchlist?.some(pelicula => pelicula.id === movie.id)
                            ? () => actions.deleteFavouriteMovie(movie)
                            : () => actions.addFavouriteMovie(movie)}
                        >
                          {store.watchlist?.some(pelicula => pelicula.id === movie.id)
                            ? <i class="bi bi-bookmark-fill"></i>
                            : <i class="bi bi-bookmark"></i>}
                        </button>
                        :
                        <button
                          className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                          type="button"
                          onClick={store.watchlistSerie?.some(pelicula => pelicula.id === movie.id)
                            ? () => actions.deleteFavouriteSerie(movie)
                            : () => actions.addFavouriteSerie(movie)}
                        >
                          {store.watchlistSerie?.some(pelicula => pelicula.id === movie.id)
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

        <div className="row justify-content-center mx-auto gap-5 mt-5 novedades fs-5 bloque-cards-desktop">
          {movies.map((movie) => {

            const releaseDate = new Date(movie.release_date);
            const today = new Date();
            const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

            return (
              <React.Fragment key={movie.id}>
                <FilmCard
                  key={movie.id}
                  size={{ width: 'clamp(16rem,20vw,18rem)' }}
                  image={movie.poster_path}
                  title={movie.title ? movie.title : movie.name}
                  overview={movie.overview}
                  voteAverage={isUpcoming || isNaN(movie.vote_average) ? <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> 0 %</div> : <div className='d-flex align-items-baseline gap-2'><img className='icon-filmcard' src={estrella} /> {Math.round(movie.vote_average * 10)} %</div>}
                  releaseDate={movie.title && movie.release_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />  {formatDate(movie.release_date)}</div> : movie.name && movie.first_air_date ? <div className='d-flex align-items-center gap-2'><img className='icon-filmcard' src={calendar} />{formatDate(movie.first_air_date)}</div> : 'Fecha no informada'}
                  info_multimedia={movie.title ? `${window.location.origin}/pelicula/${movie.id}/${movie.title.replace(/[ ]/gi, "-")}` : `${window.location.origin}/serie/${movie.id}/${movie.name.replace(/[ ]/gi, "-")}`}
                  movieType={movie.title ? 'Película' : 'Serie'}
                  classMovieType={movie.title ? 'movie-type-movie' : 'movie-type-serie'}
                  topMovie={movie.vote_average > 7.75 && movie.vote_count > 99 ? "Destacada" : ''}
                  proxEstreno={isUpcoming}
                  saveButton={movie.title ?
                    <button
                      className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                      type="button"
                      onClick={store.watchlist?.some(pelicula => pelicula.id === movie.id)
                        ? () => actions.deleteFavouriteMovie(movie)
                        : () => actions.addFavouriteMovie(movie)}
                    >
                      {store.watchlist?.some(pelicula => pelicula.id === movie.id)
                        ? <i class="bi bi-bookmark-fill"></i>
                        : <i class="bi bi-bookmark"></i>}
                    </button>
                    :
                    <button
                      className="btn btn-primary save-button-watchlist mt-4 fw-bold"
                      type="button"
                      onClick={store.watchlistSerie?.some(pelicula => pelicula.id === movie.id)
                        ? () => actions.deleteFavouriteSerie(movie)
                        : () => actions.addFavouriteSerie(movie)}
                    >
                      {store.watchlistSerie?.some(pelicula => pelicula.id === movie.id)
                        ? <i class="bi bi-bookmark-fill"></i>
                        : <i class="bi bi-bookmark"></i>}
                    </button>
                  }
                />
              </React.Fragment>
            );
          })}

        </div>



        {movies.length > 0 ? (
          <>
            <div className="text-center container mb-5">
              <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion ps-3 pe-3'>Anterior</button>
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion ps-3 pe-3'>Siguiente</button>
            </div>
            <hr className="container-fluid border-2 border-top border-secondary pe-5 ps-5 mb-5" />
          </>

        ) : ""
        }
      </div>
    </div>

  );
}

export default InfoMovie;