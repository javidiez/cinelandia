import React from 'react';
import '../Novedades/novedades.css'

export const Modal = ({
    idModal,
    postherPad,
    noImg,
    title,
    runTime,
    mapGenre,
    releaseDate,
    originalLanguage,
    overview,
    classPuntaje,
    voteAverage,
    voteCount,
    mapProductionCompanies,
    mapCountries,
    budget,
    revenue,
    estrella,
    lapiz
}) => {
    const backgroundImage = postherPad ? `url("${postherPad}")` : `url("${noImg}")`;

    return (
      <div className="modal fade" id={idModal} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-block">
                <div className="modal-content modal-movie" style={{ backgroundImage }}>
                    <div className="modal-header text-light border-0">
                        <h1 className="modal-title position-relative text-light" id="exampleModalLabel">{title}</h1>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body pt-0 text-light position-relative">
                        <div className='d-flex gap-2 data-extra flex-wrap align-items-center'>
                            <p className='fs-4 d-flex align-items-center'>{runTime} minutos <span className='fw-bold fs-1 ps-2'>·</span></p>
                            {mapGenre}
                            <p className='fs-4 d-flex align-items-center'><span className='fw-bold fs-1 pe-2'>·</span> {releaseDate}</p>
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
                            <h2 className='pt-4 text-primary subtitle-modal'>Más información</h2>
                            <p className='fs-4'><span className='fw-bold'>Productora: </span>{mapProductionCompanies}</p>
                            <p className='fs-4'><span className='fw-bold pe-2'>País: </span>{mapCountries}</p>
                            <p className='fs-4'><span className='fw-bold'>Presupuesto: </span>{budget}</p>
                            <p className='fs-4'><span className='fw-bold'>Recaudación: </span>{revenue}</p>
                        </div>
                    </div>
                    <div className="modal-footer position-relative border-0">
                        <button type="button" className="btn btn-secondary fw-bold" data-bs-dismiss="modal">CERRAR</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
