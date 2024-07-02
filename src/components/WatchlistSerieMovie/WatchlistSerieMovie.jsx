import { WatchlistMovie } from '../WatchlisMovie/WatchlisMovie';
import { WatchlistSerie } from '../WatchlisSerie/WatchlisSerie';
import '../Novedades/novedades.css';
import '../FilmCard/filmcard.css';
import '../InfoMovie/infoMovie.css';
import '../SnippetNovedades/bloque_novedades.css';
import '../Modal/modal.css';
import '../BloqueSeriesHome/BloqueSeriesHome.css'
import '../../../node_modules/swiper/swiper-bundle.min.css';
import './watchlistSerieMovie.css';


export const WatchlistSerieMovie = () => {

    return (

        <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <h2 className="text-center text-light novedades-title">Watchlist</h2>
          <WatchlistMovie />
          <WatchlistSerie />
        </div>
      </div>


    )

}
