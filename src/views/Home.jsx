import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import SearchBar from "../components/SearchBar";
import { sincronizarCanciones } from "../services/sync";

function Home() {
  const [canciones, setCanciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarCanciones();
  }, []);

  async function cargarCanciones() {
    const data = await sincronizarCanciones();

    data.sort((a, b) => a.titulo.localeCompare(b.titulo));

    setCanciones(data);
  }

  const cancionesFiltradas = canciones.filter((cancion) =>
    cancion.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <h2
        className="text-center mb-4"
        style={{
          color: "#999",
          fontWeight: "700",
        }}
      >
        Canciones ({canciones.length})
      </h2>

      <SearchBar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      <div className="mt-4">
        {cancionesFiltradas.map((cancion) => (
          <SongCard
            key={cancion.id}
            id={cancion.id}
            titulo={cancion.titulo}
            tono={cancion.tono}
          />
        ))}
      </div>
    </>
  );
}

export default Home;