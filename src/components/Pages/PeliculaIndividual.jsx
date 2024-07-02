import { Navbar } from "../Navbar/Navbar"
import { PeliculaSingle } from "../PeliculaSingle/PeliculaSingle"



function PeliculaIndividual() {

  return (
    <>
      <Navbar/>
      <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <PeliculaSingle/>
        </div>
        </div>
    </>
  )
}

export default PeliculaIndividual
