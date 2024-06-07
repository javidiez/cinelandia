import React from "react";
import './filmcard.css';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg'

export const FilmCard = ({ image, title, releaseDate, voteAverage, onclick, topMovie, proxEstreno, movieType, classMovieType, size }) => {

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
              e.target.src = fondoNotFound
            }}
          />
          <div className="overlay text-center p-3">
            <div className={classMovieType}>{movieType}</div>
            <p className="card-text fs-3 pb-4 fw-bold text-uppercase">{title}</p>
            <p className="card-text"><span className="fw-bold">Fecha: </span>{releaseDate}</p>
            <p className="card-text"><span className="fw-bold">Valoración: </span>{voteAverage} %</p>
            <button className="btn btn-primary mt-4 fw-bold fs-5" onClick={onclick}>VER MÁS</button>
          </div>
        </div>
        <div className="position-absolute top-movie"><p>{topMovie}</p></div>
        <div className="position-absolute prox-estreno"><p>{proxEstreno}</p></div>
      </div>
    </>
  );
};
