import { Navbar } from './Navbar/Navbar';
import { SwitchPeliSerie } from './SwitchPeliSerie/SwitchPeliSerie';
import { Buscador } from './Buscador/Buscador';

function Home() {

  return (
    <>
      <Buscador/>
      <SwitchPeliSerie />
    </>
  )
}

export default Home
