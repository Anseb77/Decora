import React, { useState, useEffect } from "react";
import "./App.css";

const API_GIPHY = process.env.REACT_APP_GIPHY_KEY;

function App() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const buscar = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    let urlGiphy = `https://api.giphy.com/v1/gifs/search?api_key=${API_GIPHY}&q=${query}&limit=50`;
    if (category) {
      urlGiphy += `&tag=${category}`;
    }

    try {
      const res = await fetch(urlGiphy);
      const data = await res.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error("Error al buscar:", error);
      setError("Hubo un error al obtener los datos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const cargarMas = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    let urlGiphy = `https://api.giphy.com/v1/gifs/search?api_key=${API_GIPHY}&q=${query}&limit=50&offset=${gifs.length}`;
    if (category) {
      urlGiphy += `&tag=${category}`;
    }

    try {
      const res = await fetch(urlGiphy);
      const data = await res.json();
      setGifs((prevGifs) => [...prevGifs, ...data.data]);
    } catch (error) {
      console.error("Error al cargar más GIFs:", error);
      setError("Hubo un error al obtener los datos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const limpiar = () => {
    setQuery("");
    setGifs([]);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        cargarMas();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [gifs]);

 


  const descargarGif = (url, title) => {
    fetch(url)
      .then(response => response.blob())  // Obtener el archivo como un blob
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);  // Crear una URL para el archivo
        link.download = `${title}.gif`;  // Nombre del archivo al descargar
        link.click();  // Disparar el click en el enlace para descargar
      })
      .catch(error => {
        console.error("Error al descargar el GIF:", error);
      });
  };

  return (
    <div>
      <h1>Buscador de GIFs</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Busca un Gif..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={buscar} className="buttonsearch">
          Buscar
        </button>
        <button onClick={limpiar} className="buttonsearch">
          Limpiar
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="container">
        <h2>Resultados</h2>
        <div className="grid">
          {gifs.length > 0 ? (
            gifs.map((gif) => (
              <div key={gif.id} className="gif-container">
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <div className="buttons-container">
                  {/* Botón de descarga */}
                  <div className="buttondescarga">
                    <button
                      onClick={() => descargarGif(gif.images.fixed_height.url, gif.title)}
                      className="download-button Btn"
                    >
                      <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron GIFs</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
