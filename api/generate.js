// /api/generate.js
// Vercel Serverless Function. El token de HF y la llave de servicio de
// Supabase viven SOLO aquí (variables de entorno), nunca llegan al navegador.
//
// Flujo: recibe { modelId, prompt, sceneId, label, script } ->
// intenta generar la imagen probando una lista de modelos de Inference
// Providers -> si TODOS fallan, intenta Pollinations.ai (API gratuita sin
// key) -> si eso también falla, cae a un modo "mock" que elige una imagen
// de ejemplo según palabras clave del prompt -> sube la imagen (real o
// mock) a Supabase Storage -> guarda/actualiza la fila de la escena en la
// tabla `scenes` -> devuelve la URL pública + si fue mock o no.

import { InferenceClient } from '@huggingface/inference';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// 1. Lista de modelos a intentar, en orden. Si el frontend manda un modelId
//    específico, se prueba primero y luego sigue con el resto como respaldo.
// ---------------------------------------------------------------------------
const FALLBACK_MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'stabilityai/stable-diffusion-xl-base-1.0',
  'black-forest-labs/FLUX.1-dev',
  'stabilityai/stable-diffusion-3.5-large',
];

// ---------------------------------------------------------------------------
// 2. Imágenes mock categorizadas por palabra clave.
//    Sube tus propias imágenes de ejemplo a /public/mock-images/ en tu repo
//    (o a un bucket público de Supabase) y actualiza estas rutas.
//    La primera categoría cuyo keyword aparezca en el prompt gana.
//    "default" se usa si ninguna palabra clave hace match.
// ---------------------------------------------------------------------------
const MOCK_CATEGORIES = [
  { keywords: ['playa', 'mar', 'ocean', 'beach'], url: 'https://holasoyfabis.vercel.app/mock-images/playa.jpg' },
  { keywords: ['gato', 'cat', 'perro', 'dog', 'animal'], url: 'https://holasoyfabis.vercel.app/mock-images/animal.jpg' },
  { keywords: ['ciudad', 'city', 'urbano', 'edificio'], url: 'https://holasoyfabis.vercel.app/mock-images/ciudad.jpg' },
  { keywords: ['bosque', 'naturaleza', 'forest', 'arbol', 'árbol'], url: 'https://holasoyfabis.vercel.app/mock-images/naturaleza.jpg' },
  { keywords: ['retrato', 'persona', 'rostro', 'portrait', 'cara'], url: 'https://holasoyfabis.vercel.app/mock-images/retrato.jpg' },
  { keywords: ['espacio', 'space', 'galaxia', 'estrella', 'planeta'], url: 'https://holasoyfabis.vercel.app/mock-images/espacio.jpg' },
];
const MOCK_DEFAULT_URL = 'https://holasoyfabis.vercel.app/mock-images/default.jpg';

function pickMockImageUrl(prompt) {
  const lower = (prompt || '').toLowerCase();
  for (const category of MOCK_CATEGORIES) {
    if (category.keywords.some((kw) => lower.includes(kw))) {
      return category.url;
    }
  }
  return MOCK_DEFAULT_URL;
}

// ---------------------------------------------------------------------------
// 3.5. Pollinations.ai — API gratuita sin key, se intenta si TODOS los
//      modelos de Hugging Face fallan, antes de caer al modo mock.
// ---------------------------------------------------------------------------
async function tryPollinations(prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Pollinations respondió con estado ' + response.status);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  return { buffer, contentType, modelUsed: 'pollinations.ai' };
}

// ---------------------------------------------------------------------------
// 4. Intenta generar la imagen probando modelos en orden.
//    Devuelve { buffer, contentType, modelUsed } o lanza si todos fallan.
// ---------------------------------------------------------------------------
async function tryGenerateWithFallback(hf, requestedModelId, prompt) {
  const modelsToTry = [
    ...(requestedModelId ? [requestedModelId] : []),
    ...FALLBACK_MODELS.filter((m) => m !== requestedModelId),
  ];

  const errors = [];

  for (const modelId of modelsToTry) {
    try {
      const imageBlob = await hf.textToImage({
        model: modelId,
        inputs: prompt,
        provider: 'auto',
      });
      const buffer = Buffer.from(await imageBlob.arrayBuffer());
      const contentType = imageBlob.type || 'image/png';
      return { buffer, contentType, modelUsed: modelId };
    } catch (err) {
      const detail = err && err.cause ? (err.cause.message || String(err.cause)) : err.message;
      errors.push(`${modelId}: ${detail}`);
      // sigue con el siguiente modelo
    }
  }

  const combinedError = new Error('Todos los modelos fallaron: ' + errors.join(' | '));
  combinedError.allFailed = true;
  throw combinedError;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { modelId, prompt, sceneId, label, script } = req.body || {};

  if (!prompt || !sceneId) {
    return res.status(400).json({ error: 'prompt y sceneId son requeridos' });
  }

  const hfToken = process.env.HF_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configurados en Vercel' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let buffer;
  let contentType = 'image/png';
  let isMock = false;
  let modelUsed = null;
  let mockReason = null;

  try {
    if (!hfToken) {
      throw Object.assign(new Error('HF_TOKEN no configurado'), { allFailed: true });
    }
    const hf = new InferenceClient(hfToken);
    const result = await tryGenerateWithFallback(hf, modelId, prompt);
    buffer = result.buffer;
    contentType = result.contentType;
    modelUsed = result.modelUsed;
  } catch (hfErr) {
    // --- Todos los modelos de Hugging Face fallaron: probar Pollinations.ai ---
    try {
      const result = await tryPollinations(prompt);
      buffer = result.buffer;
      contentType = result.contentType;
      modelUsed = result.modelUsed;
    } catch (pollinationsErr) {
      // --- Pollinations también falló: caemos a modo mock ---
      isMock = true;
      mockReason = hfErr.message + ' | Pollinations: ' + pollinationsErr.message;

      const mockImageUrl = pickMockImageUrl(prompt);

      try {
        const { error: dbError } = await supabase
          .from('scenes')
          .upsert({
            id: sceneId,
            label: label || null,
            script: script || null,
            prompt: prompt,
            image_url: mockImageUrl,
            status: 'mock',
            updated_at: new Date().toISOString(),
          });

        if (dbError) {
          return res.status(500).json({ error: 'Error guardando escena mock en Supabase: ' + dbError.message });
        }
      } catch (dbErr) {
        return res.status(500).json({ error: 'Error inesperado guardando escena mock: ' + dbErr.message });
      }

      return res.status(200).json({
        imageUrl: mockImageUrl,
        isMock: true,
        message: 'Generación de ejemplo (servicio en mantenimiento)',
        debugReason: mockReason,
      });
    }
  }

  // --- Generación real exitosa: subir a Supabase Storage como antes ---
  try {
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

    const { error: dbError } = await supabase
      .from('scenes')
      .upsert({
        id: sceneId,
        label: label || null,
        script: script || null,
        prompt: prompt,
        image_url: imageUrl,
        status: 'done',
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      return res.status(500).json({ error: 'Error guardando en Supabase: ' + dbError.message });
    }

    return res.status(200).json({
      imageUrl: imageUrl,
      isMock: false,
      modelUsed: modelUsed,
    });
  } catch (err) {
    var detail = err && err.cause ? (err.cause.message || String(err.cause)) : null;
    return res.status(500).json({ error: err.message, cause: detail });
  }
}
