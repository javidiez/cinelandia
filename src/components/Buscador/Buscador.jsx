import React from 'react';
import './buscador.css'

export const Buscador = ({ onSubmit, onChange, title, buttonText }) => {
    return (
        <div className="hero d-flex flex-column align-items-center justify-content-center">
            <h2 className="hero-text text-center text-light pb-4">{title}</h2>
            <form className="container d-flex flex-column gap-2 input-group-lg buscador_central" role="search" onSubmit={onSubmit}>
                <input className="form-control me-2" type="search" placeholder="Película o serie..." aria-label="Search" id="buscador" onChange={onChange} />
                <button className="btn btn-primary fw-bold buscar" type="submit">{buttonText}</button>
            </form>
        </div>
    );
};
