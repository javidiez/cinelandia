import React from 'react';

export const Footer = () => {

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: overview,
          url: window.location.href // Puedes cambiar esto por la URL de la película
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      alert('Web Share API not supported in this browser.');
    }
  };

    return (
        <footer className="footer bg-dark text-center mt-auto py-3 ">
        <div className="container">
          <span className="text-light">© 2024 Cinelandia. Información obtenida de <a href="https://www.themoviedb.org/" className='text-decoration-none' target='_blank'>TMDB</a>. Desarrollada por <a href="https://github.com/javidiez" className='text-decoration-none' target='_blank'>JD</a>.</span>
        <span  onClick={handleShare}>Compartir</span>
        </div>
      </footer>
    )
}