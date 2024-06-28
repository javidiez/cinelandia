import React from 'react';
import '../Novedades/novedades.css';
import '../Modal/modal.css';


export const ModalPersonas = ({
    idModal,
    profilePad,
    noImg,
    name,
    biography,
    birthday,
    deathday,
    place_of_birth,
    moviesSeriesActing
}) => {

    const backgroundImage = `url("${noImg}")`;

    const closeModal = () => {
        onClose && onClose();
    };

    return (
        <div className="modal fade" id={idModal} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl modal-block">
                <div className="modal-content modal-movie text-start" style={{ backgroundImage }}>
                    <div className="modal-header text-light border-0">
                        <h1 className="modal-title position-relative text-light" id="exampleModalLabel">{name}</h1>
                        <button type="button" className="btn-close btn-close-white" aria-label="Close" data-bs-dismiss="modal" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body pt-0 text-light position-relative">
                        <div className='d-flex gap-4 pt-2 flex-wrap'>
                            <div className='bloque-poster-modal'>
                                <div>
                                    <img src={profilePad || noImg} className='imagen-modal' onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = noImg;
                                    }} alt="Actor" />
                                </div>
                            </div>
                            <div className='bloque-derecho-modal'>
                                <p className='fs-4 texto-modal pb-1'>{birthday}</p>
                                <p className='fs-4 texto-modal pb-1'>{deathday}</p>
                                <p className='fs-4 texto-modal pb-1'>{place_of_birth}</p>
                                <div class="accordion mt-3" id="biografia">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                <span className='fs-5'>Biografía</span>
                                            </button>
                                        </h2>
                                        <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#biografia">
                                            <div class="accordion-body bg-dark text-light fs-5">
                                                {biography}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {moviesSeriesActing}
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
