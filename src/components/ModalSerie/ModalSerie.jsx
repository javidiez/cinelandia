import React, { useEffect } from 'react';
import '../Novedades/novedades.css'
import './modalserie.css'

export const ModalSerie = ({
    idModal,
    postherPad,
    noImg,
    originalName,
    seasons,
    episodes,
    mapGenre,
    firstAirDate,
    lastAirDate,
    originalLanguage,
    overview,
    classPuntaje,
    voteAverage,
    voteCount,
    mapProductionCompanies,
    mapCountries,
    mapCreatedBy,
    mapNextEpisodeToAir,
    mapSeasonsSeasonName,
    mapSeasonsSeasonDate,
    mapSeasonsSeasonEpisodes,
    estrella,
    lapiz,
    onClose
}) => {
    const backgroundImage = postherPad ? `url("${postherPad}")` : `url("${noImg}")`;

    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log("Click outside");
            const modal = document.getElementById(idModal);
            if (modal && !modal.contains(event.target)) {
                onClose && onClose();
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            console.log("Removing event listener");
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [idModal, onClose]);

    const mapSeasonsSeasonRows = () => {
        if (!mapSeasonsSeasonName || !mapSeasonsSeasonEpisodes || !mapSeasonsSeasonDate) {
            return null;
        }
    
        // Asegúrate de que todas las listas tengan la misma longitud
        const maxRows = Math.max(mapSeasonsSeasonName.length, mapSeasonsSeasonEpisodes.length, mapSeasonsSeasonDate.length);
    
        const rows = [];
        for (let i = 0; i < maxRows; i++) {
            const estreno = mapSeasonsSeasonDate[i] === "01/01/1970" ? "No informado" : mapSeasonsSeasonDate[i];
            rows.push(
                <tr key={i}>
                    <td>{mapSeasonsSeasonName[i]}</td>
                    <td>{mapSeasonsSeasonEpisodes[i]}</td>
                    <td>{estreno}</td>
                </tr>
            );
        }
    
        return rows;
    };

    const closeModal = () => {
        onClose && onClose();
    };



    return (
        <div className="modal fade" id={idModal} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-block">
                <div className="modal-content modal-movie" style={{ backgroundImage }}>
                    <div className="modal-header text-light border-0">
                        <h1 className="modal-title position-relative text-light" id="exampleModalLabel">{originalName}</h1>
                        <button onClick={closeModal} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body pt-0 text-light position-relative">
                        <div className='d-flex gap-2 data-extra flex-wrap align-items-center'>
                            <p className='fs-4 d-flex align-items-center'>{seasons}<span className='fw-bold fs-1 ps-2'>·</span></p>
                            <p className='fs-4 d-flex align-items-center'>{episodes}<span className='fw-bold fs-1 ps-2'>·</span></p>
                            {mapGenre}
                            <p className='fs-4 d-flex align-items-center'><span className='fw-bold fs-1 pe-2'>·</span> {firstAirDate}</p>
                            <p className='fs-4 text-uppercase d-flex align-items-center'><span className='fw-bold fs-1 pe-2'>·</span> {originalLanguage}</p>
                        </div>
                        <div className='d-flex gap-4 pt-3 flex-wrap'>
                            <div>
                                <img src={postherPad || noImg} className='imagen-modal' onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = noImg;
                                }} alt="Poster" />
                            </div>
                            <div className='bloque-derecho-modal'>
                                <p className='fs-4 texto-modal pb-1'>{overview}</p>
                                <p className='fs-4 pt-4 d-flex align-items-baseline gap-2'>
                                    <img className='icono-modal' src={estrella} alt="Estrella" />
                                    <span className='fw-bold'>Puntuación de usuarios:</span>
                                    <span className={classPuntaje}> {voteAverage}%</span>
                                </p>
                                <p className='fs-4 pt-1 d-flex align-items-baseline gap-2'>
                                    <img className='icono-modal' src={lapiz} alt="Lapiz" />
                                    <span className='fw-bold'>Valoraciones:</span> {voteCount}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h2 className='pt-4 text-primary fs-1'>Más información</h2>
                            <p className='fs-4'><span className='fw-bold'>Productora: </span>{mapProductionCompanies}</p>
                            <p className='fs-4'><span className='fw-bold'>Creador: </span>{mapCreatedBy}</p>
                            <p className='fs-4'><span className='fw-bold pe-2'>País: </span>{mapCountries}</p>
                            <p className='fs-4'><span className='fw-bold pe-2'>Fecha de último capítulo: </span>{lastAirDate}</p>
                            <p className='fs-4'><span className='fw-bold pe-2'>Estreno de nuevos episodios: </span>{mapNextEpisodeToAir}</p>
                            <h2 className='pt-4 text-primary fs-1'>Información sobre Temporadas</h2>
                            <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>

                                        <th scope="col">Temporada</th>
                                        <th scope="col">Episodios</th>
                                        <th scope="col">Estreno</th>
                                    </tr>

                                </thead>
                                <tbody>
                                {mapSeasonsSeasonRows()}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer position-relative border-0">
                        <button type="button" className="btn btn-secondary fw-bold" data-bs-dismiss="modal" onClick={closeModal}>CERRAR</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
