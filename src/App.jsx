import { Navbar } from './components/Navbar/Navbar';
import { Novedades } from './components/Novedades/Novedades';
import InfoMovie from './components/InfoMovie/InfoMovie';
import { SnippetProximosEstrenos } from './components/SinppetProximosEstrenos/SnippetProximosEstrenos';
import { BloqueNovedades } from './components/SnippetNovedades/BloqueNovedades';


function App() {

  return (
    <>
      <Navbar />
      <InfoMovie />
      <div className='container-fluid row'>
        <div className='col-12 col-sm-3'>
          <SnippetProximosEstrenos />
        </div>
        <div className='col-12 col-sm-9'>
          <BloqueNovedades />
        </div>
      </div>
    </>
  )
}

export default App
