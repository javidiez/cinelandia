import './cardcast.css'
import { Link } from 'react-router-dom';

export const CardActores = ({castImg, castName, noImg, castCharacter, verMas}) => {
    return(
        <Link className='btn' to={verMas}>
        <div className="card card-cast " style={{ width: '9rem' }}>
            <img src={castImg || noImg} className="card-img-top" onError={(e) => {
                e.target.onerror = null;
                e.target.src = noImg;
            }} alt="Cast" />
            <div className="card-body">
                <p className="card-text"><span className="fw-bold">{castName}</span>{castCharacter}</p>
            </div>
        </div>
        </Link>
    )
}