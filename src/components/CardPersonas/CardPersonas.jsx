import { Link } from "react-router-dom";

export const CardPersonas = ({castImg, castName, noImg,verMas}) => {
    return(
        <Link className="btn" to={verMas}>
        <div className="card" style={{ width: '13rem' }}>
            <img src={castImg || noImg} className="card-img-top" style={{ height: '20rem' }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = noImg;
            }} alt="Cast" />
            <div className="card-body">
                <p className="text-start fw-bold fs-5">{castName}</p>
            </div>
        </div>
        </Link>
    )
}