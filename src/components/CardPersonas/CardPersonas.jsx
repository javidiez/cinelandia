export const CardPersonas = ({castImg, castName, noImg,verMas}) => {
    return(
        <button className="btn" onClick={verMas}>
        <div className="card" style={{ width: '15rem' }}>
            <img src={castImg || noImg} className="card-img-top" onError={(e) => {
                e.target.onerror = null;
                e.target.src = noImg;
            }} alt="Cast" />
            <div className="card-body">
                <p className="text-start fw-bold fs-5">{castName}</p>
            </div>
        </div>
        </button>
    )
}