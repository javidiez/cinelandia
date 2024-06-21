import Home from "./components/Home";
import { Novedades } from './components/Novedades/Novedades';
import { NovedadesSerie } from './components/NovedadesSerie/NovedadesSerie';
import { Populares } from './components/Populares/Populares';
import { PopularesSerie } from './components/PopularSerie/PopularSerie';
import { ProximosEstrenos } from "./components/ProximosEstrenos/ProximosEstrenos";
import { TopRated } from "./components/TopRated/TopRated";
import { TopRatedSerie } from "./components/TopRatedSerie/TopRatedSerie";
import { TrendingSerie } from "./components/TrendingSeries/TrendingSeries";
import BloqueGeneros from "./components/BloqueGeneros/BloqueGeneros";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';


function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/novedades_series" element={<NovedadesSerie />} />
          <Route path="/peliculas_populares" element={<Populares />} />
          <Route path="/series_populares" element={<PopularesSerie />} />
          <Route path="/peliculas_estrenos" element={<ProximosEstrenos />} />
          <Route path="/peliculas_toprated" element={<TopRated />} />
          <Route path="/series_toprated" element={<TopRatedSerie />} />
          <Route path="/series_trending" element={<TrendingSerie />} />
          <Route path="/generos" element={<BloqueGeneros />} />
        </Routes>
      </Router>
      <Home/>
    </>
  )
}

export default App
