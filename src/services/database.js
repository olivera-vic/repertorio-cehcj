import { openDB } from "idb";

const DB_NAME = "acordes-cehcj";
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Tabla de canciones
    if (!db.objectStoreNames.contains("songs")) {
      db.createObjectStore("songs", {
        keyPath: "id",
      });
    }

    // Configuración local
    if (!db.objectStoreNames.contains("config")) {
      db.createObjectStore("config", {
        keyPath: "id",
      });
    }
  },
});

// =========================
// CANCIONES
// =========================

// Obtener todas las canciones
export async function getSongs() {
  const db = await dbPromise;
  return await db.getAll("songs");
}

// Obtener una canción por ID
export async function getSong(id) {
  const db = await dbPromise;
  return await db.get("songs", Number(id));
}

// Guardar una canción
export async function saveSong(song) {
  const db = await dbPromise;
  await db.put("songs", song);
}

// Guardar varias canciones
export async function saveSongs(songs) {
  const db = await dbPromise;

  const tx = db.transaction("songs", "readwrite");

  for (const song of songs) {
    tx.store.put(song);
  }

  await tx.done;
}

// Eliminar todas las canciones
export async function clearSongs() {
  const db = await dbPromise;
  await db.clear("songs");
}

// =========================
// CONFIGURACIÓN
// =========================

// Obtener configuración
export async function getConfig() {
  const db = await dbPromise;
  return await db.get("config", 1);
}

// Guardar configuración
export async function saveConfig(config) {
  const db = await dbPromise;

  await db.put("config", {
    id: 1,
    ...config,
  });
}