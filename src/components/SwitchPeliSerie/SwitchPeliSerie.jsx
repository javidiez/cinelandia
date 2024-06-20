import React, { useState } from 'react';
import { SnippetProximosEstrenos } from '../SinppetProximosEstrenos/SnippetProximosEstrenos';
import { BloqueNovedades } from '../SnippetNovedades/BloqueNovedades';
import { BloqueSeries } from '../BloqueSeriesHome/BloqueSeriesHome';
import { SnippetTendenciasSeries } from '../SnippetTendenciasSeries/SnippetTendenciasSeries';
import './SwitchPeliSerie.css';

export const SwitchPeliSerie = () => {
    const [tipoContenido, setTipoContenido] = useState('pelicula');

    const handleSwitchChange = (tipo) => {
        setTipoContenido(tipo);
    };

    return (
        <div className='switcheo mt-5'>
            <div className="form-check form-switch container d-flex justify-content-center mb-5">
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

            <div className="contenedor-contenido">
                {/* Contenido de películas */}
                <div className={`container-fluid row ${tipoContenido === 'pelicula' ? 'show fade-in' : 'hide'}`}>
                    <div className='col-12 col-sm-3'>
                        <SnippetProximosEstrenos />
                    </div>
                    <div className='col-12 col-sm-9'>
                        <BloqueNovedades />
                    </div>
                </div>

                {/* Contenido de series */}
                <div className={`container-fluid row contenido ${tipoContenido === 'serie' ? 'show fade-in' : 'hide'}`}>
                    <div className='col-12 col-sm-3'>
                        <SnippetTendenciasSeries />
                    </div>
                    <div className='col-12 col-sm-9'>
                        <BloqueSeries />
                    </div>
                </div>
            </div>
        </div>
    );
};
