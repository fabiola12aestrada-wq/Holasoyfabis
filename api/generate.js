// /api/generate.js
// Vercel Serverless Function. El token vive SOLO aquí (variable de entorno),
// nunca llega al navegador del usuario.
//
// Usa el SDK oficial @huggingface/inference (Inference Providers), que
// reemplazó al viejo endpoint api-inference.huggingface.co para modelos
// grandes de imagen como FLUX / Stable Diffusion.

import { InferenceClient } from '@huggingface/inference';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { modelId, prompt } = req.body || {};

  if (!modelId || !prompt) {
    return res.status(400).json({ error: 'modelId y prompt son requeridos' });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'HF_TOKEN no está configurado en las variables de entorno de Vercel' });
  }

  try {
    const client = new InferenceClient(token);

    // provider "auto" deja que Hugging Face elija el proveedor disponible
    // (fal-ai, replicate, etc.) para ese modelo.
    const imageBlob = await client.textToImage({
      model: modelId,
      inputs: prompt,
      provider: 'auto'
    });

    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    res.setHeader('Content-Type', imageBlob.type || 'image/png');
    return res.status(200).send(buffer);
  } catch (err) {
    var detail = err && err.cause ? (err.cause.message || String(err.cause)) : null;
    return res.status(500).json({ error: err.message, cause: detail });
  }
}
