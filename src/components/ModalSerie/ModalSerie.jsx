import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import '../Novedades/novedades.css'
import './modalserie.css'
import '../Novedades/novedades.css';
import '../Modal/modal.css';

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
    onClose,
    cast,
    trailer,
    providers,
    recommendations,
    watchlistButtons
}) => {
    const backgroundImage = postherPad ? `url("${postherPad}")` : `url("${noImg}")`;
    const videoContainerRef = useRef(null);
    const [playing, setPlaying] = useState(false);

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

    const handlePlayTrailer = () => {
        setPlaying(true);
        setTimeout(() => {
            if (videoContainerRef.current) {
                videoContainerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    };



    return (
        <div className="modal fade" id={idModal} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-block">
                <div className="modal-content modal-movie text-start" style={{ backgroundImage }}>
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
                            {!playing && trailer && (
                                <button
                                    className="btn btn-success fw-bold ver-trailer"
                                    onClick={handlePlayTrailer}
                                    type="button"
                                >
                                    VER TRAILER
                                </button>
                            )}
                            {watchlistButtons}
                        </div>
                        <div ref={videoContainerRef} className="video-container mt-3">
                            {playing && (
                                <div>
                                    <button onClick={() => setPlaying(false)} className="btn btn-primary fw-bold mb-3">
                                        CERRAR
                                    </button>
                                    <YouTube
                                        videoId={trailer ? trailer.key : ''}
                                        className="reproductor"
                                        containerClassName={"youtube-container amru"}
                                        opts={{
                                            width: "100%",
                                            height: "100%",
                                            playerVars: {
                                                autoplay: 1,
                                                controls: 1,
                                                cc_load_policy: 0,
                                                fs: 0,
                                                iv_load_policy: 0,
                                                modestbranding: 0,
                                                rel: 0,
                                                showinfo: 0,
                                            },
                                        }}
                                    />
                                </div>
                            )}

                        </div>
                        <div className='d-flex gap-4 pt-3 flex-wrap'>
                            <div className='bloque-poster-modal'>                                <img src={postherPad || noImg} className='imagen-modal' onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = noImg;
                            }} alt="Poster" />
                            </div>
                            <div className='bloque-derecho-modal'>
                                <p className='fs-4 texto-modal pb-1'>{overview}</p>
                                <div className='fs-4 pt-3 d-flex align-items-baseline gap-2 puntaje'>
                                    <div className='d-flex align-items-baseline justify-content-start'>
                                        <img className='icono-modal me-2' src={estrella} alt="Estrella" />
                                        <span className='fw-bold'>Puntuación de usuarios:</span>
                                        </div>
                                    <div className='porcentaje-valoracion'>
                                        <span className={classPuntaje}> {voteAverage}%</span>
                                    </div>

                                </div>
                                <p className='fs-4 pt-1 d-flex align-items-baseline gap-2'>
                                    <img className='icono-modal' src={lapiz} alt="Lapiz" />
                                    <span className='fw-bold pt-2'>Valoraciones:</span> {voteCount}
                                </p>
                                <p className='fs-4 pt-1 align-items-baseline gap-2'>
                                    {providers}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h2 className='pt-5 pt-3 text-info subtitle-modal'>Más información</h2>
                            <p className='fs-4'><span className='fw-bold'>Productora: </span>{mapProductionCompanies}</p>
                            <p className='fs-4'><span className='fw-bold'>Creador: </span>{mapCreatedBy}</p>
                            <p className='fs-4'><span className='fw-bold'>País: </span>{mapCountries}</p>
                            <p className='fs-4'><span className='fw-bold'>Fecha de último capítulo: </span>{lastAirDate}</p>
                            <p className='fs-4'><span className='fw-bold'>Estreno de nuevos episodios: </span>{mapNextEpisodeToAir}</p>
                            <div className='d-flex gap-3 flex-wrap'>
                                {cast}

                            </div>

                            <h2 className='pt-5 pb-3 text-info subtitle-modal'>Información sobre Temporadas</h2>
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
                            {recommendations}
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
