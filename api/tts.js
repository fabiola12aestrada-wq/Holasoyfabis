// /api/tts.js
// Vercel Serverless Function: convierte texto a voz usando Hugging Face
// Inference Providers — reutiliza el MISMO HF_TOKEN que ya tenés configurado
// para /api/generate.js. No hace falta ninguna variable de entorno nueva.
//
// Flujo: recibe { text, lang } -> llama al modelo TTS de Hugging Face
// correspondiente al idioma -> devuelve el audio en crudo (audio/flac o
// audio/wav según el modelo) para que el navegador lo decodifique con
// AudioContext.decodeAudioData().

import { InferenceClient } from '@huggingface/inference';

// Un modelo por idioma (familia MMS de Meta, buena calidad y gratis en HF).
// Agregá más entradas si necesitás otros idiomas.
const TTS_MODELS = {
  es: 'facebook/mms-tts-spa',
  en: 'facebook/mms-tts-eng',
  pt: 'facebook/mms-tts-por',
  fr: 'facebook/mms-tts-fra',
};

function pickModel(lang) {
  const code = (lang || 'es').slice(0, 2).toLowerCase();
  return TTS_MODELS[code] || TTS_MODELS.es;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { text, lang } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Falta el texto a narrar' });
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: 'HF_TOKEN no configurado en las variables de entorno de Vercel' });
  }

  try {
    const hf = new InferenceClient(hfToken);
    const model = pickModel(lang);

    // Los modelos MMS no están pensados para textos larguísimos; recortamos
    // por las dudas para que la llamada no falle en escenas con guiones muy largos.
    const audioBlob = await hf.textToSpeech({
      model: model,
      inputs: text.slice(0, 600),
    });

    const buffer = Buffer.from(await audioBlob.arrayBuffer());
    res.setHeader('Content-Type', audioBlob.type || 'audio/flac');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Error generando TTS:', err);
    return res.status(500).json({ error: 'No se pudo generar la narración: ' + err.message });
  }
}
