import React from "react";
import './FilmCardRecommendations.css';
import fondoNotFound from '../../../public/img/fondo-not-found.jpeg'


export const FilmCardRecommendations = ({ image, title, releaseDate, voteAverage, topMovie, proxEstreno, movieType, classMovieType, size }) => {

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
            <p className="card-text card-text-recommend fw-bold text-uppercase">{title}</p>
            <hr className="hr-border mt-2 mb-2 pe-5 ps-5" />
            <p className="card-text card-text-recommend">{releaseDate}</p>
            <p className="card-text"><span className="fw-bold"></span>{voteAverage}</p>
          </div>
        </div>
        <div className="position-absolute top-movie"><p>{topMovie}</p></div>
        <div className="position-absolute prox-estreno"><p className="prox-estreno-recommend">{proxEstreno}</p></div>
      </div>
    </>
  );
};
