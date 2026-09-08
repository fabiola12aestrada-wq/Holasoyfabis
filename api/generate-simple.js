// /api/generate-simple.js
// Vercel Serverless Function para el Generador simple del Dashboard
// (independiente del Storyboard). Recibe { prompt, user_id } y guarda
// el resultado en la tabla `generated_images` (no en `scenes`).

import { InferenceClient } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt, user_id } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "prompt es requerido" });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return res.status(500).json({ error: "HF_TOKEN no está configurado en las variables de entorno de Vercel." });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: "SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configurados en Vercel." });
    }

    const client = new InferenceClient(HF_TOKEN);

    const imageBlob = await client.textToImage({
      provider: "auto",
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
    });

    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // --- Subir a Supabase Storage (bucket separado del de escenas) ---
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
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

    // --- Guardar en la tabla generated_images (no en scenes) ---
    await supabase.from("generated_images").insert({
      prompt: prompt,
      image_url: publicUrl,
      user_id: user_id || null,
    });

    return res.status(200).json({ imageUrl: publicUrl });

  } catch (error) {
    const detail = error && error.cause ? (error.cause.message || String(error.cause)) : null;
    return res.status(500).json({ error: error.message, cause: detail });
  }
}
