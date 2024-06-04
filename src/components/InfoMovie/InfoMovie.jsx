
import { useEffect } from 'react';
import axios from 'axios'
import { SearchCard } from '../SearchCard/SearchCard';
import { useState } from 'react';
import './infoMovie.css'
import estrella from '../../assets/img/estrella.png'
import lapiz from '../../assets/img/lapiz.png'
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg'


function InfoMovie() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  // endpoint para las imagenes
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

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
    const { data: { results, total_pages } } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
        include_adult: false,
        language: "es-ES",
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






  // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
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
    // const data = await fetchMovie(movie.id)
    // console.log(data);
    // setSelectedMovie(movie)
    fetchMovie(movie.id);

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
  }, []);


  // Funciones para manejar la paginación
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      fetchMovies(searchKey, currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchMovies(searchKey, currentPage + 1);
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


      <div className="hero d-flex flex-column align-items-center justify-content-center">
        <h2 className="hero-text text-center text-light pb-4">Todas tus películas favoritas</h2>
        <form className="container w-50 d-flex flex-column gap-2 input-group-lg" role="search" onSubmit={searchMovies}>
          <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" id="buscador" onChange={(e) => setSearchKey(e.target.value)} />
          <button className="btn btn-primary w-100 fw-bold buscar" type="submit">BUSCAR</button>
        </form>
      </div>


      <div>
        <main>
          {movie ? (
            <>
              <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-block">
                  <div className="modal-content modal-movie" style={{
                    backgroundImage: `url("${IMAGE_PATH}${movie.poster_path}")`,
                  }}>
                    <div className="modal-header text-light border-0">
                      <h1 className="modal-title position-relative text-light" id="exampleModalLabel">{movie.title}</h1>
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
          }}/>
                        </div>
                        <div className='bloque-derecho-modal'>
                          <p className='fs-4 texto-modal pb-1'>{movie.overview}</p>
                          <p className='fs-4 pt-4 d-flex align-items-baseline gap-2'><img className='icono-modal' src={estrella}/><span className='fw-bold'>Puntuación de usuarios:</span><span className={`${movie.vote_average * 10 >= 80 ? 'puntaje-verde' : movie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}> {(movie.vote_average *10).toFixed(2)}%</span>
                          </p>
                          <p className='fs-4 pt-1 d-flex align-items-baseline gap-2'><img className='icono-modal' src={lapiz}/><span className='fw-bold'>Valoraciones:</span> {movie.vote_count}</p>
                        </div>
                        </div>
                        <div>
                          <h2 className='pt-4 text-info subtitle-modal'>Datos de la película</h2>
                          
                          <p className='fs-4 '><span className='fw-bold'>Productora: </span>
                          {movie && movie.production_companies && movie.production_companies.map((companies, index) => (
                          <span className='ps-2' key={companies.id}>{companies.name}{index < movie.production_companies.length -1 ? ', ' : ''}</span>
                          ))}</p>
                          <p className='fs-4'>
                            <span className='fw-bold pe-2'>País:
                            </span>
                            {movie && movie.production_countries && movie.production_countries.map((countries, index) => (
                            <span>{countries.name}{index < movie.production_companies.length -1 ? ', ' : ''}</span> ))}
                              </p>
                          <p className='fs-4'><span className='fw-bold'>Presupuesto: </span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(movie.budget)}</p>
                          <p className='fs-4'><span className='fw-bold'>Recaudación: </span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(movie.revenue)}</p>

                          


                          {/* <p className='fs-4'><span className='fw-bold'>Recaudación: </span> ${movie.revenue}</p> */}
                          {/* <p className='fs-4'>Sitio web: <a target="_blank" href={movie.homepage}>{movie.title}</a></p> */}
                        </div>

                    </div>
                    <div className="modal-footer position-relative border-0">
                      <button type="button" className="btn btn-secondary fw-bold" data-bs-dismiss="modal">CERRAR</button>
                    </div>
                  </div>
                </div>
              </div>



            </>
          ) : null}
        </main>
      </div>

      {movies.length > 0 ? (
        <>

          <h2 className="hero-text text-center text-light pt-5">Resultados de la búsqueda </h2>
          <div className="text-center container">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className='btn btn-dark botones-paginacion'>Anterior</button>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className='btn btn-dark botones-paginacion'>Siguiente</button>
          </div>
        </>

      ) : showNoResults && (
        <h3 className='text-center container text-light mt-5'>No se encontraron resultados</h3>
      )}

      <div>
        {/* contenedor para mostrar los posters y las peliculas en la peticion a la api */}
        <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 mb-5 novedades fs-5">
          {movies.map((movie) => (
            <>
            
            <SearchCard key={movie.id} image={movie.poster_path} title={movie.title} overview={movie.overview} releaseDate={formatDate(movie.release_date)} vote_average={movie.vote_average.toFixed(2)} onclick={() => selectMovie(movie)} dataBstoggle="modal" dataBsTarget="#exampleModal" topMovie={movie.vote_average > 7.75 ? "Top movie" : ''} />
            </>
          ))}

        </div>

      </div>



    </div>
  );
}

export default InfoMovie;