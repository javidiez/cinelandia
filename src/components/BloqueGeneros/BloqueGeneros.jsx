import React, { useState, useEffect } from 'react';
import BloqueGenerosMovie from '../BloqueGenerosMovie/BloqueGenerosMovie';
import BloqueGenerosSerie from '../BloqueGenerosSerie/BloqueGenerosSerie';
import '../SwitchPeliSerie/SwitchPeliSerie.css';

const API_KEY = '4f5f43495afcc67e9553f6c684a82f84';
const API_URL = 'https://api.themoviedb.org/3';

const BloqueGeneros = () => {

    const [tipoContenido, setTipoContenido] = useState('pelicula');

    const handleSwitchChange = (tipo) => {
        setTipoContenido(tipo);
    };


    return (
        <div className='switcheo mt-5'>
            <div className="form-check form-switch container d-flex justify-content-center mb-5 switecheo-generos">
                <input
                    type="radio"
                    className="btn-check"
                    name="options-outlined"
                    id="movies-outlined"
                    checked={tipoContenido === 'pelicula'}
                    onChange={() => handleSwitchChange('pelicula')}
                />
                <label className="btn btn-outline-light movie-btn" htmlFor="movies-outlined">
                    Películas
                </label>

                <input
                    type="radio"
                    className="btn-check"
                    name="options-outlined"
                    id="series-outlined"
                    checked={tipoContenido === 'serie'}
                    onChange={() => handleSwitchChange('serie')}
                />
                <label className="btn btn-outline-light serie-btn" htmlFor="series-outlined">
                    Series
                </label>
            </div>

            <div>
                {/* Contenido de películas */}
                <div className={`${tipoContenido === 'pelicula' ? 'show fade-in' : 'hide'}`}>
                    <BloqueGenerosMovie />
                </div>

                {/* Contenido de series */}
                <div className={`${tipoContenido === 'serie' ? 'show fade-in' : 'hide'}`}>
                    <BloqueGenerosSerie />
                </div>
            </div>
        </div>
    );
};

export default BloqueGeneros;
