import { SwitchPeliSerie } from '../SwitchPeliSerie/SwitchPeliSerie';
import { Buscador } from '../Buscador/Buscador';
import { Navbar } from '../Navbar/Navbar';

function Home() {

  return (
    <>
      <Navbar/>
      <Buscador/>
      <SwitchPeliSerie />
    </>
  )
}

export default Home
