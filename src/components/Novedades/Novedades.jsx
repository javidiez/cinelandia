import { FilmCard } from "../FilmCard/FilmCard";
import { useEffect, useState } from "react";
import './novedades.css'

export const Novedades = () => {
    const [films, setFilms] = useState([]);

    const fetchNowPlaying = () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjFhZTY4YTkwMDljZjI5YWIyNWUwNzNkNzJjYTc2ZCIsInN1YiI6IjY2NTFmNGM0NDUwOTg2YjE3ZjE3MGI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._bWeMjy7_bnQ83aFIYwkCcknNWTnUtIPkuFClvnpa1M'
            }
        };

        fetch('https://api.themoviedb.org/3/movie/now_playing?language=es-ES&page=1', options)
        .then(response => response.json())
        .then(data => setFilms(data.results))
    }

    useEffect(() => {
        fetchNowPlaying();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

    return (
        <>
        <h2 className="text-center text-light novedades-title">Novedades</h2>
        <div className="row justify-content-center container-fluid mx-auto gap-5 mt-5 mb-5 novedades fs-5">
            {films.map(film => (
                <FilmCard key={film.id} image={film.poster_path} title={film.title} overview={film.overview} releaseDate={formatDate(film.release_date)} vote_average={film.vote_average.toFixed(2)} topMovie={film.vote_average > 7.75 ? "Top movie" : ''}/>
            ))}
        </div>
        </>
    )
}
