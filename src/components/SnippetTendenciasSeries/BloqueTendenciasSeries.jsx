import React from "react";
import '../SinppetProximosEstrenos/snippet_pp.css'

export const BloqueTendenciasSeries = ({ img, title, description, date, onclick, voteAverage }) => {
    return (

        <div className='text-light d-flex'>
            
            <div>
                <img src={img} className='img-snippet-pp' />
            </div>
            <div className="d-flex flex-column">
            <div className='snippet_pp_movie_title'>{title}</div>
            <div className='fs-5'>{description}</div>
            <div className="fs-5">{voteAverage}</div>
            <div className="fs-5">{date}</div>
            <div className="mt-3">
            <button className="btn btn-success btn-mas-info-estrenos" onClick={onclick}>Más información</button>
            </div>
            </div>
            
        </div>

    )
}