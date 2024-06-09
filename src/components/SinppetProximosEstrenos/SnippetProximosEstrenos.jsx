import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from '../Modal/Modal';
import { BloqueProximosEstrenos } from "./BloqueProximosEstrenos";
import estrella from '../../assets/img/estrella.png';
import lapiz from '../../assets/img/lapiz.png';
import fondoNotFound from '../../assets/img/fondo-not-found.jpeg';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css'
import './snippet_pp.css'

export const SnippetProximosEstrenos = () => {

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [trailer, setTrailer] = useState(null);
    const [playing, setPlaying] = useState(false);

    const fetchNowPlaying = async (page) => {
        const { data: { results, total_pages } } = await axios.get(`${API_URL}/discover/movie?include_adult=false&popularity`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                sort_by: 'popularity.desc',
                'primary_release_date.gte': formattedToday,
                page: page,
            },
        });

        const sortedResults = results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

        setCurrentPage(page);
        setTotalPages(total_pages);
        setMovies(sortedResults);
    };

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}?language=es-ES`, {
            params: {
                api_key: API_KEY,
                append_to_response: 'videos'
            },
        });

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(
                (vid) => vid.name === "Official Trailer"
            );
            setTrailer(trailer ? trailer : data.videos.results[0]);
        }

        setSelectedMovie(data);
    };

    const selectMovie = async (movie) => {
        await fetchMovie(movie.id);
    };

    useEffect(() => {
        fetchNowPlaying(currentPage);
    }, [currentPage]);


    useEffect(() => {
        if (selectedMovie) {
            const modal = new bootstrap.Modal(document.getElementById(`modalEstrenos-${selectedMovie.id}`));
            modal.show();
        }
    }, [selectedMovie]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const releaseDate = new Date(movies.release_date);
    const isUpcoming = releaseDate > today ? "Próximo estreno" : "";

    const moviesToShow = movies.slice(0, 5);

    const handleCloseModal = () => {
        setPlaying(false); // Detiene el video
        setSelectedMovie(null); // Cierra el modal
    };

    return (
        <>
            <div>
                <main>
                    {selectedMovie && (
                        <Modal
                            key={selectedMovie.id}
                            idModal={`modalEstrenos-${selectedMovie.id}`}
                            postherPad={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : fondoNotFound}
                            noImg={fondoNotFound}
                            title={selectedMovie.title}
                            runTime={selectedMovie.runtime}
                            mapGenre={selectedMovie.genres && selectedMovie.genres.map((genre, index) => (
                                <p className='fs-4' key={genre.id}>{genre.name}{index < selectedMovie.genres.length - 1 ? ', ' : ''}</p>
                            ))}
                            releaseDate={formatDate(selectedMovie.release_date)}
                            originalLanguage={selectedMovie.original_language}
                            overview={selectedMovie.overview}
                            classPuntaje={`${selectedMovie.vote_average * 10 >= 80 ? 'puntaje-verde' : selectedMovie.vote_average * 10 > 60 ? 'puntaje-amarillo' : 'puntaje-rojo'}`}
                            voteAverage={(selectedMovie.vote_average * 10).toFixed(2)}
                            voteCount={selectedMovie.vote_count}
                            mapProductionCompanies={selectedMovie.production_companies && selectedMovie.production_companies.map((company, index) => (
                                <span className='ps-2' key={company.id}>{company.name}{index < selectedMovie.production_companies.length - 1 ? ', ' : ''}</span>
                            ))}
                            mapCountries={selectedMovie.production_countries && selectedMovie.production_countries.map((country, index) => (
                                <span key={country.iso_3166_1}>{country.name}{index < selectedMovie.production_countries.length - 1 ? ', ' : ''}</span>
                            ))}
                            budget={''}
                            revenue={''}
                            estrella={estrella}
                            lapiz={lapiz}
                            onClose={handleCloseModal}
                            trailer={trailer}

                        />
                    )}
                </main>
            </div>



            <div>

                <div className="d-flex flex-column container-fluid snippet_pp">

                    <h2 className="text-center text-light snippet_pp_title">Próximos estrenos</h2>

                  
                  
             
                        
                        

                    {moviesToShow.map((movie) => {
                        


                        return (
                            <>
                            <BloqueProximosEstrenos
                                key={movie.id}
                                img={`${IMAGE_PATH}${movie.poster_path}`}
                                title={movie.title}
                                description={''}
                                date={formatDate(movie.release_date)}
                                onclick={() => selectMovie(movie)}
                            />
                            <hr className="border-2 border-top border-secondary" />
                            </>
                        );
                    })}
                <div className="text-center mb-5 mt-3 ">
                <a href="./proximos_estrenos.html"><button className='btn btn-primary botones-ver-mas ps-3 pe-3'>Ver mas</button></a>
            </div>
                </div>
         
            
            </div>
            
         
        </>
    );
};