import React from "react";
import './FilmCardRecommendations.css';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg'


export const FilmCardRecommendations = ({ image, title, releaseDate, verMas, info_multimedia, voteAverage, topMovie, proxEstreno, movieType, classMovieType, size }) => {

  const truncateText = (text, maxLength) => {
    if (!text) {
      return ''; // Devolver una cadena vacía si el texto es undefined o null
    }
    console.log(`Truncating text: "${text}" with maxLength: ${maxLength}`);
    if (text.length > maxLength) {
      console.log(`Text is longer than ${maxLength} characters. Truncating...`);
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <>

      <div className="card p-0 mt-3" style={size}>
        <div className="film-card">

          <img
            src={`https://image.tmdb.org/t/p/w500/${image}`}
            className="search-img-top"
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fondoNotFound
            }}
          />
          <div className="overlay text-center p-3">
            <div className={classMovieType}>{movieType}</div>
            <p className="card-text card-text-recommend fw-bold text-uppercase truncate-text-recommend">{truncateText(title,34)}</p>
            <p className="card-text"><span className="fw-bold"></span>{releaseDate}</p>
            <p className="card-text mt-1"><span className="fw-bold"></span>{voteAverage}</p>
            <a href={info_multimedia}><button className="btn btn-success ver-mas-recommend fw-bold p-1 px-2 mt-3" onClick={verMas}>VER MÁS</button></a>
           
          </div>
        </div>
        <div className="position-absolute top-movie"><p>{topMovie}</p></div>
        <div className="position-absolute prox-estreno"><p className="prox-estreno-recommend">{proxEstreno}</p></div>
      </div>
    </>
  );
};
