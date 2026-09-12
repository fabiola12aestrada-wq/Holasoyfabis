// /api/generate.js
// Vercel Serverless Function.
// Flujo: intenta generar la imagen con RunPod (SDXL Turbo) -> si falla,
// cae a un modo "mock" que elige una imagen de ejemplo según palabras
// clave del prompt -> sube la imagen (real o mock) a Supabase Storage ->
// guarda/actualiza la fila de la escena en la tabla `scenes` -> devuelve
// la URL pública + si fue mock o no.

import { createClient } from '@supabase/supabase-js';

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

async function generateWithRunPod(prompt) {
  const response = await fetch(
    `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/runsync`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
      },
      body: JSON.stringify({ input: { prompt } }),
    }
  );
  const data = await response.json();
  if (data.status !== 'COMPLETED' || !data.output) {
    throw new Error('RunPod generation failed');
  }
  return data.output; // base64
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, sceneId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  let imageUrl;
  let isMock = false;

  try {
    const base64Image = await generateWithRunPod(prompt);

    const buffer = Buffer.from(base64Image, 'base64');
    const fileName = `scene-${sceneId || Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(fileName, buffer, { contentType: 'image/png', upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  } catch (err) {
    console.error('RunPod failed, falling back to mock:', err.message);
    imageUrl = pickMockImageUrl(prompt);
    isMock = true;
  }

  if (sceneId) {
    await supabase
      .from('scenes')
      .update({ image_url: imageUrl })
      .eq('id', sceneId);
  }

  return res.status(200).json({ imageUrl, isMock });
}
