import React from "react";
import './filmcard.css';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';

export const FilmCard = ({ image, title, releaseDate, voteAverage, onclick, topMovie, proxEstreno, movieType, classMovieType, size, saveButton }) => {

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <>
      <div className="card p-0" style={size}>
        <div className="film-card">
          <img
            src={`https://image.tmdb.org/t/p/w500/${image}`}
            className="search-img-top"
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fondoNotFound;
            }}
          />
          <div className="overlay text-center p-3 no-select">
             <div className={classMovieType}>{movieType}</div>
            <p className="card-text pb-4 fw-bold text-uppercase truncate-text">
              {truncateText(title,40)}
            </p>
            <p className="card-text fs-4">{releaseDate}</p>
            <p className="card-text fs-2">{voteAverage}</p>
            <div className="d-flex gap-2">
            <button className="btn btn-success mt-4 fw-bold fs-5" onClick={onclick}>VER MÁS</button>
            
            </div>
          </div>
        </div>
        <div className="position-absolute top-movie"><p>{topMovie}</p></div>
        <div className="position-absolute prox-estreno"><p>{proxEstreno}</p></div>
      </div>
    </>
  );
};
