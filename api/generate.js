import { InferenceClient } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";

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
    const buffer = Buffer.from(arrayBuffer);

    // --- Subir a Supabase Storage ---
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const fileName = `imagen-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("generated-images")
      .upload(fileName, buffer, { contentType: "image/png" });

    if (uploadError) {
      return res.status(500).json({ error: "Error al subir imagen: " + uploadError.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from("generated-images")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // --- Guardar en la tabla ---
    await supabase.from("generated_images").insert({
      prompt: prompt,
      image_url: publicUrl,
    });

    // --- Devolver la imagen en base64 para mostrarla de inmediato ---
    const base64Image = buffer.toString("base64");
    return res.status(200).json({ image: `data:image/png;base64,${base64Image}` });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
