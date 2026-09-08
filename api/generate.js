// /api/generate.js
// Vercel Serverless Function. El token de HF y la llave de servicio de
// Supabase viven SOLO aquí (variables de entorno), nunca llegan al navegador.
//
// Flujo: recibe { modelId, prompt, sceneId, label, script } ->
// genera la imagen con Inference Providers -> la sube a Supabase Storage ->
// guarda/actualiza la fila de la escena en la tabla `scenes` -> devuelve la
// URL pública de la imagen.

import { InferenceClient } from '@huggingface/inference';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { modelId, prompt, sceneId, label, script } = req.body || {};

  if (!modelId || !prompt || !sceneId) {
    return res.status(400).json({ error: 'modelId, prompt y sceneId son requeridos' });
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: 'HF_TOKEN no está configurado en las variables de entorno de Vercel' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configurados en Vercel' });
  }

  try {
    // 1. Generar la imagen
    const hf = new InferenceClient(hfToken);
    const imageBlob = await hf.textToImage({
      model: modelId,
      inputs: prompt,
      provider: 'auto'
    });
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    const contentType = imageBlob.type || 'image/png';

    // 2. Subirla a Supabase Storage (bucket público "scene-images")
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const fileName = sceneId + '-' + Date.now() + '.png';

    const { error: uploadError } = await supabase
      .storage
      .from('scene-images')
      .upload(fileName, buffer, { contentType: contentType, upsert: true });

    if (uploadError) {
      return res.status(500).json({ error: 'Error subiendo imagen a Supabase: ' + uploadError.message });
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('scene-images')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 3. Guardar/actualizar la fila de la escena
    const { error: dbError } = await supabase
      .from('scenes')
      .upsert({
        id: sceneId,
        label: label || null,
        script: script || null,
        prompt: prompt,
        image_url: imageUrl,
        status: 'done',
        updated_at: new Date().toISOString()
      });

    if (dbError) {
      return res.status(500).json({ error: 'Error guardando en Supabase: ' + dbError.message });
    }

    return res.status(200).json({ imageUrl: imageUrl });
  } catch (err) {
    var detail = err && err.cause ? (err.cause.message || String(err.cause)) : null;
    return res.status(500).json({ error: err.message, cause: detail });
  }
}
