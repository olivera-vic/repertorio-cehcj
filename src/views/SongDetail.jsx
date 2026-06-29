import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSong } from "../services/database";
import ChordLyrics from "../components/ChordLyrics";
import { transponerAcorde } from "../utils/transpose";

function SongDetail() {
  const { id } = useParams();

  const [song, setSong] = useState(null);
  const [tono, setTono] = useState("");
  const [transposicion, setTransposicion] = useState(0);

  useEffect(() => {
    // Al abrir una canción, comenzar siempre desde arriba
    window.scrollTo(0, 0);

    cargarCancion();
  }, [id]);

  async function cargarCancion() {
    const data = await getSong(id);

    if (!data) {
      console.log("Canción no encontrada");
      return;
    }

    setSong(data);
    setTono(data.tono);
    setTransposicion(0);
  }

  function cambiarTono(pasos) {
    setTransposicion((actual) => actual + pasos);

    setTono((actual) => transponerAcorde(actual, pasos));
  }

  if (!song) {
    return <h3>Cargando...</h3>;
  }

  return (
    <div
      className="mx-auto"
      style={{ maxWidth: "700px" }}
    >
      <button
        className="btn btn-secondary mb-4"
        onClick={() => window.history.back()}
      >
        ← Volver
      </button>

      <h2
        className="text-center fw-bold mb-4"
        style={{ color: "#666" }}
      >
        {song.titulo}
      </h2>

      <div className="d-flex align-items-center gap-2 mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => cambiarTono(-1)}
        >
          -
        </button>

        <button className="btn btn-primary">
          {tono}
        </button>

        <button
          className="btn btn-outline-primary"
          onClick={() => cambiarTono(1)}
        >
          +
        </button>
      </div>

      <ChordLyrics
        letra={song.letra}
        transposicion={transposicion}
      />
    </div>
  );
}

export default SongDetail;