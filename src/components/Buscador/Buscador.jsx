import React from 'react';
import { useState } from 'react';
import './buscador.css'
import InfoMovie from '../InfoMovie/InfoMovie';
import BuscadorMovies from '../BuscadorMovies/BuscadorMovies';
import BuscadorSeries from '../BuscadorSeries/BuscadorSeries';
import '../InfoMovie/infoMovie.css'
import '../SnippetNovedades/bloque_novedades.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';

export const Buscador = () => {

    const [tipoContenido, setTipoContenido] = useState('todas');

    const handleSwitchChange = (tipo) => {
        setTipoContenido(tipo);
    };

    return (
        <div className="hero text-center">

            <div className='switcheo'>
            <h2 className="hero-text text-center text-light pb-4 pt-5">Todas tus películas y series favoritas</h2>
                <div className="form-check form-switch botones-buscador pb-3">
                    <input
                        type="radio"
                        className="btn-check "
                        name="todas-outlined"
                        id="todas-outlined"
                        checked={tipoContenido === 'todas'}
                        onChange={() => handleSwitchChange('todas')}
                    />
                    <label className="btn btn-outline-light btn-check-buscador" htmlFor="todas-outlined">
                        Todas
                    </label>
                    <input
                        type="radio"
                        className="btn-check"
                        name="movie-outlined"
                        id="movie-outlined"
                        checked={tipoContenido === 'movie'}
                        onChange={() => handleSwitchChange('movie')}
                    />
                    <label className="btn btn-outline-light btn-check-buscador" htmlFor="movie-outlined">
                        Películas
                    </label>

                    <input
                        type="radio"
                        className="btn-check "
                        name="tvserie-outlined"
                        id="tvserie-outlined"
                        checked={tipoContenido === 'tvserie'}
                        onChange={() => handleSwitchChange('tvserie')}
                    />
                    <label className="btn btn-outline-light btn-check-buscador" htmlFor="tvserie-outlined">
                        Series
                    </label>
                </div>
                <div>
                    <div className={`${tipoContenido === 'todas' ? 'show d-flex justify-content-center' : 'hide'} `}>
                        <InfoMovie />
                    </div>
                    <div className={`${tipoContenido === 'movie' ? 'show d-flex justify-content-center' : 'hide'} `}>
                        <BuscadorMovies />
                    </div>
                    <div className={`${tipoContenido === 'tvserie' ? 'show d-flex justify-content-center' : 'hide'} `}>
                        <BuscadorSeries />
                    </div>
                </div>
            </div>
        </div>
    );
};
