import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import '../Novedades/novedades.css';
import './modal.css';
import { Context } from '../../store/appContext';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';


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
    lapiz,
    onClose,
    trailer, // Pasar el trailer como prop
    cast,
    providers,
    recommendations,
    watchlistButtons,
    shareUrl
}) => {

    const videoContainerRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const modal = document.getElementById(idModal);
            if (modal && !modal.contains(event.target)) {
                onClose && onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [idModal, onClose]);

    const backgroundImage = postherPad ? `url("${postherPad}")` : `url("${noImg}")`;

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
                        <h1 className="modal-title position-relative text-light" id="exampleModalLabel">{title}</h1>
                        <button type="button" className="btn-close btn-close-white" aria-label="Close" data-bs-dismiss="modal" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body pt-0 text-light position-relative">
                        <div className='d-flex gap-2 data-extra flex-wrap align-items-center'>
                            <p className='fs-4 d-flex align-items-center'>{runTime}<span className='fw-bold fs-1 ps-2'>·</span></p>
                            {mapGenre}
                            <p className='fs-4 d-flex align-items-center'><span className='fw-bold fs-1 pe-2'>·</span> {releaseDate}</p>
                            <p className='fs-4 text-uppercase d-flex align-items-center pe-3'><span className='fw-bold fs-1 pe-2'>·</span> {originalLanguage}</p>
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
                            <WhatsappShareButton url={shareUrl}>
                                <WhatsappIcon size={35} round />
                            </WhatsappShareButton>

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
                        <div className='d-flex gap-4 pt-2 flex-wrap'>
                            <div className='bloque-poster-modal'>
                                <div>
                                    <img src={postherPad || noImg} className='imagen-modal' onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = noImg;
                                    }} alt="Poster" />
                                </div>
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
                            <h2 className='pt-5 pb-3 text-info subtitle-modal'>Más información</h2>
                            <p className='fs-4'><span className='fw-bold'>Productora: </span>{mapProductionCompanies}</p>
                            <p className='fs-4'><span className='fw-bold'>País: </span>{mapCountries}</p>
                            <p className='fs-4'>{budget}</p>
                            <p className='fs-4'>{revenue}</p>
                            <div className='d-flex gap-3 flex-wrap'>
                                {cast}

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
