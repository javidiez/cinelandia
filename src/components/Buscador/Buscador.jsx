import React from 'react';

export const Buscador = ({ onSubmit, onChange, title, buttonText }) => {
    return (
        <div className="hero d-flex flex-column align-items-center justify-content-center">
            <h2 className="hero-text text-center text-light pb-4">{title}</h2>
            <form className="container w-50 d-flex flex-column gap-2 input-group-lg" role="search" onSubmit={onSubmit}>
                <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" id="buscador" onChange={onChange} />
                <button className="btn btn-primary w-100 fw-bold buscar" type="submit">{buttonText}</button>
            </form>
        </div>
    );
};
