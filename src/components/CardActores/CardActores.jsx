export const CardActores = ({castImg, castName, noImg, castCharacter}) => {
    return(
        <div className="card" style={{ width: '10rem' }}>
            <img src={castImg || noImg} className="card-img-top" onError={(e) => {
                e.target.onerror = null;
                e.target.src = noImg;
            }} alt="Cast" />
            <div className="card-body">
                <p className="card-text"><span className="fw-bold">{castName}</span>{castCharacter}</p>
            </div>
        </div>
    )
}