// /api/generate-simple.js
// Vercel Serverless Function para el Generador simple del Dashboard
// (independiente del Storyboard). Recibe { prompt, user_id } y guarda
// el resultado en la tabla `generated_images` (no en `scenes`).

import { InferenceClient } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";

// Traduce y enriquece el prompt (que puede venir en español y ser corto)
// a un prompt en inglés, detallado y fiel, usando Gemini.
// Si algo falla (sin API key, error de red, etc.) devuelve el prompt
// original tal cual, para que la generación de imagen nunca se rompa
// por este paso extra.
async function enhancePrompt(originalPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return originalPrompt;

  try {
    const systemPrompt =
      "You rewrite short user requests into a single, detailed English prompt " +
      "for an AI image generator (FLUX/Stable Diffusion style). " +
      "Preserve every subject, object, attribute and action the user mentioned — " +
      "do not drop or simplify any of them, and do not add unrelated elements. " +
      "Translate to English if needed. Add concrete visual detail (composition, " +
      "lighting, style) only to support what was asked, never to replace it. " +
      "Respond with ONLY the final prompt text, nothing else — no quotes, no labels.";

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: originalPrompt }] }],
        }),
      }
    );

    if (!geminiRes.ok) return originalPrompt;

    const data = await geminiRes.json();
    const content = ((data.candidates || [])[0] || {}).content;
    const enhanced = content && content.parts
      ? content.parts.map((p) => p.text || "").join("").trim()
      : "";

    return enhanced || originalPrompt;
  } catch (e) {
    return originalPrompt;
  }
}

// Intenta generar con RunPod (SDXL Turbo). Devuelve un Buffer PNG.
// Ajustar `data.output` según el formato real que devuelva tu worker
// (podés confirmarlo probando el endpoint desde el dashboard de RunPod).
async function generateWithRunPod(prompt) {
  const endpointId = process.env.RUNPOD_ENDPOINT_ID;
  const apiKey = process.env.RUNPOD_API_KEY;
  if (!endpointId || !apiKey) {
    throw new Error("RUNPOD_ENDPOINT_ID o RUNPOD_API_KEY no configurados");
  }

  const response = await fetch(
    `https://api.runpod.ai/v2/${endpointId}/runsync`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ input: { prompt } }),
    }
  );

  const data = await response.json();
  if (data.status !== "COMPLETED" || !data.output) {
    throw new Error("RunPod: " + (data.error || data.status || "sin output"));
  }

  // Soporta las formas más comunes de output de workers de SDXL en RunPod
  const base64 =
    typeof data.output === "string"
      ? data.output
      : data.output.image || (Array.isArray(data.output) ? data.output[0] : null);

  if (!base64) {
    throw new Error("RunPod: no se pudo leer la imagen del output");
  }

  return Buffer.from(base64, "base64");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt, user_id } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "prompt es requerido" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: "SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configurados en Vercel." });
    }

    const finalPrompt = await enhancePrompt(prompt);

    let buffer;
    let modelUsed = "runpod-sdxl-turbo";

    try {
      buffer = await generateWithRunPod(finalPrompt);
    } catch (runpodErr) {
      console.error("RunPod falló, probando Hugging Face:", runpodErr.message);

      const HF_TOKEN = process.env.HF_TOKEN;
      if (!HF_TOKEN) {
        return res.status(500).json({ error: "RunPod falló y HF_TOKEN no está configurado: " + runpodErr.message });
      }

      const client = new InferenceClient(HF_TOKEN);
      const imageBlob = await client.textToImage({
        provider: "auto",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: finalPrompt,
      });
      buffer = Buffer.from(await imageBlob.arrayBuffer());
      modelUsed = "black-forest-labs/FLUX.1-dev (fallback HF)";
    }

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
    // Se guarda el prompt ORIGINAL del usuario (lo que escribió), no el
    // prompt ya traducido/enriquecido, para que la galería siga mostrando
    // lo que él pidió.
    await supabase.from("generated_images").insert({
      prompt: prompt,
      image_url: publicUrl,
      user_id: user_id || null,
    });

    return res.status(200).json({ imageUrl: publicUrl, modelUsed });

  } catch (error) {
    const detail = error && error.cause ? (error.cause.message || String(error.cause)) : null;
    return res.status(500).json({ error: error.message, cause: detail });
  }
}

