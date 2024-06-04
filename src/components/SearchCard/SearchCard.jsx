import React from "react";
import './searchcard.css';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg'

export const SearchCard = ({ image, title, releaseDate, vote_average, onclick, dataBstoggle, dataBsTarget, topMovie }) => {

  return (
    <>

      <div className="card p-0" style={{ width: '18rem' }}>
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
            <p className="card-text fs-3 fw-bold pb-4 text-uppercase">{title}</p>
            <p className="card-text"><span className="fw-bold">Fecha: </span>{releaseDate}</p>
            <p className="card-text"><span className="fw-bold">Valoración: </span>{vote_average}</p>
            <button className="btn btn-primary mt-4 fw-bold fs-5" onClick={onclick} data-bs-toggle={dataBstoggle} data-bs-target={dataBsTarget}>VER MÁS</button>
          </div>
        </div>
        <div className="position-absolute top-movie"><p>{topMovie}</p></div>
      </div>
    </>
  );
};
