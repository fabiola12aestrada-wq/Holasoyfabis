// /api/tts.js
// Vercel Serverless Function: convierte texto a voz usando ElevenLabs.
// Requiere la variable de entorno ELEVENLABS_API_KEY en Vercel
// (Settings -> Environment Variables). Sacá tu clave gratis en
// https://elevenlabs.io -> tu perfil -> "API Keys".
//
// Antes usábamos un modelo de Hugging Face (facebook/mms-tts-spa), pero
// HF dejó de tenerlo disponible en sus "Inference Providers" — por eso
// tiraba 500. ElevenLabs no depende de esa disponibilidad.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Falta el texto a narrar' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY no configurado en las variables de entorno de Vercel' });
  }

  // Voz multilingüe de ejemplo (habla varios idiomas, incluido español).
  // Podés cambiarla por el ID de otra voz de tu cuenta de ElevenLabs
  // agregando la variable ELEVENLABS_VOICE_ID en Vercel si querés otra.
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.slice(0, 1000),
          model_id: 'eleven_multilingual_v2',
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(function () { return ''; });
      throw new Error('ElevenLabs respondió ' + response.status + ': ' + errText.slice(0, 300));
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Error generando TTS:', err);
    return res.status(500).json({ error: 'No se pudo generar la narración: ' + err.message });
  }
}
