import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Generos from './components/Pages/Generos';
import MovieNovedades from './components/Pages/MovieNovedades';
import MovieEstrenos from './components/Pages/MovieEstrenos';
import SeriesNovedades from './components/Pages/SeriesNovedades';
import SeriesPopulares from './components/Pages/SeriesPopulares';
import MoviePopulares from './components/Pages/MoviePopulares';
import MovieTopRated from './components/Pages/MovieTopRated';
import SeriesTopRated from './components/Pages/SeriesTopRated';
import SeriesTendencias from './components/Pages/SeriesTendencias';
import Home from './components/Pages/Home'
import Personas from './components/Pages/Personas';
import '../public/index.css'
import { Footer } from './components/Footer/Footer';
import Watchlist from './components/Pages/Watchlist';
import injectContext from './store/appContext.jsx';
import PeliculaIndividual from './components/Pages/PeliculaIndividual.jsx';
import SerieIndividual from './components/Pages/SerieIndividual.jsx';
import PersonaIndividual from './components/Pages/PersonaIndividual.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/novedades" element={<MovieNovedades />} />
        <Route path="/novedades_series" element={<SeriesNovedades />} />
        <Route path="/peliculas_populares" element={<MoviePopulares />} />
        <Route path="/series_populares" element={<SeriesPopulares />} />
        <Route path="/peliculas_estrenos" element={<MovieEstrenos />} />
        <Route path="/peliculas_toprated" element={<MovieTopRated />} />
        <Route path="/series_toprated" element={<SeriesTopRated />} />
        <Route path="/series_trending" element={<SeriesTendencias />} />
        <Route path="/generos" element={<Generos />} />
        <Route path="/personas" element={<Personas />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/pelicula/:id/:movie_name" element={<PeliculaIndividual />} />
        <Route path="/serie/:id/:serie_name" element={<SerieIndividual />} />
        <Route path="/persona/:id/:persona_name" element={<PersonaIndividual />} />
        <Route path="*" element={<h1 className='text-center text-light mt-5'>Not found!</h1>} />
      </Routes>
      <Footer/>
    </Router>

  );
}
export default injectContext(App);
