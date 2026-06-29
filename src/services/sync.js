import { supabase } from "./supabase";
import {
  getSongs,
  saveSongs,
  getConfig,
  saveConfig,
} from "./database";

export async function sincronizarCanciones() {
  try {
    // Siempre mostrar primero las canciones locales
    const cancionesLocales = await getSongs();

    // Si no hay internet
    if (!navigator.onLine) {
      return cancionesLocales;
    }

    // Configuración local
    const configLocal =
      (await getConfig()) || {
        id: 1,
        ultima_actualizacion: null,
      };

    // Configuración del servidor
    const { data: configServidor, error: errorConfig } =
      await supabase
        .from("app_config")
        .select("*")
        .eq("id", 1)
        .single();

    if (errorConfig) throw errorConfig;

    // No hubo cambios
    if (
      configLocal.ultima_actualizacion ===
      configServidor.ultima_actualizacion
    ) {
      return cancionesLocales;
    }

    let cancionesActualizadas;

    // Primera sincronización
    if (!configLocal.ultima_actualizacion) {
      const { data, error } = await supabase
        .from("songs")
        .select("*");

      if (error) throw error;

      cancionesActualizadas = data;
    } else {
      // Solo canciones modificadas
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .gt(
          "updated_at",
          configLocal.ultima_actualizacion
        );

      if (error) throw error;

      cancionesActualizadas = data;
    }

    // Guardar únicamente las modificadas
    if (cancionesActualizadas.length > 0) {
      await saveSongs(cancionesActualizadas);
    }

    // Actualizar fecha de sincronización
    await saveConfig({
      ultima_actualizacion:
        configServidor.ultima_actualizacion,
    });

    // Devolver toda la base local
    return await getSongs();
  } catch (error) {
    console.error(error);

    return await getSongs();
  }
}