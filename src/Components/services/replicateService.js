/* eslint-disable no-unused-vars */
import axios from "axios";

export const applyVikingStyle = async (imageUrl, passed) => {


  console.log("Passed desde replicate:", passed);
  try {
    // Paso 1: Enviar solo la imagen al backend (sin prompt ni configuración)
    const postResponse = await axios.post("https://photoeventouch-1.onrender.com/api/predictions", {
      image: imageUrl,
      passed: passed,
    });

    const predictionId = postResponse.data.id;

    // Paso 2: Hacer polling para obtener el resultado final
    return await new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const resultResponse = await axios.get(`https://photoeventouch-1.onrender.com/api/result/${predictionId}`);
          const { status, output } = resultResponse.data;

          if (status === "succeeded") {
            clearInterval(interval);
            resolve(output);
          }

          if (status === "failed") {
            clearInterval(interval);
            reject("La predicción falló.");
          }
        } catch (error) {
          clearInterval(interval);
          reject("Error al consultar el resultado de Replicate.");
        }
      }, 2000);
    });
  } catch (error) {
    console.error("Error al aplicar estilo desde el frontend:", error);
    return null;
  }
};
