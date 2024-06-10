import { useEffect, useState } from 'react';
import axios from 'axios'
import { FilmCard } from '../FilmCard/FilmCard';
import { ModalSerie } from '../ModalSerie/ModalSerie';
import { Modal } from '../Modal/Modal';
import { Buscador } from '../Buscador/Buscador';
import './infoMovie.css'
import { CardActores } from '../CardActores/CardActores';
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import smartTv from '../../assets/img/smart-tv.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import avatar from '../../assets/img/avatar.webp';
import '../SnippetNovedades/bloque_novedades.css'


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
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState(null);
  const [platforms, setPlatforms] = useState(null);
  const [playing, setPlaying] = useState(false);

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

  const fetchMovie = async (id, mediaType) => {
    try {
      const { data } = await axios.get(`${API_URL}/${mediaType}/${id}?language=es-ES`, {
        params: {
          api_key: API_KEY,
          append_to_response: 'videos,credits,watch/providers',
        },
      });

      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find((vid) => vid.name === "Official Trailer");
        setTrailer(trailer ? trailer : data.videos.results[0]);
      }

      if (data.credits && data.credits.cast) {
        // Extraer el elenco de la respuesta de la API
        const castMembers = data.credits.cast;
        // Configurar el estado 'cast' con la lista de miembros del elenco
        setCast(castMembers.slice(0, 6));
      }
      if (data["watch/providers"] && data["watch/providers"].results) {
        const country = data["watch/providers"].results.ES; // Cambia 'ES' por el código del país que desees
        if (country && country.flatrate) {
          setPlatforms(country.flatrate);
        } else {
          setPlatforms(null); // Reiniciar plataformas si no hay flatrate
        }
      } else {
        setPlatforms(null); // Reiniciar plataformas si no hay resultados
      }


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
    if (currentPage > 1) {
      fetchMovies(searchKey, currentPage - 1);
      window.scrollTo(0, 500);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchMovies(searchKey, currentPage + 1);
      window.scrollTo(0, 500);
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
    setPlaying(false);
    setMovie({});
  };

  return (
    <div>
      <Buscador title="Todas tus películas y series favoritas" buttonText="BUSCAR" onChange={(e) => setSearchKey(e.target.value)} onSubmit={searchMovies} />

      <div>
        <main>
          {selectedMovie && selectedMovie.title ? (
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
              smartTv={smartTv}
              onClose={handleCloseModal}
              trailer={trailer}
              cast={cast && cast.map((actor, index) => (

                <CardActores
                  key={index}
                  castImg={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  castName={actor.name}
                  noImg={avatar}
                  castCharacter={actor.character ? ` (${actor.character})` : ''}
                />

              ))}
              providers={platforms && platforms.length > 0 ? (
                <>
                  <div>
                    <img className='icono-modal me-2' alt="smarttv" src={smartTv} />
                    <span className='fw-bold'>Plataformas</span>
                  </div>
                  {platforms.map((platform, index) => (
                    <img key={index} className='border platforms me-2 mt-2' src={`https://image.tmdb.org/t/p/w200${platform.logo_path}`} alt={platform.provider_name} />
                  ))}
                </>
              ) : ''}
            />
          ) : selectedMovie && selectedMovie.name ? (

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
              smartTv={smartTv}
              onClose={handleCloseModal}
              trailer={trailer}
              cast={cast && cast.map((actor, index) => (

                <CardActores
                  key={index}
                  castImg={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  castName={actor.name}
                  noImg={avatar}
                  castCharacter={actor.character ? ` (${actor.character})` : ''}
                />

              ))}
              providers={platforms && platforms.length > 0 ? (
                <>
                  <div>
                    <img className='icono-modal me-2' alt="smarttv" src={smartTv} />
                    <span className='fw-bold'>Plataformas</span>
                  </div>
                  {platforms.map((platform, index) => (
                    <img key={index} className='border platforms me-2 mt-2' src={`https://image.tmdb.org/t/p/w200${platform.logo_path}`} alt={platform.provider_name} />
                  ))}
                </>
              ) : ''}
            />
          ) : null
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
        <>
          <h3 className='text-center container text-light mt-5 fs-1'>No se encontraron resultados</h3>
          <hr className="container-fluid border-2 border-top border-secondary mt-5 mb-5 pe-5 ps-5" />
        </>


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