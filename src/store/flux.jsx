const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            watchlist: JSON.parse(localStorage.getItem("watchlist")) || []
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
        }
    };
};

export default getState;
