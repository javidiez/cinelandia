const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            watchlist: JSON.parse(localStorage.getItem("watchlist")) || [],
            watchlistSerie: JSON.parse(localStorage.getItem("watchlistSerie")) || [],
        },
        actions: {
            addFavouriteMovie: (favorito) => {
                const store = getStore();
                const isAlreadyInWatchlist = store.watchlist.some(item => item.id === favorito.id);

                if (!isAlreadyInWatchlist) {
                    const nuevosFavoritos = [...store.watchlist, favorito];
                    setStore({ watchlist: nuevosFavoritos });
                    localStorage.setItem("watchlist", JSON.stringify(nuevosFavoritos));
                }
            },
            deleteFavouriteMovie: (movieToRemove) => {
                const store = getStore();
                const nuevosFavoritos = store.watchlist.filter(item => item.id !== movieToRemove.id);
                setStore({ watchlist: nuevosFavoritos });
                localStorage.setItem("watchlist", JSON.stringify(nuevosFavoritos));
            },
            addFavouriteSerie: (favorito) => {
                const store = getStore();
                const isAlreadyInWatchlist = store.watchlistSerie.some(item => item.id === favorito.id);

                if (!isAlreadyInWatchlist) {
                    const nuevosFavoritos = [...store.watchlistSerie, favorito];
                    setStore({ watchlistSerie: nuevosFavoritos });
                    localStorage.setItem("watchlistSerie", JSON.stringify(nuevosFavoritos));
                }
            },
            deleteFavouriteSerie: (movieToRemove) => {
                const store = getStore();
                const nuevosFavoritos = store.watchlistSerie.filter(item => item.id !== movieToRemove.id);
                setStore({ watchlistSerie: nuevosFavoritos });
                localStorage.setItem("watchlistSerie", JSON.stringify(nuevosFavoritos));
            },
        }
    };
};

export default getState;
