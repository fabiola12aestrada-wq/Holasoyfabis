// /api/tts.js
// Vercel Serverless Function: convierte texto a voz usando Pollinations.ai
// (gratis, sin API key, sin tarjeta registrada).
//
// Antes usábamos ElevenLabs, pero su plan Free bloquea el acceso vía API
// con error 402 a menos que se registre una tarjeta, aunque no se gasten
// créditos reales. Pollinations no tiene esa restricción.
//
// Mantiene la MISMA interfaz que antes (POST { text, lang } -> devuelve el
// audio en crudo con Content-Type de audio) para no tener que tocar el
// frontend que ya llama a este endpoint.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { text, voice } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Falta el texto a narrar' });
  }

  // Voces disponibles en Pollinations (estilo OpenAI): alloy, echo, fable,
  // onyx, nova, shimmer, coral, verse, ballad, ash, sage, marin, cedar.
  // "nova" es una buena voz neutra por defecto.
  const voiceToUse = voice || 'nova';

  try {
    const url = 'https://text.pollinations.ai/' + encodeURIComponent(text.slice(0, 3000)) +
      '?model=openai-audio&voice=' + encodeURIComponent(voiceToUse);

    const response = await fetch(url);

    if (!response.ok) {
      const errText = await response.text().catch(function () { return ''; });
      throw new Error('Pollinations TTS respondió ' + response.status + ': ' + errText.slice(0, 300));
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Error generando TTS:', err);
    return res.status(500).json({ error: 'No se pudo generar la narración: ' + err.message });
  }
}
