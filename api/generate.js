import { InferenceClient } from "@huggingface/inference";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt } = req.body || {};
    const HF_TOKEN = process.env.HF_API_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "No se encontró el token de Hugging Face en Vercel." });
    }

    const client = new InferenceClient(HF_TOKEN);

    const imageBlob = await client.textToImage({
      provider: "nscale",
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    return res.status(200).json({ image: `data:image/png;base64,${base64Image}` });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
