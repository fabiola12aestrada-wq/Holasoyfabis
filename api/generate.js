export default async function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt, model, parameters } = req.body || {};

    // Lee la variable de entorno configurada en Vercel
    const HF_TOKEN = process.env.HF_API_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "No se encontró el token de Hugging Face en Vercel." });
    }

    const selectedModel = model || "black-forest-labs/FLUX.1-schnell";

    // Llamada segura servidor -> Hugging Face
    const response = await fetch(`https://api-inference.huggingface.co/models/${selectedModel}`, {
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: parameters || {}
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    return res.status(200).json({ image: `data:image/png;base64,${base64Image}` });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
