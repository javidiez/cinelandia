import { SwitchPeliSerie } from '../SwitchPeliSerie/SwitchPeliSerie';
import { Buscador } from '../Buscador/Buscador';
import { Navbar } from '../Navbar/Navbar';
import { useEffect } from 'react';

function Home() {

  const recargar = () => {
    window.location.reload()
    window.scrollTo(0, 0);
}

useEffect(() =>{
  window.scrollTo(0, 0)
},[])



  return (
    <>
      <Navbar reload={() => recargar()}/>
      <Buscador/>
      <SwitchPeliSerie />
    </>
  )
}

export default Home
