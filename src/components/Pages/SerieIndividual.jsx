import { Navbar } from "../Navbar/Navbar"
import { SerieSingle } from "../SerieSingle/SerieSingle"



function SerieIndividual() {

  return (
    <>
      <Navbar/>
      <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <SerieSingle/>
        </div>
        </div>
    </>
  )
}

export default SerieIndividual
