import React from 'react';

import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';


export const Footer = () => {

  const shareUrl = window.location.href; // Puedes cambiar esto por la URL de la película


    return (
        <footer className="footer bg-dark text-center mt-auto py-3 ">
        <div className="container">
          <span className="text-light">© 2024 Cinelandia. Información obtenida de <a href="https://www.themoviedb.org/" className='text-decoration-none' target='_blank'>TMDB</a>. Desarrollada por <a href="https://github.com/javidiez" className='text-decoration-none' target='_blank'>JD</a>.</span>
          {/* <WhatsappShareButton url={shareUrl}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton> */}
        </div>
      </footer>
    )
}