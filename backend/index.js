/* eslint-disable no-undef */
// backend/index.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
//TOKEN COMENTADO DEBE ACTIVARSE EN EL ARCHIVO .ENV para que funcione

const app = express();
app.use(
  cors({
    headers: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    origin: ["https://photoldpar.vercel.app/", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());



app.post("/api/predictions", async (req, res) => {
  const imageUrl = req.body.image;
  const passed = req.body.passed;
  console.log("URL de la imagen:", imageUrl);
  console.log("Passed desde el backend:", passed);

  // Definir el prompt según el estado de "passed"
// Generar prompt aleatorio entre 3 opciones
const prompts = [
  "Turn this photo into a digital illustration in watercolor comic style. The person's face must be identical and portray them as an empowered superhero with a vibrant, energetic background and vivid colors.",
  

  "Turn this photo into a realistic hand-drawn pencil  sketch. Emphasize freehand lines, natural imperfections, and visible pencil strokes. The portrait should look like it was sketched manually on textured paper, with soft shading, light crosshatching, and a subtle, expressive artistic touch."
];

// Selección aleatoria
const prompt = prompts[Math.floor(Math.random() * prompts.length)];

console.log("el prompt" , prompt)
  const replicateRequest = {
    version:
      "zsxkib/step1x-edit:12b5a5a61e3419f792eb56cfc16eed046252740ebf5d470228f9b4cf2c861610",
    input: {
      image: imageUrl,
      prompt: prompt,
      size_level: 512,
      output_format: "webp",
      output_quality: 80,
    },
  };

  console.log("Token de Replicate:", process.env.REPLICATE_API_TOKEN);

  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      replicateRequest,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Error al llamar a Replicate" });
  }
});

app.get("/api/result/:id", async (req, res) => {
  const predictionId = req.params.id;

  try {
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      }
    );

    const { status, output } = response.data;
    res.json({ status, output });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: "Error al obtener el resultado de Replicate" });
  }
});

app.listen(3000, () => {
  console.log("Servidor backend corriendo en http://localhost:3000");
});
